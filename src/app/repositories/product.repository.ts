import { Types } from 'mongoose';
import productModel from '../models/product.model';
import { ProductInput } from '../validators/product.validator';
import productVariantModel from '../models/productVariant.model';
import { ProductDTO } from '../../types/Dto/productDTO';
import reviewModel from '../models/review.model';
import orderDetailModel from '../models/orderDetail.model';
import categoryModel from '../models/category.model';
import commonRepository from './common.repository';
import { attributeValueModel } from '../models/attributeValue.model';

class ProductRepository {
  create(data: ProductInput) {
    return productModel.create(data);
  }

  async getProductsByCategoryName(name: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const category = await categoryModel
      .findOne({
        name: { $regex: `^${name}$`, $options: 'i' },
      })
      .select('_id parentId');

    if (!category) return { result: [], totalProduct: 0 };

    let products;
    let totalProduct = 0;

    if (!category.parentId) {
      const children = await categoryModel.find({ parentId: category._id }).select('_id');
      const childrenIds = children.map(c => c._id);

      const categoryIds = childrenIds.length > 0 ? childrenIds : [category._id];

      totalProduct = await productModel.countDocuments({ categoryId: { $in: categoryIds } });
      products = await productModel
        .find({ categoryId: { $in: categoryIds } })
        .skip(skip)
        .limit(limit);
    } else {
      totalProduct = await productModel.countDocuments({ categoryId: category._id });
      products = await productModel.find({ categoryId: category._id }).skip(skip).limit(limit);
    }

    const productVariants = await productVariantModel.find({
      productId: { $in: products.map(p => p._id) },
    });

    const result: ProductDTO[] = await Promise.all(
      products.map(async product => {
        const variant = productVariants.find(v =>
          (v.productId as Types.ObjectId).equals(product._id as Types.ObjectId),
        );

        const { totalRating, reviewCount } = await commonRepository.getReviewTotal(
          product._id as Types.ObjectId,
        );

        const productType = await commonRepository.getProductType(product._id as Types.ObjectId);

        return {
          ...product.toObject(),
          _id: product._id as Types.ObjectId,
          discount: variant?.discount || null,
          attributeValueIds: variant
            ? await Promise.all(
                variant.attributeValueIds.map(async id => {
                  const attrValue = await attributeValueModel.findById(id).select('value');
                  return attrValue?.value;
                }),
              )
            : null,
          rating: totalRating,
          totalRating: reviewCount,
          categoryType: productType?.name,
          categoryRefType: productType?.related,
          inStock: variant?.quantity,
        };
      }),
    );

    return { result, totalProduct };
  }

  async getSpecialProducts(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const products: ProductDTO[] = await productVariantModel.aggregate([
      { $match: { 'discount.value': { $gt: 0 } } },
      {
        $group: {
          _id: '$productId',
          discount: { $first: '$discount' },
          attributeValueIds: { $first: '$attributeValueIds' },
          quantity: { $first: '$quantity' },
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },

      // NEW: Lookup attribute value docs
      {
        $lookup: {
          from: 'attributevalues',
          localField: 'attributeValueIds',
          foreignField: '_id',
          as: 'attributeValues',
        },
      },
      {
        $project: {
          _id: '$product._id',
          name: '$product.name',
          description: '$product.description',
          categoryId: '$product.categoryId',
          basePrice: '$product.basePrice',
          images: '$product.images',
          discount: '$discount',
          // convert to just array of value strings
          attributeValueIds: {
            $map: {
              input: '$attributeValues',
              as: 'attr',
              in: '$$attr.value',
            },
          },
          inStock: '$quantity',
        },
      },
      { $skip: skip },
      { $limit: limit },
    ]);

    const enhancedProducts = await Promise.all(
      products.map(async product => {
        const [typeInfo, reviewInfo] = await Promise.all([
          commonRepository.getProductType(product._id),
          commonRepository.getReviewTotal(product._id),
        ]);

        return {
          ...product,
          categoryType: typeInfo?.name,
          categoryRefType: typeInfo?.related,
          rating: reviewInfo.totalRating,
          reviewCount: reviewInfo.reviewCount,
        };
      }),
    );

    const countResult = await productVariantModel.aggregate([
      { $match: { 'discount.value': { $gt: 0 } } },
      { $group: { _id: '$productId' } },
      { $count: 'total' },
    ]);

    return { result: enhancedProducts, totalProduct: countResult[0]?.total || 0 };
  }

  async getTopDealProducts(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const products: ProductDTO[] = await reviewModel.aggregate([
      {
        $group: {
          _id: '$productId',
          avgRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 },
        },
      },
      { $sort: { avgRating: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $project: {
          _id: '$product._id',
          name: '$product.name',
          description: '$product.description',
          categoryId: '$product.categoryId',
          basePrice: '$product.basePrice',
          images: '$product.images',
          rating: '$avgRating',
          totalRating: '$reviewCount',
        },
      },
    ]);

    const enhancedProducts = await Promise.all(
      products.map(async product => {
        const typeInfo = await commonRepository.getProductType(product._id);
        const attributeValueIds = await commonRepository.getAttributeValueIdsProductVariant(
          product._id,
        );

        return {
          ...product,
          categoryType: typeInfo?.name,
          categoryRefType: typeInfo?.related,
          attributeValueIds: attributeValueIds,
        };
      }),
    );

    const countResult = await reviewModel.aggregate([
      { $group: { _id: '$productId' } },
      { $count: 'total' },
    ]);

    return { result: enhancedProducts, totalProduct: countResult[0]?.total || 0 };
  }

  async getBestSellingProducts(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const products = await orderDetailModel.aggregate([
      {
        $lookup: {
          from: 'productvariants',
          localField: 'productVariantId',
          foreignField: '_id',
          as: 'variant',
        },
      },
      { $unwind: '$variant' },
      {
        $group: {
          _id: '$variant.productId',
          totalSold: { $sum: '$quantity' },
          totalRevenue: { $sum: { $multiply: ['$quantity', '$price'] } },
        },
      },

      { $sort: { totalSold: -1 } },
      { $skip: skip },
      { $limit: limit },

      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },

      {
        $project: {
          _id: '$product._id',
          name: '$product.name',
          description: '$product.description',
          categoryId: '$product.categoryId',
          basePrice: '$product.basePrice',
          images: '$product.images',
        },
      },
    ]);

    const enhancedProducts = await Promise.all(
      products.map(async product => {
        const [typeInfo, reviewInfo, attributeValueIds] = await Promise.all([
          commonRepository.getProductType(product._id),
          commonRepository.getReviewTotal(product._id),
          commonRepository.getAttributeValueIdsProductVariant(product._id),
        ]);

        return {
          ...product,
          categoryType: typeInfo?.name,
          categoryRefType: typeInfo?.related,
          attributeValueIds: attributeValueIds,
          totalRating: reviewInfo?.reviewCount,
        };
      }),
    );

    const countResult = await orderDetailModel.aggregate([
      {
        $lookup: {
          from: 'productvariants',
          localField: 'productVariantId',
          foreignField: '_id',
          as: 'variant',
        },
      },
      { $unwind: '$variant' },
      { $group: { _id: '$variant.productId' } },
      { $count: 'total' },
    ]);

    return {
      result: enhancedProducts,
      totalProduct: countResult[0]?.total || 0,
    };
  }

  async getProducts(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const products = await productModel.find().skip(skip).limit(limit);
    const totalProduct = await productModel.countDocuments();
    const productVariants = await productVariantModel.find({
      productId: { $in: products.map(p => p._id) },
    });

    const result: ProductDTO[] = await Promise.all(
      products.map(async product => {
        const variant = productVariants.find(v =>
          (v.productId as Types.ObjectId).equals(product._id as Types.ObjectId),
        );

        const { totalRating, reviewCount } = await commonRepository.getReviewTotal(
          product._id as Types.ObjectId,
        );

        const productType = await commonRepository.getProductType(product._id as Types.ObjectId);

        return {
          ...product.toObject(),
          _id: product._id as Types.ObjectId,
          discount: variant?.discount || null,
          attributeValueIds: variant
            ? (
                await Promise.all(
                  variant.attributeValueIds.map(async id => {
                    const attrValue = await attributeValueModel.findById(id).select('value');
                    return attrValue?.value;
                  }),
                )
              ).filter((v): v is string => typeof v === 'string')
            : null,
          rating: totalRating,
          totalRating: reviewCount,
          categoryType: productType?.name,
          categoryRefType: productType?.related,
          inStock: variant?.quantity,
        };
      }),
    );

    return { result, totalProduct };
  }
}

export default new ProductRepository();

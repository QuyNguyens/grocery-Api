import { Types } from 'mongoose';
import productModel from '../models/product.model';
import { ProductInput } from '../validators/product.validator';
import productVariantModel from '../models/productVariant.model';
import { ProductDTO } from '../../types/Dto/productDTO';
import reviewModel from '../models/review.model';
import orderDetailModel from '../models/orderDetail.model';
import categoryModel from '../models/category.model';
import commonRepository from './common.repository';

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
      .select('_id');

    const categoryId = category?._id;
    if (!categoryId) return { result: [], totalProduct: 0 };
    const totalProduct = await productModel.find({ categoryId }).countDocuments();
    const products = await productModel.find({ categoryId }).skip(skip).limit(limit);

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
          attributeValueIds: variant?.attributeValueIds || null,
          rating: totalRating,
          totalRating: reviewCount,
          categoryType: productType?.name,
          categoryRefType: productType?.related,
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
      {
        $project: {
          _id: '$product._id',
          name: '$product.name',
          description: '$product.description',
          categoryId: '$product.categoryId',
          basePrice: '$product.basePrice',
          images: '$product.images',
          discount: '$discount',
          attributeValueIds: '$attributeValueIds',
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
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
    const products: ProductDTO[] = await orderDetailModel.aggregate([
      {
        $group: {
          _id: '$productId',
          totalSold: { $sum: '$quantity' },
          totalRevenue: { $sum: { $multiply: ['$quantity', '$price'] } },
        },
      },
      { $sort: { totalSold: -1 } },
      {
        $skip: skip,
      },
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
      { $group: { _id: '$productId' } },
      { $count: 'total' },
    ]);

    return { result: enhancedProducts, totalProduct: countResult[0]?.total || 0 };
  }
}

export default new ProductRepository();

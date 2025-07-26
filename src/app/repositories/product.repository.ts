import { Types } from 'mongoose';
import productModel from '../models/product.model';
import { ProductInput } from '../validators/product.validator';
import productVariantModel from '../models/productVariant.model';
import { ProductDTO } from '../../types/Dto/productDTO';
import reviewModel from '../models/review.model';
import orderDetailModel from '../models/orderDetail.model';
import categoryModel from '../models/category.model';

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

    const result: ProductDTO[] = products.map(product => {
      const variant = productVariants.find(v =>
        (v.productId as Types.ObjectId).equals(product._id as Types.ObjectId),
      );
      return {
        ...product.toObject(),
        discount: variant?.discount || null,
      };
    });

    return { result, totalProduct };
  }

  async getSpecialProducts(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const result: ProductDTO[] = await productVariantModel.aggregate([
      { $match: { 'discount.value': { $gt: 0 } } },
      { $group: { _id: '$productId', discount: { $first: '$discount' } } },
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
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    const countResult = await productVariantModel.aggregate([
      { $match: { 'discount.value': { $gt: 0 } } },
      { $group: { _id: '$productId' } },
      { $count: 'total' },
    ]);

    return { result, totalProduct: countResult[0]?.total || 0 };
  }

  async getTopDealProducts(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const result: ProductDTO[] = await reviewModel.aggregate([
      {
        $group: {
          _id: '$productId',
          avgRating: { $avg: '$rating' },
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
        },
      },
    ]);

    const countResult = await reviewModel.aggregate([
      { $group: { _id: '$productId' } },
      { $count: 'total' },
    ]);

    return { result, totalProduct: countResult[0]?.total || 0 };
  }

  async getBestSellingProducts(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const result = await orderDetailModel.aggregate([
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
          rating: '$avgRating',
        },
      },
    ]);

    const countResult = await orderDetailModel.aggregate([
      { $group: { _id: '$productId' } },
      { $count: 'total' },
    ]);

    return { result, totalProduct: countResult[0]?.total || 0 };
  }
}

export default new ProductRepository();

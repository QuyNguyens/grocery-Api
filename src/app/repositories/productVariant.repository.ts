import { Types } from 'mongoose';
import { generateSku } from '../helpers/generateSku';
import productVariantModel from '../models/productVariant.model';
import { ProductVariantInput } from '../validators/productVariant.validator';
import { attributeModel, attributeValueModel } from '../models/attributeValue.model';
import { ProductVariantDTO, UserRating } from '../../types/Dto/productVariantDTO';
import reviewModel from '../models/review.model';

class ProductVariantRepository {
  async getByProductId(productId: Types.ObjectId) {
    const result = await productVariantModel.aggregate([
      { $match: { productId: productId } },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $project: {
          price: 1,
          currentPrice: 1,
          discount: 1,
          quantity: 1,
          sku: 1,
          attributeValueIds: 1,
          productId: 1,
          images: '$product.images',
          name: '$product.name',
          description: '$product.description',
        },
      },
      { $sample: { size: 1 } },
    ]);

    const productVariant: ProductVariantDTO = result[0];
    if (!productVariant) return [];

    const attributeValues = await attributeValueModel
      .find({
        _id: { $in: productVariant?.attributeValueIds },
      })
      .populate('attributeId');

    const attributeName = await attributeModel
      .findOne({ _id: attributeValues[0].attributeId })
      .select('name');

    const rating = await reviewModel.aggregate([
      { $match: { productId: productId } },
      {
        $group: {
          _id: '$productId',
          totalRating: { $sum: '$rating' },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    const totalRating = rating[0]?.totalRating ?? 0;
    const reviewCount = rating[0]?.reviewCount ?? 0;
    productVariant.type = attributeName?.name;
    productVariant.attribute = attributeValues.map(item => item.value);
    productVariant.rating = {
      value: totalRating / reviewCount,
      total: reviewCount, 
    };

    const userRating: UserRating[] = await reviewModel.aggregate([
      {
        $match: { productId: productId },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          rating: 1,
          comment: 1,
          createdAt: 1,
          name: '$user.name',
          avatar: '$user.avatar',
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    productVariant.userRating = userRating;
    return productVariant;
  }

  create(data: ProductVariantInput) {
    data.sku = generateSku();
    return productVariantModel.create(data);
  }
}

export default new ProductVariantRepository();

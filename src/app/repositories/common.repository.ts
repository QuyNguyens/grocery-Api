import { Types } from 'mongoose';
import reviewModel from '../models/review.model';
import productModel from '../models/product.model';
import categoryModel from '../models/category.model';
import productVariantModel from '../models/productVariant.model';

class CommonRepository {
  async getReviewTotal(productId: Types.ObjectId) {
    const reviews = await reviewModel.aggregate([
      { $match: { productId: productId } },
      {
        $group: {
          _id: '$productId',
          totalRating: { $sum: '$rating' },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    const reviewCount = reviews[0]?.reviewCount ?? 0;
    let totalRating = reviews[0]?.totalRating ?? 0;
    return { totalRating, reviewCount };
  }

  async getProductType(productId: Types.ObjectId) {
    const result = await productModel.aggregate([
      { $match: { _id: productId } },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
      {
        $project: {
          name: '$category.name',
          parentId: '$category.parentId',
        },
      },
    ]);

    const category = result[0];
    if (!category) return null;

    const relatedCategories = await categoryModel
      .find({ parentId: category.parentId })
      .select('name');

    return {
      name: category.name,
      related: relatedCategories.map(c => c.name),
    };
  }

  async getAttributeValueIdsProductVariant(productId: Types.ObjectId): Promise<string[]> {
    const variants = await productVariantModel
      .find({ productId })
      .select('attributeValueIds')
      .lean();

    const allAttributeValueIds = variants.flatMap(v => v.attributeValueIds);

    return allAttributeValueIds;
  }
}

export default new CommonRepository();

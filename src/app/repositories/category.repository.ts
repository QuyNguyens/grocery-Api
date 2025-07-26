import categoryModel from '../models/category.model';
import { CategoryInput } from '../validators/category.validator';

class CategoryRepository {
  async get() {
    const result = await categoryModel.aggregate([
      {
        $match: {
          parentId: { $ne: null },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'parentId',
          foreignField: '_id',
          as: 'parent',
        },
      },
      {
        $unwind: '$parent',
      },
      {
        $group: {
          _id: '$parentId',
          parentName: { $first: '$parent.name' },
          children: {
            $push: {
              _id: '$_id',
              name: '$name',
              description: '$description',
              imageUrl: '$imageUrl',
              createdAt: '$createdAt',
            },
          },
        },
      },
    ]);

    return result;
  }

  create(data: CategoryInput) {
    return categoryModel.create(data);
  }
}

export default new CategoryRepository();

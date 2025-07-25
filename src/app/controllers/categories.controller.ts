import { Request, Response } from 'express';
import { CategoryInput } from '../validators/category.validator';
import categoryService from '../services/category.service';
import { success, error } from '../../utils/response';
import categoryModel from '../models/category.model';

class CategoriesController {
  create = async (req: Request, res: Response) => {
    try {
      const data: CategoryInput = req.body;
      const category = await categoryService.create(data);

      success(res, 201, 'Tạo danh mục thành công', category);
    } catch (err) {
      error(res, 500, 'Lỗi khi tạo danh mục');
    }
  };
  createAll = async (req: Request, res: Response) => {
    try {
      const { categories } = req.body;

      const result = await categoryModel.insertMany(categories);

      success(res, 201, 'Create done', result);
    } catch (err) {
      error(res, 500, 'failed');
    }
  };
}

export default new CategoriesController();

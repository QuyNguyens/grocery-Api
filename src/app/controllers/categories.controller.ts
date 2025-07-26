import { Request, Response } from 'express';
import { CategoryInput } from '../validators/category.validator';
import categoryService from '../services/category.service';
import { success, error } from '../../utils/response';
import categoryModel from '../models/category.model';

class CategoriesController {
  async get(req: Request, res: Response) {
    try {
      const result = await categoryService.get();

      success(res, 200, 'Lấy thành công danh mục', result);
    } catch (err) {
      error(res, 500, 'Lỗi khi lấy danh mục');
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data: CategoryInput = req.body;
      const category = await categoryService.create(data);

      success(res, 201, 'Tạo danh mục thành công', category);
    } catch (err) {
      error(res, 500, 'Lỗi khi tạo danh mục');
    }
  }
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

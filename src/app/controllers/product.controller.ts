import { Request, Response } from 'express';
import { ProductInput } from '../validators/product.validator';
import productService from '../services/product.service';
import { error, success } from '../../utils/response';
import { Types } from 'mongoose';

class ProductController {
  async create(req: Request, res: Response) {
    try {
      const data: ProductInput = req.body;
      const result = await productService.create(data);

      success(res, 201, 'Tạo sản phẩm thành công', result);
    } catch (err) {
      error(res, 500, 'Lỗi khi tạo sản phẩm');
    }
  }

  async getProductsByCategoryName(req: Request, res: Response) {
    try {
      const { name, page = 1, limit = 10 } = req.query;

      if (name === '') {
        return error(res, 400, 'Invalid category name');
      }

      const { result, totalProduct } = await productService.getProductsByCategoryName(
        name?.toString() || '',
        Number(page),
        Number(limit),
      );

      success(res, 200, 'Lấy thành công products', result, {
        currentPage: page,
        limit: limit,
        totalItems: totalProduct,
        totalPages: Math.ceil(totalProduct / Number(limit)),
      });
    } catch (err) {
      error(res, 500, 'Lấy products failed');
    }
  }

  async getSpecialProducts(req: Request, res: Response) {
    const { page = 1, limit = 10 } = req.query;
    try {
      const { result, totalProduct } = await productService.getSpecialProducts(
        Number(page),
        Number(limit),
      );
      success(res, 200, 'Lấy danh sách sản phẩm đặc biệt thành công', result, {
        currentPage: page,
        limit: limit,
        totalItems: totalProduct,
        totalPages: Math.ceil(totalProduct / Number(limit)),
      });
    } catch (err) {
      error(res, 500, 'Lấy danh sách sản phẩm đặc biệt thất bại');
    }
  }

  async getTopDealProducts(req: Request, res: Response) {
    const { page = 1, limit = 10 } = req.query;
    try {
      const { result, totalProduct } = await productService.getTopDealProducts(
        Number(page),
        Number(limit),
      );
      success(res, 200, 'Lấy danh sách sản phẩm topdeal thành công', result, {
        currentPage: page,
        limit: limit,
        totalItems: totalProduct,
        totalPages: Math.ceil(totalProduct / Number(limit)),
      });
    } catch (err) {
      error(res, 500, 'Lấy danh sách sản phẩm topdeal thất bại');
    }
  }

  async getBestSellingProducts(req: Request, res: Response) {
    const { page = 1, limit = 10 } = req.query;
    try {
      const { result, totalProduct } = await productService.getBestSellingProducts(
        Number(page),
        Number(limit),
      );
      success(res, 200, 'Lấy danh sách sản phẩm best selling thành công', result, {
        currentPage: page,
        limit: limit,
        totalItems: totalProduct,
        totalPages: Math.ceil(totalProduct / Number(limit)),
      });
    } catch (err) {
      error(res, 500, 'Lấy danh sách sản phẩm best selling thất bại');
    }
  }
}

export default new ProductController();

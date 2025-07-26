import { Request, Response } from 'express';
import { ProductVariantInput } from '../validators/productVariant.validator';
import productVariantService from '../services/productVariant.service';
import { error, success } from '../../utils/response';
import { Types } from 'mongoose';

class ProductVariantController {
  async getByProductId(req: Request, res: Response) {
    try {
      const { productId } = req.query;
      if (!productId) {
        return error(res, 400, 'Invalid productId');
      }
      const objectId = new Types.ObjectId(productId.toString());
      const result = await productVariantService.getByProductId(objectId);

      success(res, 200, 'Lấy sản phẩm thành công', result);
    } catch (err) {
      return error(res, 500, 'Lấy sản phẩm thất bại');
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data: ProductVariantInput = req.body;

      const result = await productVariantService.create(data);

      success(res, 201, 'Tạo thành công product variant', result);
    } catch (err) {
      error(res, 500, 'Tạo product variant thất bại');
    }
  }
}

export default new ProductVariantController();

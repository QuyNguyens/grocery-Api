import { Request, Response } from 'express';
import { ProductVariantInput } from '../validators/productVariant.validator';
import productVariantService from '../services/productVariant.service';
import { error, success } from '../../utils/response';

class ProductVariantController {
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

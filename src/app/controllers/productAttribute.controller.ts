import { Request, Response } from 'express';
import { IAttribute, IAttributeValue } from '../../types/productVariant';
import productAttributeService from '../services/productAttributeService';
import { error, success } from '../../utils/response';
import {
  ProductAttributeInput,
  ProductAttributeValueInput,
} from '../validators/productAttribute.validator';

class ProductAttributeController {
  async createAttribute(req: Request, res: Response) {
    try {
      const data: ProductAttributeInput = req.body;

      const result = await productAttributeService.createAttribute(data);

      success(res, 201, 'Tạo thành công Attribute', result);
    } catch (err) {
      error(res, 500, 'Thất bại khi tạo Attribute');
    }
  }

  async createAttributeValue(req: Request, res: Response) {
    try {
      const data: ProductAttributeValueInput = req.body;

      const result = await productAttributeService.createAttributeValue(data);

      success(res, 201, 'Tạo thành công AttributeValue', result);
    } catch (err) {
      error(res, 500, 'Thất bại khi tạo AttributeValue');
    }
  }
}

export default new ProductAttributeController();

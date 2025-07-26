import { Request, Response } from 'express';
import { CartInput } from '../validators/cart.validator';
import cartService from '../services/cart.service';
import { error, success } from '../../utils/response';
import { isValidObjectId, Types } from 'mongoose';

class CartController {
  async addCartItem(req: Request, res: Response) {
    try {
      const { userId } = req.query;
      const data: CartInput = req.body;
      if (!userId || typeof userId !== 'string' || !isValidObjectId(userId)) {
        return error(res, 400, 'Invalid userId');
      }
      const objectId = new Types.ObjectId(userId);

      const result = await cartService.addCartItem(data, objectId);

      success(res, 200, 'Thêm sản phẩm vào giỏ hàng thành công', result);
    } catch (err) {
      error(res, 500, 'Thêm sản phẩm vào giỏ hàng thất bại');
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { userId } = req.query;

      if (!userId || typeof userId !== 'string' || !isValidObjectId(userId)) {
        return error(res, 400, 'Invalid userId');
      }
      const objectId = new Types.ObjectId(userId);

      const result = await cartService.create(objectId);
      success(res, 200, 'Tạo giỏ hàng thành công', result);
    } catch (err) {
      error(res, 500, 'Tạo giỏ hàng thất bại');
    }
  }

  async get(req: Request, res: Response) {
    try {
      const { userId, page = 1, limit = 10 } = req.query;

      if (!userId || typeof userId !== 'string' || !isValidObjectId(userId)) {
        return error(res, 400, 'invalid userId');
      }
      const objectId = new Types.ObjectId(userId);

      const result = await cartService.get(objectId, Number(page), Number(limit));

      success(res, 200, 'Lấy thành công giỏ hàng', result);
    } catch (err) {
      error(res, 500, 'Lấy giỏ hàng thất bại');
    }
  }
}

export default new CartController();

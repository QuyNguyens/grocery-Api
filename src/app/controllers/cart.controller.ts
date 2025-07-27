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

  async updateCartItem(req: Request, res: Response) {
    try {
      const { userId, itemId, quantity } = req.query;

      if (
        !userId ||
        typeof userId !== 'string' ||
        !isValidObjectId(userId) ||
        !itemId ||
        typeof itemId !== 'string' ||
        !isValidObjectId(itemId)
      ) {
        return error(res, 400, 'invalid Id');
      }

      const objectUserId = new Types.ObjectId(userId);
      const objectItemId = new Types.ObjectId(itemId);

      await cartService.updateCartItem(objectUserId, objectItemId, Number(quantity));

      success(res, 200, 'Cập nhật số lượng thành công', { itemId, quantity });
    } catch (err) {
      error(res, 500, 'Lỗi khi cập nhật số lượng');
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

      const { result, totalCount } = await cartService.get(objectId, Number(page), Number(limit));

      success(res, 200, 'Lấy thành công giỏ hàng', result, {
        currentPage: page,
        limit: limit,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / Number(limit)),
      });
    } catch (err) {
      error(res, 500, 'Lấy giỏ hàng thất bại');
    }
  }
}

export default new CartController();

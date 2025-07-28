import { Request, Response } from 'express';
import { CartInput } from '../validators/cart.validator';
import cartService from '../services/cart.service';
import { error, success } from '../../utils/response';
import { isValidObjectId, Types } from 'mongoose';
import { ObjectValidator } from '../helpers/objectIdValidator';
import { ObjectIdConvert } from '../helpers/convert/ObjectIdConvert';

class CartController {
  async addCartItem(req: Request, res: Response) {
    try {
      const { userId } = req.query;
      const data: CartInput = req.body;
      if (!ObjectValidator(userId)) {
        return error(res, 400, 'Invalid userId');
      }

      const result = await cartService.addCartItem(data, ObjectIdConvert(userId?.toString() || ''));

      success(res, 200, 'Thêm sản phẩm vào giỏ hàng thành công', result);
    } catch (err) {
      error(res, 500, 'Thêm sản phẩm vào giỏ hàng thất bại');
    }
  }

  async updateCartItem(req: Request, res: Response) {
    try {
      const { userId, itemId, quantity } = req.query;

      if (!ObjectValidator(userId) || !ObjectValidator(itemId)) {
        return error(res, 400, 'invalid Id');
      }

      await cartService.updateCartItem(
        ObjectIdConvert(userId?.toString() || ''),
        ObjectIdConvert(itemId?.toString() || ''),
        Number(quantity),
      );

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

      if (!ObjectValidator(userId)) {
        return error(res, 400, 'invalid userId');
      }

      const { result, totalCount } = await cartService.get(
        ObjectIdConvert(userId?.toString() || ''),
        Number(page),
        Number(limit),
      );

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

  async deleteCartItem(req: Request, res: Response) {
    try {
      const { userId, itemId } = req.query;

      if (!ObjectValidator(userId) || !ObjectValidator(itemId)) {
        return error(res, 400, 'invalid Id');
      }

      await cartService.deleteCartItem(
        ObjectIdConvert(userId?.toString() || ''),
        ObjectIdConvert(itemId?.toString() || ''),
      );

      success(res, 204, 'Đã xóa item ra khỏi giỏ hàng thành công');
    } catch (err) {
      error(res, 500, 'Xóa item thất bại!!!');
    }
  }
}

export default new CartController();

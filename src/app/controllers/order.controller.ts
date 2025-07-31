import { Request, Response } from 'express';
import { IOrder, OrderStatus } from '../../types/order';
import orderService from '../services/order.service';
import { Types } from 'mongoose';
import { ICartItem } from '../../types/cart';
import { ObjectValidator } from '../helpers/objectIdValidator';
import { error, success } from '../../utils/response';
import { ObjectIdConvert } from '../helpers/convert/ObjectIdConvert';

class OrderController {
  async createOrder(order: IOrder) {
    try {
      const res = await orderService.createOrder(order);

      return res._id as Types.ObjectId;
    } catch (error) {
      return null;
    }
  }

  async createOrderDetail(orderId: Types.ObjectId, items: ICartItem[]) {
    try {
      const res = await orderService.createOrderDetail(orderId, items);
      return true;
    } catch (error) {
      return false;
    }
  }

  async updateStatusOrder(orderId: Types.ObjectId, status: OrderStatus) {
    try {
      return await orderService.updateStatusOrder(orderId, status);
    } catch (error) {
      return false;
    }
  }

  async getOrderDetail(req: Request, res: Response) {
    try {
      const { orderId } = req.query;
      if (!ObjectValidator(orderId)) {
        return error(res, 400, 'Invalid id');
      }
      const result = await orderService.getOrderDetail(ObjectIdConvert(orderId?.toString() || ''));
      success(res, 200, 'Lấy chi tiết đơn hàng thành công', result);
    } catch (err) {
      error(res, 500, 'Lấy chi tiết đơn hàng thất bại');
    }
  }

  async getOrders(req: Request, res: Response) {
    try {
      const { userId } = req.query;

      if (!ObjectValidator(userId)) {
        return error(res, 400, 'Invalid id');
      }
      const result = await orderService.getOrders(ObjectIdConvert(userId?.toString() || ''));

      success(res, 200, 'Lấy các đơn hàng thành công', result);
    } catch (err) {
      error(res, 500, 'Lấy đơn hàng thất bại');
    }
  }
}

export default new OrderController();

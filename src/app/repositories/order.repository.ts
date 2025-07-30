import { Types } from 'mongoose';
import { ICartItem } from '../../types/cart';
import { IOrder, OrderStatus } from '../../types/order';
import orderModel from '../models/order.model';
import { IOrderDetail } from '../../types/orderDetail';
import orderDetailModel from '../models/orderDetail.model';

class OrderRepository {
  createOrder(order: IOrder) {
    return orderModel.create(order);
  }

  async createOrderDetail(orderId: Types.ObjectId, items: ICartItem[]) {
    const createPromises = items.map(item => {
      const orderDetail: IOrderDetail = {
        orderId,
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        productVariantId: item.productVariantId,
        price: item.price,
        type: item.type,
      };

      return orderDetailModel.create(orderDetail);
    });

    await Promise.all(createPromises);
  }

  async updateStatusOrder(orderId: Types.ObjectId, status: OrderStatus) {
    const order = await orderModel.findById(orderId);
    if (!order) return false;
    order.status = status;
    order.save();
    return true;
  }

  getOrderDetail(orderId: Types.ObjectId) {
    return orderDetailModel.find({ orderId });
  }
}

export default new OrderRepository();

import { Types } from 'mongoose';
import { IOrder, OrderStatus } from '../../types/order';
import orderRepository from '../repositories/order.repository';
import { ICartItem } from '../../types/cart';

class OrderService {
  async createOrder(order: IOrder) {
    return await orderRepository.createOrder(order);
  }

  async createOrderDetail(orderId: Types.ObjectId, items: ICartItem[]) {
    return await orderRepository.createOrderDetail(orderId, items);
  }

  async updateStatusOrder(orderId: Types.ObjectId, status: OrderStatus) {
    return await orderRepository.updateStatusOrder(orderId, status);
  }

  async getOrderDetail(orderId: Types.ObjectId) {
    return await orderRepository.getOrderDetail(orderId);
  }

  async getOrders(userId: Types.ObjectId) {
    return await orderRepository.getOrders(userId);
  }
}

export default new OrderService();

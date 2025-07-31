"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_repository_1 = __importDefault(require("../repositories/order.repository"));
class OrderService {
    async createOrder(order) {
        return await order_repository_1.default.createOrder(order);
    }
    async createOrderDetail(orderId, items) {
        return await order_repository_1.default.createOrderDetail(orderId, items);
    }
    async updateStatusOrder(orderId, status) {
        return await order_repository_1.default.updateStatusOrder(orderId, status);
    }
    async getOrderDetail(orderId) {
        return await order_repository_1.default.getOrderDetail(orderId);
    }
    async getOrders(userId) {
        return await order_repository_1.default.getOrders(userId);
    }
}
exports.default = new OrderService();

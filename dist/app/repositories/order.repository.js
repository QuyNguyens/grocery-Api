"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_model_1 = __importDefault(require("../models/order.model"));
const orderDetail_model_1 = __importDefault(require("../models/orderDetail.model"));
class OrderRepository {
    createOrder(order) {
        return order_model_1.default.create(order);
    }
    async createOrderDetail(orderId, items) {
        const createPromises = items.map(item => {
            const orderDetail = {
                orderId,
                name: item.name,
                image: item.image,
                quantity: item.quantity,
                productVariantId: item.productVariantId,
                price: item.price,
                type: item.type,
            };
            return orderDetail_model_1.default.create(orderDetail);
        });
        await Promise.all(createPromises);
    }
    async updateStatusOrder(orderId, status) {
        const order = await order_model_1.default.findById(orderId);
        if (!order)
            return false;
        order.status = status;
        order.save();
        return true;
    }
    getOrderDetail(orderId) {
        return orderDetail_model_1.default.find({ orderId });
    }
    getOrders(userId) {
        return order_model_1.default.find({ userId });
    }
}
exports.default = new OrderRepository();

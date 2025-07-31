"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_service_1 = __importDefault(require("../services/order.service"));
const objectIdValidator_1 = require("../helpers/objectIdValidator");
const response_1 = require("../../utils/response");
const ObjectIdConvert_1 = require("../helpers/convert/ObjectIdConvert");
class OrderController {
    async createOrder(order) {
        try {
            const res = await order_service_1.default.createOrder(order);
            return res._id;
        }
        catch (error) {
            return null;
        }
    }
    async createOrderDetail(orderId, items) {
        try {
            const res = await order_service_1.default.createOrderDetail(orderId, items);
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async updateStatusOrder(orderId, status) {
        try {
            return await order_service_1.default.updateStatusOrder(orderId, status);
        }
        catch (error) {
            return false;
        }
    }
    async getOrderDetail(req, res) {
        try {
            const { orderId } = req.query;
            if (!(0, objectIdValidator_1.ObjectValidator)(orderId)) {
                return (0, response_1.error)(res, 400, 'Invalid id');
            }
            const result = await order_service_1.default.getOrderDetail((0, ObjectIdConvert_1.ObjectIdConvert)(orderId?.toString() || ''));
            (0, response_1.success)(res, 200, 'Lấy chi tiết đơn hàng thành công', result);
        }
        catch (err) {
            (0, response_1.error)(res, 500, 'Lấy chi tiết đơn hàng thất bại');
        }
    }
    async getOrders(req, res) {
        try {
            const { userId } = req.query;
            if (!(0, objectIdValidator_1.ObjectValidator)(userId)) {
                return (0, response_1.error)(res, 400, 'Invalid id');
            }
            const result = await order_service_1.default.getOrders((0, ObjectIdConvert_1.ObjectIdConvert)(userId?.toString() || ''));
            (0, response_1.success)(res, 200, 'Lấy các đơn hàng thành công', result);
        }
        catch (err) {
            (0, response_1.error)(res, 500, 'Lấy đơn hàng thất bại');
        }
    }
}
exports.default = new OrderController();

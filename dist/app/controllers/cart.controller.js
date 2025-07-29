"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cart_service_1 = __importDefault(require("../services/cart.service"));
const response_1 = require("../../utils/response");
const mongoose_1 = require("mongoose");
const objectIdValidator_1 = require("../helpers/objectIdValidator");
const ObjectIdConvert_1 = require("../helpers/convert/ObjectIdConvert");
class CartController {
    async addCartItem(req, res) {
        try {
            const { userId } = req.query;
            const data = req.body;
            if (!(0, objectIdValidator_1.ObjectValidator)(userId)) {
                return (0, response_1.error)(res, 400, 'Invalid userId');
            }
            const result = await cart_service_1.default.addCartItem(data, (0, ObjectIdConvert_1.ObjectIdConvert)(userId?.toString() || ''));
            (0, response_1.success)(res, 200, 'Thêm sản phẩm vào giỏ hàng thành công', result);
        }
        catch (err) {
            (0, response_1.error)(res, 500, 'Thêm sản phẩm vào giỏ hàng thất bại');
        }
    }
    async updateCartItem(req, res) {
        try {
            const { userId, itemId, quantity } = req.query;
            if (!(0, objectIdValidator_1.ObjectValidator)(userId) || !(0, objectIdValidator_1.ObjectValidator)(itemId)) {
                return (0, response_1.error)(res, 400, 'invalid Id');
            }
            await cart_service_1.default.updateCartItem((0, ObjectIdConvert_1.ObjectIdConvert)(userId?.toString() || ''), (0, ObjectIdConvert_1.ObjectIdConvert)(itemId?.toString() || ''), Number(quantity));
            (0, response_1.success)(res, 200, 'Cập nhật số lượng thành công', { itemId, quantity });
        }
        catch (err) {
            (0, response_1.error)(res, 500, 'Lỗi khi cập nhật số lượng');
        }
    }
    async create(req, res) {
        try {
            const { userId } = req.query;
            if (!userId || typeof userId !== 'string' || !(0, mongoose_1.isValidObjectId)(userId)) {
                return (0, response_1.error)(res, 400, 'Invalid userId');
            }
            const objectId = new mongoose_1.Types.ObjectId(userId);
            const result = await cart_service_1.default.create(objectId);
            (0, response_1.success)(res, 200, 'Tạo giỏ hàng thành công', result);
        }
        catch (err) {
            (0, response_1.error)(res, 500, 'Tạo giỏ hàng thất bại');
        }
    }
    async get(req, res) {
        try {
            const { userId, page = 1, limit = 10 } = req.query;
            if (!(0, objectIdValidator_1.ObjectValidator)(userId)) {
                return (0, response_1.error)(res, 400, 'invalid userId');
            }
            const { result, totalCount } = await cart_service_1.default.get((0, ObjectIdConvert_1.ObjectIdConvert)(userId?.toString() || ''), Number(page), Number(limit));
            (0, response_1.success)(res, 200, 'Lấy thành công giỏ hàng', result, {
                currentPage: page,
                limit: limit,
                totalItems: totalCount,
                totalPages: Math.ceil(totalCount / Number(limit)),
            });
        }
        catch (err) {
            (0, response_1.error)(res, 500, 'Lấy giỏ hàng thất bại');
        }
    }
    async deleteCartItem(req, res) {
        try {
            const { userId, itemId } = req.query;
            if (!(0, objectIdValidator_1.ObjectValidator)(userId) || !(0, objectIdValidator_1.ObjectValidator)(itemId)) {
                return (0, response_1.error)(res, 400, 'invalid Id');
            }
            await cart_service_1.default.deleteCartItem((0, ObjectIdConvert_1.ObjectIdConvert)(userId?.toString() || ''), (0, ObjectIdConvert_1.ObjectIdConvert)(itemId?.toString() || ''));
            (0, response_1.success)(res, 204, 'Đã xóa item ra khỏi giỏ hàng thành công');
        }
        catch (err) {
            (0, response_1.error)(res, 500, 'Xóa item thất bại!!!');
        }
    }
}
exports.default = new CartController();

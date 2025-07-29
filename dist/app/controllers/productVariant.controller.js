"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const productVariant_service_1 = __importDefault(require("../services/productVariant.service"));
const response_1 = require("../../utils/response");
const mongoose_1 = require("mongoose");
class ProductVariantController {
    async getByProductId(req, res) {
        try {
            const { productId } = req.query;
            if (!productId) {
                return (0, response_1.error)(res, 400, 'Invalid productId');
            }
            const objectId = new mongoose_1.Types.ObjectId(productId.toString());
            const result = await productVariant_service_1.default.getByProductId(objectId);
            (0, response_1.success)(res, 200, 'Lấy sản phẩm thành công', result);
        }
        catch (err) {
            return (0, response_1.error)(res, 500, 'Lấy sản phẩm thất bại');
        }
    }
    async create(req, res) {
        try {
            const data = req.body;
            const result = await productVariant_service_1.default.create(data);
            (0, response_1.success)(res, 201, 'Tạo thành công product variant', result);
        }
        catch (err) {
            (0, response_1.error)(res, 500, 'Tạo product variant thất bại');
        }
    }
}
exports.default = new ProductVariantController();

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const productVariant_repository_1 = __importDefault(require("../repositories/productVariant.repository"));
class ProductVariantService {
    async getByProductId(productId) {
        return await productVariant_repository_1.default.getByProductId(productId);
    }
    async create(data) {
        return await productVariant_repository_1.default.create(data);
    }
}
exports.default = new ProductVariantService();

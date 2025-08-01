"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_repository_1 = __importDefault(require("../repositories/product.repository"));
class ProductService {
    async create(data) {
        return await product_repository_1.default.create(data);
    }
    async getProductsByCategoryName(name, page, limit) {
        return await product_repository_1.default.getProductsByCategoryName(name, page, limit);
    }
    async getSpecialProducts(page, limit) {
        return await product_repository_1.default.getSpecialProducts(page, limit);
    }
    async getTopDealProducts(page, limit) {
        return await product_repository_1.default.getTopDealProducts(page, limit);
    }
    async getBestSellingProducts(page, limit) {
        return await product_repository_1.default.getBestSellingProducts(page, limit);
    }
    async getProducts(page, limit) {
        return await product_repository_1.default.getProducts(page, limit);
    }
    async filterProducts(keyword) {
        return await product_repository_1.default.filterProducts(keyword);
    }
}
exports.default = new ProductService();

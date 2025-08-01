"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_service_1 = __importDefault(require("../services/product.service"));
const response_1 = require("../../utils/response");
class ProductController {
    async create(req, res) {
        try {
            const data = req.body;
            const result = await product_service_1.default.create(data);
            (0, response_1.success)(res, 201, 'Tạo sản phẩm thành công', result);
        }
        catch (err) {
            (0, response_1.error)(res, 500, 'Lỗi khi tạo sản phẩm');
        }
    }
    async getProducts(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const { result, totalProduct } = await product_service_1.default.getProducts(Number(page), Number(limit));
            (0, response_1.success)(res, 200, 'Lấy sản phẩm thành công', result, {
                currentPage: page,
                limit: limit,
                totalItems: totalProduct,
                totalPages: Math.ceil(totalProduct / Number(limit)),
            });
        }
        catch (error) { }
    }
    async getProductsByCategoryName(req, res) {
        try {
            const { name, page = 1, limit = 10 } = req.query;
            if (name === '') {
                return (0, response_1.error)(res, 400, 'Invalid category name');
            }
            const { result, totalProduct } = await product_service_1.default.getProductsByCategoryName(name?.toString() || '', Number(page), Number(limit));
            (0, response_1.success)(res, 200, 'Lấy thành công products', result, {
                currentPage: page,
                limit: limit,
                totalItems: totalProduct,
                totalPages: Math.ceil(totalProduct / Number(limit)),
            });
        }
        catch (err) {
            (0, response_1.error)(res, 500, 'Lấy products failed');
        }
    }
    async getSpecialProducts(req, res) {
        const { page = 1, limit = 10 } = req.query;
        try {
            const { result, totalProduct } = await product_service_1.default.getSpecialProducts(Number(page), Number(limit));
            (0, response_1.success)(res, 200, 'Lấy danh sách sản phẩm đặc biệt thành công', result, {
                currentPage: page,
                limit: limit,
                totalItems: totalProduct,
                totalPages: Math.ceil(totalProduct / Number(limit)),
            });
        }
        catch (err) {
            (0, response_1.error)(res, 500, 'Lấy danh sách sản phẩm đặc biệt thất bại');
        }
    }
    async getTopDealProducts(req, res) {
        const { page = 1, limit = 10 } = req.query;
        try {
            const { result, totalProduct } = await product_service_1.default.getTopDealProducts(Number(page), Number(limit));
            (0, response_1.success)(res, 200, 'Lấy danh sách sản phẩm topdeal thành công', result, {
                currentPage: page,
                limit: limit,
                totalItems: totalProduct,
                totalPages: Math.ceil(totalProduct / Number(limit)),
            });
        }
        catch (err) {
            (0, response_1.error)(res, 500, 'Lấy danh sách sản phẩm topdeal thất bại');
        }
    }
    async getBestSellingProducts(req, res) {
        const { page = 1, limit = 10 } = req.query;
        try {
            const { result, totalProduct } = await product_service_1.default.getBestSellingProducts(Number(page), Number(limit));
            (0, response_1.success)(res, 200, 'Lấy danh sách sản phẩm best selling thành công', result, {
                currentPage: page,
                limit: limit,
                totalItems: totalProduct,
                totalPages: Math.ceil(totalProduct / Number(limit)),
            });
        }
        catch (err) {
            (0, response_1.error)(res, 500, 'Lấy danh sách sản phẩm best selling thất bại');
        }
    }
    async filterProducts(req, res) {
        try {
            const { keyword } = req.query;
            const result = await product_service_1.default.filterProducts(keyword?.toString() || '');
            (0, response_1.success)(res, 200, 'Tìm thấy các sản phẩm liên quan', result);
        }
        catch (err) {
            (0, response_1.error)(res, 500, 'Lỗi khi tìm kiếm sản phẩm');
        }
    }
}
exports.default = new ProductController();

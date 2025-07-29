"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const productAttributeService_1 = __importDefault(require("../services/productAttributeService"));
const response_1 = require("../../utils/response");
class ProductAttributeController {
    async createAttribute(req, res) {
        try {
            const data = req.body;
            const result = await productAttributeService_1.default.createAttribute(data);
            (0, response_1.success)(res, 201, 'Tạo thành công Attribute', result);
        }
        catch (err) {
            (0, response_1.error)(res, 500, 'Thất bại khi tạo Attribute');
        }
    }
    async createAttributeValue(req, res) {
        try {
            const data = req.body;
            const result = await productAttributeService_1.default.createAttributeValue(data);
            (0, response_1.success)(res, 201, 'Tạo thành công AttributeValue', result);
        }
        catch (err) {
            (0, response_1.error)(res, 500, 'Thất bại khi tạo AttributeValue');
        }
    }
}
exports.default = new ProductAttributeController();

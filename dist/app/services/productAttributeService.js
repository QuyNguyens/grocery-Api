"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const productAttribute_repository_1 = __importDefault(require("../repositories/productAttribute.repository"));
class ProductAttributeService {
    async createAttribute(data) {
        return await productAttribute_repository_1.default.createAttribute(data);
    }
    async createAttributeValue(data) {
        return await productAttribute_repository_1.default.createAttributeValue(data);
    }
}
exports.default = new ProductAttributeService();

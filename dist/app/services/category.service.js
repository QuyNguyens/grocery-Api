"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const category_repository_1 = __importDefault(require("../repositories/category.repository"));
class CategoryService {
    async get() {
        return await category_repository_1.default.get();
    }
    async create(data) {
        return await category_repository_1.default.create(data);
    }
}
exports.default = new CategoryService();

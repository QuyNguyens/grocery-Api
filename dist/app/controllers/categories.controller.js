"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const category_service_1 = __importDefault(require("../services/category.service"));
const response_1 = require("../../utils/response");
const category_model_1 = __importDefault(require("../models/category.model"));
class CategoriesController {
    constructor() {
        this.createAll = async (req, res) => {
            try {
                const { categories } = req.body;
                const result = await category_model_1.default.insertMany(categories);
                (0, response_1.success)(res, 201, 'Create done', result);
            }
            catch (err) {
                (0, response_1.error)(res, 500, 'failed');
            }
        };
    }
    async get(req, res) {
        try {
            const result = await category_service_1.default.get();
            (0, response_1.success)(res, 200, 'Lấy thành công danh mục', result);
        }
        catch (err) {
            (0, response_1.error)(res, 500, 'Lỗi khi lấy danh mục');
        }
    }
    async create(req, res) {
        try {
            const data = req.body;
            const category = await category_service_1.default.create(data);
            (0, response_1.success)(res, 201, 'Tạo danh mục thành công', category);
        }
        catch (err) {
            (0, response_1.error)(res, 500, 'Lỗi khi tạo danh mục');
        }
    }
}
exports.default = new CategoriesController();

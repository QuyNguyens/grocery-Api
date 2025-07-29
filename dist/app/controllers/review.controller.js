"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const review_service_1 = __importDefault(require("../services/review.service"));
const response_1 = require("../../utils/response");
class ReviewController {
    async create(req, res) {
        try {
            const data = req.body;
            const result = await review_service_1.default.create(data);
            (0, response_1.success)(res, 201, 'Tạo review thành công', result);
        }
        catch (err) {
            (0, response_1.error)(res, 500, 'Tạo review thất bại');
        }
    }
}
exports.default = new ReviewController();

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const review_model_1 = __importDefault(require("../models/review.model"));
class ReviewRepository {
    async create(data) {
        const existing = await review_model_1.default.findOne({ userId: data.userId, productId: data.productId });
        if (existing) {
            return null;
        }
        else {
            return review_model_1.default.create(data);
        }
    }
}
exports.default = new ReviewRepository();

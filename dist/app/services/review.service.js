"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const review_repository_1 = __importDefault(require("../repositories/review.repository"));
class ReviewService {
    async create(data) {
        return await review_repository_1.default.create(data);
    }
}
exports.default = new ReviewService();

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const review_model_1 = __importDefault(require("../models/review.model"));
class ReviewRepository {
    create(data) {
        return review_model_1.default.create(data);
    }
}
exports.default = new ReviewRepository();

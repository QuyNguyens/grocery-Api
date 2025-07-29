"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cart_repository_1 = __importDefault(require("../repositories/cart.repository"));
class CartService {
    async addCartItem(cartItem, userId) {
        return await cart_repository_1.default.addCartItem(cartItem, userId);
    }
    async updateCartItem(userId, itemId, quantity) {
        return await cart_repository_1.default.updateCartItem(userId, itemId, quantity);
    }
    async create(userId) {
        return await cart_repository_1.default.create(userId);
    }
    async get(userId, page, limit) {
        return await cart_repository_1.default.get(userId, page, limit);
    }
    async deleteCartItem(userId, itemId) {
        return await cart_repository_1.default.deleteCartItem(userId, itemId);
    }
}
exports.default = new CartService();

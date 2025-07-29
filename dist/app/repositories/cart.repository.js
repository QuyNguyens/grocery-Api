"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const cart_model_1 = __importDefault(require("../models/cart.model"));
const productVariant_model_1 = __importDefault(require("../models/productVariant.model"));
class CartRepository {
    async addCartItem(data, userId) {
        let cart = await cart_model_1.default.findOne({ userId });
        const cartItem = {
            productVariantId: new mongoose_1.Types.ObjectId(data.productVariantId),
            quantity: data.quantity,
            attributesSnapshot: data.attributesSnapshot,
            image: data.image,
            name: data.name,
            type: data.type,
        };
        let resultItem;
        if (cart) {
            const existingItem = cart.items.find(item => item.productVariantId.toString() === data.productVariantId &&
                item.attributesSnapshot?.value === data.attributesSnapshot?.value);
            if (existingItem) {
                existingItem.quantity += data.quantity;
                await cart.save();
                resultItem = existingItem;
            }
            else {
                cart.items.push(cartItem);
                await cart.save();
                resultItem = cart.items[cart.items.length - 1];
            }
        }
        else {
            cart = await cart_model_1.default.create({
                userId,
                items: [cartItem],
            });
            resultItem = cart.items[0];
        }
        const productVariant = await productVariant_model_1.default
            .findOne({ _id: resultItem.productVariantId })
            .populate('productId')
            .lean();
        const product = productVariant?.productId;
        const result = {
            _id: resultItem._id,
            productVariantId: resultItem.productVariantId,
            quantity: resultItem.quantity,
            attributesSnapshot: resultItem.attributesSnapshot,
            image: resultItem.image,
            name: resultItem.name,
            type: resultItem.type,
            price: product?.basePrice,
            discount: productVariant?.discount,
        };
        return result;
    }
    create(userId) {
        return cart_model_1.default.create({ userId, items: [] });
    }
    async get(userId, page, limit) {
        const skip = (page - 1) * limit;
        const cart = await cart_model_1.default.findOne({ userId });
        if (!cart || !cart.items.length)
            return { result: [], totalCount: 0 };
        const pagedItems = cart.items.slice(skip, skip + limit);
        const result = await Promise.all(pagedItems.map(async (cartItem) => {
            const product = await productVariant_model_1.default.findById(cartItem.productVariantId, {
                discount: 1,
                price: 1,
            });
            if (!product)
                return null;
            return {
                _id: cartItem._id,
                name: cartItem.name,
                discount: product.discount,
                quantity: cartItem.quantity,
                image: cartItem.image,
                attributesSnapshot: cartItem.attributesSnapshot,
                price: product.price,
                type: cartItem.type,
                productVariantId: cartItem.productVariantId,
            };
        }));
        const items = result.filter(item => item !== null);
        return { result: items, totalCount: cart.items.length };
    }
    async updateCartItem(userId, itemId, quantity) {
        const cart = await cart_model_1.default.findOne({ userId });
        if (!cart) {
            throw new Error('Cart not found');
        }
        const item = cart.items.find(item => item._id.equals(itemId));
        if (!item) {
            throw new Error('Cart item not found');
        }
        item.quantity = quantity;
        await cart.save();
        return { itemId, quantity };
    }
    async deleteCartItem(userId, itemId) {
        const cart = await cart_model_1.default.findOne({ userId });
        if (!cart) {
            throw new Error('Cart not found');
        }
        cart.items = cart.items.filter(item => !item._id?.equals(itemId));
        await cart.save();
    }
}
exports.default = new CartRepository();

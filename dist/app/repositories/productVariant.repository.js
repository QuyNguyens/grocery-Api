"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generateSku_1 = require("../helpers/generateSku");
const productVariant_model_1 = __importDefault(require("../models/productVariant.model"));
const attributeValue_model_1 = require("../models/attributeValue.model");
const review_model_1 = __importDefault(require("../models/review.model"));
const common_repository_1 = __importDefault(require("./common.repository"));
class ProductVariantRepository {
    async getByProductId(productId) {
        const result = await productVariant_model_1.default.aggregate([
            { $match: { productId: productId } },
            {
                $lookup: {
                    from: 'products',
                    localField: 'productId',
                    foreignField: '_id',
                    as: 'product',
                },
            },
            { $unwind: '$product' },
            {
                $project: {
                    price: 1,
                    currentPrice: 1,
                    discount: 1,
                    quantity: 1,
                    sku: 1,
                    attributeValueIds: 1,
                    productId: 1,
                    images: '$product.images',
                    name: '$product.name',
                    description: '$product.description',
                },
            },
            { $sample: { size: 1 } },
        ]);
        const productVariant = result[0];
        if (!productVariant)
            return [];
        const attributeValues = await attributeValue_model_1.attributeValueModel
            .find({
            _id: { $in: productVariant?.attributeValueIds },
        })
            .populate('attributeId');
        let attributeName;
        if (attributeValues.length > 0) {
            attributeName = await attributeValue_model_1.attributeModel
                .findOne({ _id: attributeValues[0].attributeId })
                .select('name');
        }
        const { totalRating, reviewCount } = await common_repository_1.default.getReviewTotal(productId);
        const typeInfo = await common_repository_1.default.getProductType(productId);
        productVariant.type = attributeName?.name || '';
        productVariant.categoryType = typeInfo?.name;
        productVariant.categoryRefType = typeInfo?.related;
        productVariant.attribute = attributeValues.map(item => item.value);
        productVariant.rating = {
            value: totalRating / reviewCount,
            total: reviewCount,
        };
        const userRating = await review_model_1.default.aggregate([
            {
                $match: { productId: productId },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            { $unwind: '$user' },
            {
                $project: {
                    userId: '$user._id',
                    rating: 1,
                    comment: 1,
                    createdAt: 1,
                    name: '$user.name',
                    avatar: '$user.avatar',
                },
            },
            { $sort: { createdAt: -1 } },
        ]);
        productVariant.userRating = userRating;
        return productVariant;
    }
    create(data) {
        data.sku = (0, generateSku_1.generateSku)();
        return productVariant_model_1.default.create(data);
    }
}
exports.default = new ProductVariantRepository();

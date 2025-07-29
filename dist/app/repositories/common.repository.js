"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const review_model_1 = __importDefault(require("../models/review.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
const category_model_1 = __importDefault(require("../models/category.model"));
const productVariant_model_1 = __importDefault(require("../models/productVariant.model"));
class CommonRepository {
    async getReviewTotal(productId) {
        const reviews = await review_model_1.default.aggregate([
            { $match: { productId: productId } },
            {
                $group: {
                    _id: '$productId',
                    totalRating: { $sum: '$rating' },
                    reviewCount: { $sum: 1 },
                },
            },
        ]);
        const reviewCount = reviews[0]?.reviewCount ?? 0;
        let totalRating = reviews[0]?.totalRating ?? 0;
        return { totalRating, reviewCount };
    }
    async getProductType(productId) {
        const result = await product_model_1.default.aggregate([
            { $match: { _id: productId } },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'category',
                },
            },
            { $unwind: '$category' },
            {
                $project: {
                    name: '$category.name',
                    parentId: '$category.parentId',
                },
            },
        ]);
        const category = result[0];
        if (!category)
            return null;
        const relatedCategories = await category_model_1.default
            .find({ parentId: category.parentId })
            .select('name');
        return {
            name: category.name,
            related: relatedCategories.map(c => c.name),
        };
    }
    async getAttributeValueIdsProductVariant(productId) {
        const variants = await productVariant_model_1.default
            .find({ productId })
            .select('attributeValueIds')
            .lean();
        const allAttributeValueIds = variants.flatMap(v => v.attributeValueIds);
        return allAttributeValueIds;
    }
}
exports.default = new CommonRepository();

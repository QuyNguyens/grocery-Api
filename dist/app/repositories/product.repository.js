"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_model_1 = __importDefault(require("../models/product.model"));
const productVariant_model_1 = __importDefault(require("../models/productVariant.model"));
const review_model_1 = __importDefault(require("../models/review.model"));
const orderDetail_model_1 = __importDefault(require("../models/orderDetail.model"));
const category_model_1 = __importDefault(require("../models/category.model"));
const common_repository_1 = __importDefault(require("./common.repository"));
const attributeValue_model_1 = require("../models/attributeValue.model");
class ProductRepository {
    create(data) {
        return product_model_1.default.create(data);
    }
    async getProductsByCategoryName(name, page, limit) {
        const skip = (page - 1) * limit;
        const category = await category_model_1.default
            .findOne({
            name: { $regex: `^${name}$`, $options: 'i' },
        })
            .select('_id parentId');
        if (!category)
            return { result: [], totalProduct: 0 };
        let products;
        let totalProduct = 0;
        if (!category.parentId) {
            const children = await category_model_1.default.find({ parentId: category._id }).select('_id');
            const childrenIds = children.map(c => c._id);
            const categoryIds = childrenIds.length > 0 ? childrenIds : [category._id];
            totalProduct = await product_model_1.default.countDocuments({ categoryId: { $in: categoryIds } });
            products = await product_model_1.default
                .find({ categoryId: { $in: categoryIds } })
                .skip(skip)
                .limit(limit);
        }
        else {
            totalProduct = await product_model_1.default.countDocuments({ categoryId: category._id });
            products = await product_model_1.default.find({ categoryId: category._id }).skip(skip).limit(limit);
        }
        const productVariants = await productVariant_model_1.default.find({
            productId: { $in: products.map(p => p._id) },
        });
        const result = await Promise.all(products.map(async (product) => {
            const variant = productVariants.find(v => v.productId.equals(product._id));
            const { totalRating, reviewCount } = await common_repository_1.default.getReviewTotal(product._id);
            const productType = await common_repository_1.default.getProductType(product._id);
            return {
                ...product.toObject(),
                _id: product._id,
                discount: variant?.discount || null,
                attributeValueIds: variant
                    ? await Promise.all(variant.attributeValueIds.map(async (id) => {
                        const attrValue = await attributeValue_model_1.attributeValueModel.findById(id).select('value');
                        return attrValue?.value;
                    }))
                    : null,
                rating: totalRating,
                totalRating: reviewCount,
                categoryType: productType?.name,
                categoryRefType: productType?.related,
                inStock: variant?.quantity,
            };
        }));
        return { result, totalProduct };
    }
    async getSpecialProducts(page, limit) {
        const skip = (page - 1) * limit;
        const products = await productVariant_model_1.default.aggregate([
            { $match: { 'discount.value': { $gt: 0 } } },
            {
                $group: {
                    _id: '$productId',
                    discount: { $first: '$discount' },
                    attributeValueIds: { $first: '$attributeValueIds' },
                    quantity: { $first: '$quantity' },
                },
            },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product',
                },
            },
            { $unwind: '$product' },
            // NEW: Lookup attribute value docs
            {
                $lookup: {
                    from: 'attributevalues',
                    localField: 'attributeValueIds',
                    foreignField: '_id',
                    as: 'attributeValues',
                },
            },
            {
                $project: {
                    _id: '$product._id',
                    name: '$product.name',
                    description: '$product.description',
                    categoryId: '$product.categoryId',
                    basePrice: '$product.basePrice',
                    images: '$product.images',
                    discount: '$discount',
                    attributeValueIds: {
                        $map: {
                            input: '$attributeValues',
                            as: 'attr',
                            in: '$$attr.value',
                        },
                    },
                    inStock: '$quantity',
                    createdAt: '$product.createdAt',
                },
            },
            { $skip: skip },
            { $limit: limit },
        ]);
        const enhancedProducts = await Promise.all(products.map(async (product) => {
            const [typeInfo, reviewInfo] = await Promise.all([
                common_repository_1.default.getProductType(product._id),
                common_repository_1.default.getReviewTotal(product._id),
            ]);
            return {
                ...product,
                categoryType: typeInfo?.name,
                categoryRefType: typeInfo?.related,
                rating: reviewInfo.totalRating,
                reviewCount: reviewInfo.reviewCount,
            };
        }));
        const countResult = await productVariant_model_1.default.aggregate([
            { $match: { 'discount.value': { $gt: 0 } } },
            { $group: { _id: '$productId' } },
            { $count: 'total' },
        ]);
        return { result: enhancedProducts, totalProduct: countResult[0]?.total || 0 };
    }
    async getTopDealProducts(page, limit) {
        const skip = (page - 1) * limit;
        const products = await review_model_1.default.aggregate([
            {
                $group: {
                    _id: '$productId',
                    avgRating: { $avg: '$rating' },
                    reviewCount: { $sum: 1 },
                },
            },
            { $sort: { avgRating: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product',
                },
            },
            { $unwind: '$product' },
            {
                $project: {
                    _id: '$product._id',
                    name: '$product.name',
                    description: '$product.description',
                    categoryId: '$product.categoryId',
                    basePrice: '$product.basePrice',
                    images: '$product.images',
                    rating: '$avgRating',
                    totalRating: '$reviewCount',
                    createdAt: '$product.createdAt',
                },
            },
        ]);
        const enhancedProducts = await Promise.all(products.map(async (product) => {
            const typeInfo = await common_repository_1.default.getProductType(product._id);
            const attributeValueIds = await common_repository_1.default.getAttributeValueIdsProductVariant(product._id);
            return {
                ...product,
                categoryType: typeInfo?.name,
                categoryRefType: typeInfo?.related,
                attributeValueIds: attributeValueIds,
            };
        }));
        const countResult = await review_model_1.default.aggregate([
            { $group: { _id: '$productId' } },
            { $count: 'total' },
        ]);
        return { result: enhancedProducts, totalProduct: countResult[0]?.total || 0 };
    }
    async getBestSellingProducts(page, limit) {
        const skip = (page - 1) * limit;
        const products = await orderDetail_model_1.default.aggregate([
            {
                $lookup: {
                    from: 'productvariants',
                    localField: 'productVariantId',
                    foreignField: '_id',
                    as: 'variant',
                },
            },
            { $unwind: '$variant' },
            {
                $group: {
                    _id: '$variant.productId',
                    totalSold: { $sum: '$quantity' },
                    totalRevenue: { $sum: { $multiply: ['$quantity', '$price'] } },
                },
            },
            { $sort: { totalSold: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product',
                },
            },
            { $unwind: '$product' },
            {
                $project: {
                    _id: '$product._id',
                    name: '$product.name',
                    description: '$product.description',
                    categoryId: '$product.categoryId',
                    basePrice: '$product.basePrice',
                    images: '$product.images',
                    createdAt: '$product.createdAt',
                },
            },
        ]);
        const enhancedProducts = await Promise.all(products.map(async (product) => {
            const [typeInfo, reviewInfo, attributeValueIds] = await Promise.all([
                common_repository_1.default.getProductType(product._id),
                common_repository_1.default.getReviewTotal(product._id),
                common_repository_1.default.getAttributeValueIdsProductVariant(product._id),
            ]);
            return {
                ...product,
                categoryType: typeInfo?.name,
                categoryRefType: typeInfo?.related,
                attributeValueIds: attributeValueIds,
                totalRating: reviewInfo?.reviewCount,
                rating: reviewInfo?.totalRating / reviewInfo?.reviewCount,
            };
        }));
        const countResult = await orderDetail_model_1.default.aggregate([
            {
                $lookup: {
                    from: 'productvariants',
                    localField: 'productVariantId',
                    foreignField: '_id',
                    as: 'variant',
                },
            },
            { $unwind: '$variant' },
            { $group: { _id: '$variant.productId' } },
            { $count: 'total' },
        ]);
        return {
            result: enhancedProducts,
            totalProduct: countResult[0]?.total || 0,
        };
    }
    async getProducts(page, limit) {
        const skip = (page - 1) * limit;
        const products = await product_model_1.default.find().skip(skip).limit(limit);
        const totalProduct = await product_model_1.default.countDocuments();
        const productVariants = await productVariant_model_1.default.find({
            productId: { $in: products.map(p => p._id) },
        });
        const result = await Promise.all(products.map(async (product) => {
            const variant = productVariants.find(v => v.productId.equals(product._id));
            const { totalRating, reviewCount } = await common_repository_1.default.getReviewTotal(product._id);
            const productType = await common_repository_1.default.getProductType(product._id);
            return {
                ...product.toObject(),
                _id: product._id,
                discount: variant?.discount || null,
                attributeValueIds: variant
                    ? (await Promise.all(variant.attributeValueIds.map(async (id) => {
                        const attrValue = await attributeValue_model_1.attributeValueModel.findById(id).select('value');
                        return attrValue?.value;
                    }))).filter((v) => typeof v === 'string')
                    : null,
                rating: totalRating,
                totalRating: reviewCount,
                categoryType: productType?.name,
                categoryRefType: productType?.related,
                inStock: variant?.quantity,
                createdAt: product.createdAt,
            };
        }));
        return { result, totalProduct };
    }
    async filterProducts(keyword) {
        const products = await product_model_1.default
            .aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'category',
                },
            },
            {
                $unwind: '$category',
            },
            {
                $match: {
                    $or: [
                        { name: { $regex: keyword, $options: 'i' } },
                        { description: { $regex: keyword, $options: 'i' } },
                        { 'category.name': { $regex: keyword, $options: 'i' } },
                    ],
                },
            },
            {
                $project: {
                    _id: 1,
                    categoryId: 1,
                    name: 1,
                    description: 1,
                    basePrice: 1,
                    images: 1,
                    categoryType: '$category.name',
                    createdAt: 1,
                },
            },
        ])
            .sample(4);
        return products;
    }
}
exports.default = new ProductRepository();

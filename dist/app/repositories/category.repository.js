"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const category_model_1 = __importDefault(require("../models/category.model"));
class CategoryRepository {
    async get() {
        const result = await category_model_1.default.aggregate([
            {
                $match: {
                    parentId: { $ne: null },
                },
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'parentId',
                    foreignField: '_id',
                    as: 'parent',
                },
            },
            {
                $unwind: '$parent',
            },
            {
                $group: {
                    _id: '$parentId',
                    parentName: { $first: '$parent.name' },
                    children: {
                        $push: {
                            _id: '$_id',
                            name: '$name',
                            description: '$description',
                            imageUrl: '$imageUrl',
                            createdAt: '$createdAt',
                        },
                    },
                },
            },
        ]);
        return result;
    }
    create(data) {
        return category_model_1.default.create(data);
    }
}
exports.default = new CategoryRepository();

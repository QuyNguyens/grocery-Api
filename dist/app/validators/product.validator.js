"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSchema = void 0;
const zod_1 = require("zod");
exports.productSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Tên sản phẩm là bắt buộc'),
    description: zod_1.z.string().optional(),
    categoryId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID danh mục không hợp lệ'), // ObjectId
    basePrice: zod_1.z.number().nonnegative('Giá cơ bản phải là số không âm'),
    images: zod_1.z.array(zod_1.z.string().url('Mỗi ảnh phải là một URL hợp lệ')),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
});

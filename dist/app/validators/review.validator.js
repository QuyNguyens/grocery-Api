"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewSchema = void 0;
const zod_1 = require("zod");
exports.reviewSchema = zod_1.z.object({
    userId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID người dùng không hợp lệ'),
    productId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID sản phẩm không hợp lệ'),
    rating: zod_1.z.number().nonnegative(),
    comment: zod_1.z.string().max(500, 'comment ko được dài hơn 500 kí tự'),
});

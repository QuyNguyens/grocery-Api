"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productVariantSchema = exports.discountSchema = void 0;
const zod_1 = require("zod");
exports.discountSchema = zod_1.z.object({
    type: zod_1.z.enum(['percentage', 'fixed']),
    value: zod_1.z.number().nonnegative(),
    endDate: zod_1.z.date().optional(),
});
exports.productVariantSchema = zod_1.z.object({
    productId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID sản phẩm không hợp lệ'),
    attributeValueIds: zod_1.z.array(zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID attribute không hợp lệ')),
    price: zod_1.z.number().nonnegative(),
    currentPrice: zod_1.z.number().nonnegative(),
    discount: exports.discountSchema.optional(),
    quantity: zod_1.z.number().int().nonnegative(),
    sku: zod_1.z.string().optional(),
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartSchema = void 0;
const zod_1 = require("zod");
exports.cartSchema = zod_1.z.object({
    productVariantId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID danh mục không hợp lệ'),
    quantity: zod_1.z.number().int(),
    attributesSnapshot: zod_1.z
        .object({
        name: zod_1.z.string(),
        value: zod_1.z.string(),
    })
        .optional(),
    image: zod_1.z.url(),
    name: zod_1.z.string(),
    type: zod_1.z.string(),
});

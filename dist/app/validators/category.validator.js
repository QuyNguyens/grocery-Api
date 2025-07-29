"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categorySchema = void 0;
const zod_1 = require("zod");
exports.categorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Tên danh mục không được để trống'),
    description: zod_1.z.string().max(500).optional(),
    parentId: zod_1.z
        .string()
        .transform(val => (val === '' ? undefined : val))
        .optional(),
    imageUrl: zod_1.z.string().url({ message: 'URL không hợp lệ' }).optional(),
});

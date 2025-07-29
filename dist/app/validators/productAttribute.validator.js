"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productAttributeValueSchema = exports.productAttributeSchema = void 0;
const zod_1 = require("zod");
exports.productAttributeSchema = zod_1.z.object({
    name: zod_1.z.enum(['Color', 'Weight']),
});
exports.productAttributeValueSchema = zod_1.z.object({
    attributeId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID danh mục không hợp lệ'),
    value: zod_1.z.union([
        zod_1.z.enum(['green', 'blue', 'orange', 'pink', 'yellow', 'brown', 'purple']),
        zod_1.z.string().regex(/^\d+(mg|kg)$/, 'Giá trị trọng lượng không hợp lệ (vd: 500mg, 1kg)'),
    ]),
});

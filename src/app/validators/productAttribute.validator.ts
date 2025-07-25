import { z } from 'zod';

export const productAttributeSchema = z.object({
  name: z.enum(['Color', 'Weight']),
});

export const productAttributeValueSchema = z.object({
  attributeId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID danh mục không hợp lệ'),
  value: z.union([
    z.enum(['green', 'blue', 'orange', 'pink', 'yellow', 'brown', 'purple']),
    z.string().regex(/^\d+(mg|kg)$/, 'Giá trị trọng lượng không hợp lệ (vd: 500mg, 1kg)'),
  ]),
});

export type ProductAttributeValueInput = z.infer<typeof productAttributeValueSchema>;
export type ProductAttributeInput = z.infer<typeof productAttributeSchema>;

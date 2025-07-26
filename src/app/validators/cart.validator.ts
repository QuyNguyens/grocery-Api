import { z } from 'zod';

export const cartSchema = z.object({
  productVariantId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID danh mục không hợp lệ'),
  quantity: z.number().int(),
  attributesSnapshot: z
    .object({
      name: z.string(),
      value: z.string(),
    })
    .optional(),
  image: z.url(),
  name: z.string(),
});

export type CartInput = z.infer<typeof cartSchema>;

import { z } from 'zod';

export const discountSchema = z.object({
  type: z.enum(['percentage', 'fixed']),
  value: z.number().nonnegative(),
  endDate: z.date().optional(),
});

export const productVariantSchema = z.object({
  productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID sản phẩm không hợp lệ'),
  attributeValueIds: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID attribute không hợp lệ')),
  price: z.number().nonnegative(),
  currentPrice: z.number().nonnegative(),
  discount: discountSchema.optional(),
  quantity: z.number().int().nonnegative(),
  sku: z.string().optional(),
});

export type ProductVariantInput = z.infer<typeof productVariantSchema>;

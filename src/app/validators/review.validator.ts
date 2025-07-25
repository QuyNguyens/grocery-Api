import { z } from 'zod';

export const reviewSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID người dùng không hợp lệ'),
  productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID sản phẩm không hợp lệ'),
  rating: z.number().nonnegative(),
  comment: z.string().max(500, 'comment ko được dài hơn 500 kí tự'),
});

export type ReviewInput = z.infer<typeof reviewSchema>;

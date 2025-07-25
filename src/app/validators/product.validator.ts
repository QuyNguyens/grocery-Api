import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Tên sản phẩm là bắt buộc'),
  description: z.string().optional(),
  categoryId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID danh mục không hợp lệ'), // ObjectId
  basePrice: z.number().nonnegative('Giá cơ bản phải là số không âm'),
  images: z.array(z.string().url('Mỗi ảnh phải là một URL hợp lệ')),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;

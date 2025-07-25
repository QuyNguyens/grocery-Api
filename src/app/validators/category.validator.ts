import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1, 'Tên danh mục không được để trống'),
  description: z.string().max(500).optional(),
  parentId: z
    .string()
    .transform(val => (val === '' ? undefined : val))
    .optional(),
  imageUrl: z.string().url({ message: 'URL không hợp lệ' }).optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;

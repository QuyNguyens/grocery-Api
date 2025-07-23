import { ICategory } from './category';
import { Ref } from './common';

export interface IProduct {
  name: string;
  description: string;
  categoryId: Ref<ICategory>;
  basePrice: number;
  images: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

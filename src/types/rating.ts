import { Ref } from './common';
import { IProduct } from './product';
import { IUser } from './user';

export interface IRating {
  userId: Ref<IUser>;
  productId: Ref<IProduct>;
  rating: number;
  comment?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

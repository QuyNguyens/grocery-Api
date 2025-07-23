import { Ref } from './common';
import { IUser } from './user';

export interface ICartItem {
  productVariantId: string;
  quantity: number;
}

export interface ICart {
  userId: Ref<IUser>;
  items: ICartItem[];
  updatedAt?: Date;
}

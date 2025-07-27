import { Ref } from './common';
import { IProductVariant } from './productVariant';
import { IUser } from './user';

export interface ICartItem {
  productVariantId: Ref<IProductVariant>;
  quantity: number;
  attributesSnapshot?: {
    name: string;
    value: string;
  };
  image: string;
  name: string;
  type: string;
}

export interface ICart {
  userId: Ref<IUser>;
  items: ICartItem[];
  updatedAt?: Date;
}

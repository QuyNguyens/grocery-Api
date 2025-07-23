import { Ref } from './common';
import { IUser } from './user';

export interface IWishlist {
  userId: Ref<IUser>;
  productIds: string[];
}

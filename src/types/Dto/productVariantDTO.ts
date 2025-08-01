import { Types } from 'mongoose';
import { IProductVariant } from '../productVariant';

export interface UserRating {
  userId: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt?: Date;
  name: string;
  avatar: string;
}

export interface ProductVariantDTO extends IProductVariant {
  name?: string;
  description?: string;
  type?: string;
  categoryType?: string;
  categoryRefType?: string[];
  attribute?: string[];
  images?: string[];
  rating?: {
    value: number;
    total: number;
  };
  userRating: UserRating[];
}

import { IProductVariant } from '../productVariant';

export interface UserRating {
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
  attribute?: string[];
  images?: string[];
  rating?: {
    value: number;
    total: number;
  };
  userRating: UserRating[];
}

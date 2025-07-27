import { Types } from 'mongoose';
import { IProduct } from '../product';
import { IProductVariant } from '../productVariant';

export interface ProductDTO extends IProduct {
  _id: Types.ObjectId;
  discount?: IProductVariant['discount'] | null;
  rating?: number;
  totalRating?: number;
  attributeValueIds?: string[] | null;
  type?: string;
  categoryType?: string;
  categoryRefType?: string[];
}

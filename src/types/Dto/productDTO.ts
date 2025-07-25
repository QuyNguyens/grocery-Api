import { IProduct } from '../product';
import { IProductVariant } from '../productVariant';

export interface ProductDTO extends IProduct {
  discount?: IProductVariant['discount'] | null;
  rating?: number;
}

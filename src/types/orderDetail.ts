import { Ref } from './common';
import { IOrder } from './order';
import { IProductVariant } from './productVariant';

export interface IOrderDetail {
  orderId: Ref<IOrder>;
  productVariantId: Ref<IProductVariant>;
  quantity: number;
  price?: number;
  image: string;
  name: string;
  type: string;
}

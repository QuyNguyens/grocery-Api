import { Ref } from './common';
import { IOrder } from './order';
import { IProduct } from './product';
import { IProductVariant } from './productVariant';

export interface IOrderDetail {
  orderId: Ref<IOrder>;
  productId: Ref<IProduct>;
  productVariantId: Ref<IProductVariant>;
  quantity: number;
  price: number;
}

import { Ref } from './common';
import { Address, IUser } from './user';

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

export interface IOrder {
  userId: Ref<IUser>;
  addressId?: Ref<Address>;
  status: OrderStatus;
  totalAmount: number;
  paymentMethod: 'COD' | 'PayPal' | 'CreditCard';
  createdAt?: Date;
}

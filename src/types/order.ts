import { Ref } from './common';
import { Address, IUser } from './user';

export interface IOrder {
  userId: Ref<IUser>;
  addressId: Ref<Address>;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  paymentMethod: 'COD' | 'PayPal' | 'CreditCard';
  createdAt?: Date;
}

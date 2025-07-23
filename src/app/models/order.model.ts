import mongoose, { Schema, Document } from 'mongoose';
import { IOrder } from '../../types/order';

interface IOrderDocument extends IOrder, Document {}

const OrderSchema = new Schema<IOrderDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    addressId: { type: Schema.Types.ObjectId },
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    totalAmount: Number,
    paymentMethod: { type: String, enum: ['COD', 'PayPal', 'CreditCard'] },
  },
  { timestamps: true },
);

export default mongoose.model<IOrderDocument>('Order', OrderSchema);

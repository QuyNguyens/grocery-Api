import mongoose, { Schema, Document } from 'mongoose';
import { IOrderDetail } from '../../types/orderDetail';

interface IOrderDetailDocument extends IOrderDetail, Document {}

const OrderDetailSchema = new Schema<IOrderDetailDocument>({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
  productVariantId: { type: Schema.Types.ObjectId, ref: 'ProductVariant' },
  quantity: Number,
  price: Number,
  image: String,
  name: String,
  type: String,
});

export default mongoose.model<IOrderDetailDocument>('OrderDetail', OrderDetailSchema);

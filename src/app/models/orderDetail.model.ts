import mongoose, { Schema, Document } from 'mongoose';
import { IOrderDetail } from '../../types/orderDetail';

interface IOrderDetailDocument extends IOrderDetail, Document {}

const OrderDetailSchema = new Schema<IOrderDetailDocument>({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
  productId: { type: Schema.Types.ObjectId, ref: 'Product' },
  productVariantId: { type: Schema.Types.ObjectId, ref: 'ProductVariant' },
  quantity: Number,
  price: Number,
});

export default mongoose.model<IOrderDetailDocument>('OrderDetail', OrderDetailSchema);

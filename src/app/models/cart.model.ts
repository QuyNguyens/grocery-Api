import mongoose, { Schema, Document } from 'mongoose';
import { ICart } from '../../types/cart';

interface ICartDocument extends ICart, Document {}

const CartSchema = new Schema<ICartDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    items: [
      {
        productVariantId: { type: Schema.Types.ObjectId, ref: 'ProductVariant' },
        quantity: Number,
        attributesSnapshot: {
          name: { type: String },
          value: { type: String },
        },
        image: { type: String },
        name: { type: String },
      },
    ],
  },
  { timestamps: { updatedAt: true, createdAt: false } },
);

export default mongoose.model<ICartDocument>('Cart', CartSchema);

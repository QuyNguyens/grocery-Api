import mongoose, { Schema, Document } from 'mongoose';
import { IProductVariant } from '../../types/productVariant';

interface IProductVariantDocument extends IProductVariant, Document {}

const ProductVariantSchema = new Schema<IProductVariantDocument>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    options: [
      {
        name: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    price: { type: Number, required: true },
    currentPrice: { type: Number, required: true },
    discount: {
      type: {
        type: String,
        enum: ['percentage', 'fixed'],
      },
      value: Number,
      endDate: Date,
    },
    quantity: { type: Number, required: true },
    sku: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IProductVariantDocument>('ProductVariant', ProductVariantSchema);

import mongoose, { Schema, Document } from 'mongoose';
import { IProduct } from '../../types/product';

interface IProductDocument extends IProduct, Document {}

const ProductSchema = new Schema<IProductDocument>(
  {
    name: String,
    description: String,
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
    basePrice: Number,
    images: [String],
  },
  { timestamps: true },
);

export default mongoose.model<IProductDocument>('Product', ProductSchema);

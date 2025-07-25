import mongoose, { Schema, Document } from 'mongoose';
import { IProduct } from '../../types/product';

interface IProductDocument extends IProduct, Document {}

const ProductSchema = new Schema<IProductDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (arr: string[]) => arr.every(url => typeof url === 'string'),
        message: 'Each image must be a valid URL string',
      },
    },
  },
  { timestamps: true },
);

export default mongoose.model<IProductDocument>('Product', ProductSchema);

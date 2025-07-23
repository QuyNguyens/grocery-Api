import mongoose, { Schema, Document } from 'mongoose';
import { ICategory } from '../../types/category';

interface ICategoryDocument extends ICategory, Document {}

const CategorySchema = new Schema<ICategoryDocument>(
  {
    name: { type: String, required: true },
    description: String,
    parentId: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    imageUrl: String,
  },
  { timestamps: true },
);

export default mongoose.model<ICategoryDocument>('Category', CategorySchema);

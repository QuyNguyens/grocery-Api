import mongoose, { Schema, Document } from 'mongoose';
import { IRating } from '../../types/rating';

interface IRatingDocument extends IRating, Document {}

const RatingSchema = new Schema<IRatingDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: { type: String },
  },
  {
    timestamps: true,
  },
);

RatingSchema.index({ userId: 1, productId: 1 }, { unique: true });

export default mongoose.model<IRatingDocument>('Rating', RatingSchema);

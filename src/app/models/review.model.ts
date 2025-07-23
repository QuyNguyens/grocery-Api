import mongoose, { Schema, Document } from 'mongoose';
import { IReview } from '../../types/review';

interface IReviewDocument extends IReview, Document {}

const ReviewSchema = new Schema<IReviewDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    rating: Number,
    comment: String,
  },
  { timestamps: true },
);

export default mongoose.model<IReviewDocument>('Review', ReviewSchema);

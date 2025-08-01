import reviewModel from '../models/review.model';
import { ReviewInput } from '../validators/review.validator';

class ReviewRepository {
  async create(data: ReviewInput) {
    const existing = await reviewModel.findOne({ userId: data.userId, productId: data.productId });
    if (existing) {
      return null;
    } else {
      return reviewModel.create(data);
    }
  }
}

export default new ReviewRepository();

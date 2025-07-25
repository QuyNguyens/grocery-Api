import reviewModel from '../models/review.model';
import { ReviewInput } from '../validators/review.validator';

class ReviewRepository {
  create(data: ReviewInput) {
    return reviewModel.create(data);
  }
}

export default new ReviewRepository();

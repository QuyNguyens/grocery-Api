import reviewRepository from '../repositories/review.repository';
import { ReviewInput } from '../validators/review.validator';

class ReviewService {
  async create(data: ReviewInput) {
    return await reviewRepository.create(data);
  }
}

export default new ReviewService();

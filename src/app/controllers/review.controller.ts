import { Request, Response } from 'express';
import { ReviewInput } from '../validators/review.validator';
import reviewService from '../services/review.service';
import { error, success } from '../../utils/response';

class ReviewController {
  async create(req: Request, res: Response) {
    try {
      const data: ReviewInput = req.body;
      const result = await reviewService.create(data);
      success(res, 201, 'Tạo review thành công', result);
    } catch (err) {
      error(res, 500, 'Tạo review thất bại');
    }
  }
}
export default new ReviewController();

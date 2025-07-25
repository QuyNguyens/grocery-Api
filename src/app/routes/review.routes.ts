import express from 'express';
import { validateRequest } from '../middlewares/validateRequest';
import { reviewSchema } from '../validators/review.validator';
import reviewController from '../controllers/review.controller';

const router = express.Router();

router.post('/create', validateRequest(reviewSchema), reviewController.create);

export default router;

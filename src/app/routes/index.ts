import { Router } from 'express';
import userRoute from './userRoute';
import orderRoute from './orderRoute';

const router = Router();

router.use('/users', userRoute);
router.use('/orders', orderRoute);

export default router;

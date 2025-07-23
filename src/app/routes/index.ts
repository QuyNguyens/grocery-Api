import { Router } from 'express';
import userRoute from './userRoute';
import orderRoute from './orderRoute';
import authRouter from './authRoute';

const router = Router();

router.use('/users', userRoute);
router.use('/auth', authRouter);
router.use('/orders', orderRoute);

export default router;

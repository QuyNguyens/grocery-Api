import { Router } from 'express';
import userRoute from './user.routes';
import orderRoute from './order.routes';
import authRouter from './auth.routes';
import categoryRouter from './category.routes';
import productRouter from './product.routes';
import productAttributeRouter from './productAttribute.routes';
import productVariantRouter from './productVariant.routes';
import reviewRouter from './review.routes';
import cartRouter from './cart.routes';
import vnpayRouter from './vnpay.routes';
import { verifyToken } from '../../utils/auth';

const router = Router();

router.use('/users', userRoute);
router.use('/auth', authRouter);
router.use('/orders', orderRoute);
router.use('/categories', categoryRouter);
router.use('/products', productRouter);
router.use('/product-attribute', verifyToken, productAttributeRouter);
router.use('/product-variant', productVariantRouter);
router.use('/review', verifyToken, reviewRouter);
router.use('/cart', verifyToken, cartRouter);
router.use('/vnpay', vnpayRouter);

export default router;

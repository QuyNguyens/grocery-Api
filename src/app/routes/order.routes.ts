import { Router } from 'express';
import orderController from '../controllers/order.controller';
import { verifyToken } from '../../utils/auth';

const router = Router();

router.get('/order-detail', orderController.getOrderDetail);
router.get('', verifyToken, orderController.getOrders);

export default router;

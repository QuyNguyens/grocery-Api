import { Router } from 'express';
import orderController from '../controllers/order.controller';

const router = Router();

router.get('/order-detail', orderController.getOrderDetail);
router.get('', orderController.getOrders);

export default router;

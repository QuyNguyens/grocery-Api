import express from 'express';
import cartController from '../controllers/cart.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { cartSchema } from '../validators/cart.validator';

const router = express.Router();

router.post('/create', cartController.create);
router.put('/update', cartController.updateCartItem);
router.get('/items', cartController.get);
router.post('/add-cart-item', validateRequest(cartSchema), cartController.addCartItem);
router.delete('/delete', cartController.deleteCartItem);

export default router;

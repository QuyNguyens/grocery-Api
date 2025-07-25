import express from 'express';
import { validateRequest } from '../middlewares/validateRequest';
import { productSchema } from '../validators/product.validator';
import productController from '../controllers/product.controller';

const router = express.Router();

router.get('/categories', productController.getProductsByCategoryId);
router.get('/special', productController.getSpecialProducts);
router.get('/top-deal', productController.getTopDealProducts);
router.get('/best-selling', productController.getBestSellingProducts);
router.post('/create', validateRequest(productSchema), productController.create);

export default router;

import express from 'express';
import { validateRequest } from '../middlewares/validateRequest';
import { productSchema } from '../validators/product.validator';
import productController from '../controllers/product.controller';
import { verifyToken } from '../../utils/auth';

const router = express.Router();

router.get('/our-store', productController.getProducts);
router.get('/categories', productController.getProductsByCategoryName);
router.get('/special', productController.getSpecialProducts);
router.get('/top-deal', productController.getTopDealProducts);
router.get('/best-selling', productController.getBestSellingProducts);
router.post('/create', verifyToken, validateRequest(productSchema), productController.create);
router.get('/filter', productController.filterProducts);

export default router;

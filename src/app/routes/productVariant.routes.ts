import express from 'express';
import { validateRequest } from '../middlewares/validateRequest';
import { productVariantSchema } from '../validators/productVariant.validator';
import productVariantController from '../controllers/productVariant.controller';
import { verifyToken } from '../../utils/auth';

const router = express.Router();

router.get('', productVariantController.getByProductId);
router.post('/create',verifyToken, validateRequest(productVariantSchema), productVariantController.create);

export default router;

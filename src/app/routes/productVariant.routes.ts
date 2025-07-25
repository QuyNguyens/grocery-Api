import express from 'express';
import { validateRequest } from '../middlewares/validateRequest';
import { productVariantSchema } from '../validators/productVariant.validator';
import productVariantController from '../controllers/productVariant.controller';

const router = express.Router();

router.post('/create', validateRequest(productVariantSchema), productVariantController.create);

export default router;

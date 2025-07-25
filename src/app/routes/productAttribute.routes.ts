import express from 'express';
import productAttributeController from '../controllers/productAttribute.controller';
import { validateRequest } from '../middlewares/validateRequest';
import {
  productAttributeSchema,
  productAttributeValueSchema,
} from '../validators/productAttribute.validator';

const router = express.Router();

router.post(
  '/create-attribute',
  validateRequest(productAttributeSchema),
  productAttributeController.createAttribute,
);
router.post(
  '/create-attribute-value',
  validateRequest(productAttributeValueSchema),
  productAttributeController.createAttributeValue,
);

export default router;

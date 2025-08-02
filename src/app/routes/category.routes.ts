import { categorySchema } from '../validators/category.validator';
import express from 'express';
import { validateRequest } from '../middlewares/validateRequest';
import categoriesController from '../controllers/categories.controller';
import { verifyToken } from '../../utils/auth';

const router = express.Router();

router.get('', categoriesController.get);
router.post('/create', verifyToken, validateRequest(categorySchema), categoriesController.create);
router.post('/create-all', verifyToken, categoriesController.createAll);

export default router;

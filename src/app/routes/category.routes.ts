import { categorySchema } from '../validators/category.validator';
import express from 'express';
import { validateRequest } from '../middlewares/validateRequest';
import categoriesController from '../controllers/categories.controller';

const router = express.Router();

router.post('/create', validateRequest(categorySchema), categoriesController.create);
router.post('/create-all', categoriesController.createAll);

export default router;

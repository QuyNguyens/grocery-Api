import express from 'express';
import * as AuthController from '../controllers/auth.controller';
import { signupSchema, loginSchema } from '../validators/auth.validator';
import { validateRequest } from '../middlewares/validateRequest';

const router = express.Router();

router.post('/signup', validateRequest(signupSchema), AuthController.signup);
router.post('/login', validateRequest(loginSchema), AuthController.login);
router.post('/refresh-token', AuthController.refresh);
export default router;

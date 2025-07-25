import express from 'express';
import { signupSchema, loginSchema } from '../validators/auth.validator';
import { validateRequest } from '../middlewares/validateRequest';
import userController from '../controllers/user.controller';
const router = express.Router();

router.post('/signup', validateRequest(signupSchema), userController.signup);
router.post('/login', validateRequest(loginSchema), userController.login);
router.post('/refresh-token', userController.refresh);
export default router;

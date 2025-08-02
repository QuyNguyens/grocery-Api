import express from 'express';
import { signupSchema, loginSchema } from '../validators/auth.validator';
import { validateRequest } from '../middlewares/validateRequest';
import userController from '../controllers/user.controller';
import multer from 'multer';
import { verifyToken } from '../../utils/auth';
const router = express.Router();
const upload = multer();

router.post('/signup', validateRequest(signupSchema), userController.signup);
router.post('/login', validateRequest(loginSchema), userController.login);
router.post('/refresh-token', userController.refresh);
router.post('/update', verifyToken, upload.single('avatar'), userController.update);
router.post('/logout', userController.logout);

export default router;

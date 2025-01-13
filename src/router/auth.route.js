import { AuthController } from '../controllers/auth.controller.js';
import express from 'express';

const router = express.Router();

const authController = new AuthController();
router.use('/git', authController.oAuthLogin);
router.use('/token/refresh', authController.refreshToken);

export default router;

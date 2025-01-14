import { AuthController } from '../controllers/auth.controller.js';
import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

const authController = new AuthController();
router.get('/git', authController.oAuthLogin);
router.post('/token/refresh', authController.refreshToken);
router.post('/logout', authMiddleware, authController.logout);

export default router;

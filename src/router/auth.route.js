import { AuthController } from '../controllers/auth.controller.js';
import express from 'express';

const router = express.Router();

const authController = new AuthController();
router.get('/git', authController.oAuthLogin);
router.post('/token/refresh', authController.refreshToken);

export default router;

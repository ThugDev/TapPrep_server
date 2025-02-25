import { AuthController } from '../controllers/auth.controller.js';
import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { paramsValidator } from '../middlewares/params.middleware.js';

const router = express.Router();

const authController = new AuthController();
router.get('/git/callback', authController.callback);
router.post('/git/token', paramsValidator.auth.oAuthLogin, authController.oAuthLogin);
router.post('/token/refresh', paramsValidator.auth.refresh, authController.refreshToken);
router.post('/logout', authMiddleware, authController.logout);
router.delete('/delete', authMiddleware, authController.deleteUser);

export default router;

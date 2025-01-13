import { AuthController } from '../controllers/auth.controller.js';
import express from 'express';

const router = express.Router();

const authController = new AuthController();
router.use('/git', authController.oAuthLogin);

export default router;

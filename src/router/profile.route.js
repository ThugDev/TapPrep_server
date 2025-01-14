import express from 'express';
import { ProfileController } from '../controllers/profile.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

const profileController = new ProfileController();

router.get('/', authMiddleware, profileController.getProfile);
router.patch('/', authMiddleware, profileController.updateProfile);
router.delete('/', authMiddleware, profileController.deleteProfile);
export default router;

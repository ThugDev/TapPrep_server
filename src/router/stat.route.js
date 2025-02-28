import express from 'express';
import { StatController } from '../controllers/stat.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

const statController = new StatController();
router.get('/fe', authMiddleware, statController.getFEStats);
router.get('/be', authMiddleware, statController.getBEStats);

export default router;

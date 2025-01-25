import express from 'express';
import authRouter from './auth.route.js';
import profileRouter from './profile.route.js';
import problemRouter from './problem.route.js';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/profile', profileRouter);
router.use('/problem', problemRouter);

export default router;

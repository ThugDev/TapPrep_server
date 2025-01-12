import express from 'express';

const router = express.Router();

router.use('/auth', authRouters);

export default router;

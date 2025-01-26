import express from 'express';
import { ProblemController } from '../controllers/problem.controller.js';
import { paramsValidator } from '../middlewares/params.middleware.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

const problemController = new ProblemController();
router.post(
  '/',
  authMiddleware,
  paramsValidator.problems.createProblem,
  problemController.createProblem,
);
router.get(
  '/list',
  authMiddleware,
  paramsValidator.problems.getLists,
  problemController.getProblemList,
);
router.patch('/', problemController.updateProblem);
router.delete('/', problemController.deleteProblem);
router.post('/answer', problemController.getAnswerProblem);

export default router;

import express from 'express';
import { ProblemController } from '../controllers/problem.controller.js';
import { paramsValidator } from '../middlewares/params.middleware.js';

const router = express.Router();

const problemController = new ProblemController();
router.post('/', paramsValidator.problems.createProblem, problemController.createProblem);
router.get('/', problemController.getProblems);
router.patch('/', problemController.updateProblem);
router.delete('/', problemController.deleteProblem);
router.post('/answer', problemController.getAnswerProblem);

export default router;

import express from 'express';
import { ProblemController } from '../controllers/problem.controller.js';
import { paramsValidator } from '../middlewares/params.middleware.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import adminMiddleware from '../middlewares/admin.middleware.js';

const router = express.Router();

const problemController = new ProblemController();

// 문제 등록, 관리자
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  paramsValidator.problems.createProblem,
  problemController.createProblem,
);

// 문제 리스트 조회
router.get(
  '/list',
  authMiddleware,
  paramsValidator.problems.getLists,
  problemController.getProblemList,
);

// 문제 상세 조회
router.get('/:problemId', authMiddleware, problemController.getProblem);

// 문제 수정, 관리자
router.patch('/', authMiddleware, adminMiddleware, problemController.updateProblem);

// 문제 삭제, 관리자
router.delete('/', authMiddleware, adminMiddleware, problemController.deleteProblem);

// 문제 답안 조회
router.post(
  '/answer',
  authMiddleware,
  paramsValidator.problems.getAnswer,
  problemController.getAnswerProblem,
);

export default router;

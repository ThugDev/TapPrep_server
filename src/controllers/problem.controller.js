import { ProblemService } from '../services/problem.service.js';

export class ProblemController {
  constructor() {
    this.problemService = new ProblemService();
  }

  createProblem = async (req, res, next) => {
    try {
      const bodyData = req.body;
      const response = await this.problemService.createProblem(bodyData);

      return res.status(200).json({
        statusCode: 201,
        message: '문제 등록 완료',
      });
    } catch (err) {
      next(err);
    }
  };

  getProblems = async (req, res, next) => {
    try {
      const {} = req.body;

      return res.status(200).json({});
    } catch (err) {
      next();
    }
  };

  updateProblem = async (req, res, next) => {
    try {
      const {} = req.body;

      return res.status(200).json({});
    } catch (err) {
      next();
    }
  };

  deleteProblem = async (req, res, next) => {
    try {
      const {} = req.body;

      return res.status(200).json({});
    } catch (err) {
      next();
    }
  };

  getAnswerProblem = async (req, res, next) => {
    try {
      const {} = req.body;

      return res.status(200).json({});
    } catch (err) {
      next();
    }
  };
}

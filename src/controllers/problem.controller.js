import { ProblemService } from '../services/problem.service.js';

export class ProblemController {
  constructor() {
    this.problemService = new ProblemService();
  }

  createProblem = async (req, res, next) => {
    try {
      const bodyData = req.body;
      // 문제 생성 관련 서비스 호출
      await this.problemService.createProblem(bodyData);

      return res.status(201).json({
        statusCode: 201,
        message: '문제 등록 완료',
      });
    } catch (err) {
      next(err);
    }
  };

  getProblem = async (req, res, next) => {
    try {
      const { problemId } = req.params;
      // 아이디에 대한 문제 불러오기 서비스 호출
      const problemData = await this.problemService.getProblem(problemId);
      // 상세 문제 반환
      return res.status(200).json({
        statusCode: 200,
        message: '문제 불러오기 완료',
        problemData,
      });
    } catch (err) {
      next(err);
    }
  };

  getProblemList = async (req, res, next) => {
    try {
      const { sector, difficulty, page } = req.query;
      // 문제 리스트 관련 서비스 호출
      const response = await this.problemService.getProblemList(sector, difficulty, page);
      // 문제 리스트 반환
      return res.status(200).json({
        statusCode: 200,
        message: '문제 불러오기 완료',
        ...response,
      });
    } catch (err) {
      next(err);
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

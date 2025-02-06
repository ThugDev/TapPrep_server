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
      const {
        user: { user_id },
        params: { problemId },
      } = req;
      // 아이디에 대한 문제 불러오기 서비스 호출
      const { isSolved, problemData } = await this.problemService.getProblem(user_id, problemId);
      // 상세 문제 반환
      return res.status(200).json({
        statusCode: 200,
        message: '문제 불러오기 완료',
        isSolved,
        problemData,
      });
    } catch (err) {
      next(err);
    }
  };

  getProblemList = async (req, res, next) => {
    try {
      const {
        user: { user_id },
        query: { sector, difficulty, page, limit },
      } = req;
      // 문제 리스트 관련 서비스 호출
      const response = await this.problemService.getProblemList(
        user_id,
        sector,
        +difficulty,
        +page,
        +limit,
      );
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
      const {
        user: { user_id },
        body: { problemId, option },
      } = req;

      // 정답 체크 서비스 호출
      const problemResult = await this.problemService.getProblemAnswer(user_id, problemId, option);
      // 결과 반환

      return res.status(200).json({
        statusCode: 200,
        message: '정답 여부 및 해설 반환 성공',
        problemResult,
      });
    } catch (err) {
      next(err);
    }
  };
}

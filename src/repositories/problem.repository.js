import pools from '../mysql/createPool.js';
import { SQL_QUERIES } from './queries.js';
import { dbLogger } from '../utils/log/logger.js';

export class ProblemRepository {
  async createProblem(sector_id, typeNum, problemData) {
    try {
      // 쿼리데이터 순번 보장을 위한 구조 분해할당
      const { difficulty, title, description, hint, explanation, reference } = problemData;

      // 쿼리에 넣을 데이터 준비
      const queryData = [
        [sector_id, typeNum, difficulty, title, description, hint, explanation, reference],
      ];

      // 쿼리 실행
      const [rows] = await pools.PROBLEM_DB.query(SQL_QUERIES.problem.CREATE_PROBLEM, [queryData]);
      // 번호 반환
      return rows.insertId;
    } catch (err) {
      dbLogger.error(`Error creating problem: ${err.message}`);
      throw new Error(`Error creating problem: ${err.message}`);
    }
  }

  async createAnswer(problemId, typeNum, answers) {
    try {
      switch (typeNum) {
        case 1:
          // normal answer 의 첫번째 인자는 정답
          let isCorrect = true;
          for (const answer of answers) {
            await pools.PROBLEM_DB.query(SQL_QUERIES.option.CREATE_OPTION, [
              problemId,
              typeNum,
              answer,
              isCorrect,
            ]);
            if (isCorrect) isCorrect = false;
          }
          break;
        case 2:
          await pools.PROBLEM_DB.query(SQL_QUERIES.option.CREATE_OPTION, [
            problemId,
            typeNum,
            Number(answers),
            true,
          ]);
          break;
        case 3:
          await pools.PROBLEM_DB.query(SQL_QUERIES.option.CREATE_OPTION, [
            problemId,
            typeNum,
            answers,
            true,
          ]);
          break;
      }
    } catch (err) {
      dbLogger.error(`Error creating answer: ${err.message}`);
      throw new Error(`Error creating answer: ${err.message}`);
    }
  }

  async getProblemCount(sectorId, difficulty) {
    try {
      // 조건에 맞는 쿼리 호출
      const [rows] = await pools.PROBLEM_DB.query(SQL_QUERIES.problem.GET_PROBLEM_COUNT, [
        sectorId,
        difficulty,
      ]);
      // 토탈카운트 반환, 조회 안될 시 0 반환
      return rows[0].total_count || 0;
    } catch (err) {
      dbLogger.error(`Error getting problem count: ${err.message}`);
      throw new Error(`Error getting problem count: ${err.message}`);
    }
  }

  async getProblemList(userId, sectorId, difficulty, page, limit) {
    try {
      // 오프셋 계산
      const offset = (page - 1) * limit;

      // 문제 리스트 쿼리 호출
      const [rows] = await pools.PROBLEM_DB.query(SQL_QUERIES.problem.FIND_PROBLEM_LIST, [
        userId,
        sectorId,
        difficulty,
        Number(limit),
        offset,
      ]);
      // 리스트 반환
      return rows;
    } catch (err) {
      dbLogger.error(`Error getting problem list: ${err.message}`);
      throw new Error(`Error getting problem list: ${err.message}`);
    }
  }

  async getProblem(problemId) {
    try {
      const [rows] = await pools.PROBLEM_DB.query(SQL_QUERIES.problem.FIND_PROBLEM, [problemId]);
      return rows;
    } catch (err) {
      dbLogger.error(`Error getting problem: ${err.message}`);
      throw new Error(`Error getting problem: ${err.message}`);
    }
  }

  async getProblemSolution(problemId) {
    try {
      const [rows] = await pools.PROBLEM_DB.query(SQL_QUERIES.problem.GET_SOLUTION, [problemId]);
      return rows[0];
    } catch (err) {
      dbLogger.error(`Error getting problem solution: ${err.message}`);
      throw new Error(`Error getting problem solution: ${err.message}`);
    }
  }

  async getProblemDifficulty(problemId) {
    try {
      const [rows] = await pools.PROBLEM_DB.query(SQL_QUERIES.problem.GET_PROBLEM_DIFFICULTY, [
        problemId,
      ]);
      return rows[0];
    } catch (err) {
      dbLogger.error(`Error getting problem difficulty: ${err.message}`);
      throw new Error(`Error getting problem difficulty: ${err.message}`);
    }
  }

  async getAnswer(problemId) {
    try {
      const [rows] = await pools.PROBLEM_DB.query(SQL_QUERIES.problem.GET_ANSWER, [problemId]);
      return rows;
    } catch (err) {
      dbLogger.error(`Error getting answer: ${err.message}`);
      throw new Error(`Error getting answer: ${err.message}`);
    }
  }
}

import pools from '../mysql/createPool.js';
import { SQL_QUERIES } from './queries.js';

export class ProblemRepository {
  async createProblem(sector_id, typeNum, problemData) {
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
  }

  async createAnswer(problemId, typeNum, answers) {
    switch (typeNum) {
      case 1:
        // normal answer 의 첫번째 인자는 정답
        let isCorrect = true;
        for (const answer of answers) {
          await pools.PROBLEM_DB.query(SQL_QUERIES.option.CREATE_OPTION, [
            problemId,
            answer,
            isCorrect,
          ]);
          if (isCorrect) isCorrect = false;
        }
        break;
      case 2:
        await pools.PROBLEM_DB.query(SQL_QUERIES.option.CREATE_OPTION, [
          problemId,
          Number(answers),
          true,
        ]);
        break;
      case 3:
        await pools.PROBLEM_DB.query(SQL_QUERIES.option.CREATE_OPTION, [
          problemId,
          answers[0],
          true,
        ]);
        break;
    }
  }

  async getProblemCount(sectorId, typeNum, difficulty) {
    // 조건에 맞는 쿼리 호출
    const [rows] = await pools.PROBLEM_DB.query(SQL_QUERIES.problem.GET_PROBLEM_COUNT, [
      sectorId,
      typeNum,
      difficulty,
    ]);
    // 토탈카운트 반환, 조회 안될 시 0 반환
    return rows[0].total_count | 0;
  }

  async getProblemList(sectorId, typeNum, difficulty, page, limit) {
    // 오프셋 계산
    const offset = (page - 1) * limit;

    // 문제 리스트 쿼리 호출
    const [rows] = await pools.PROBLEM_DB.query(SQL_QUERIES.problem.FIND_PROBLEM_LIST, [
      sectorId,
      typeNum,
      difficulty,
      Number(limit),
      offset,
    ]);
    // 리스트 반환
    return rows;
  }

  async getProblem(problemId) {
    const [rows] = await pools.PROBLEM_DB.query(SQL_QUERIES.problem.FIND_PROBLEM, [problemId]);

    return rows;
  }

  async getProblemSolution(problemId) {
    const [rows] = await pools.PROBLEM_DB.query(SQL_QUERIES.problem.GET_SOLUTION, [problemId]);

    return rows[0];
  }

  async getAnswer(problemId) {
    const [rows] = await pools.PROBLEM_DB.query(SQL_QUERIES.problem.GET_ANSWER, [problemId]);

    return rows;
  }
}

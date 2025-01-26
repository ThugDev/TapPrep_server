import pools from '../mysql/createPool.js';
import { SQL_QUERIES } from './queries.js';

export class ProblemRepository {
  async createProblem(sector_id, problemData) {
    // 쿼리데이터 순번 보장을 위한 구조 분해할당
    const { difficulty, title, description, hint, explanation, reference } = problemData;

    // 쿼리에 넣을 데이터 준비
    const queryData = [[sector_id, difficulty, title, description, hint, explanation, reference]];

    // 쿼리 실행
    const [rows] = await pools.PROBLEM_DB.query(SQL_QUERIES.problem.CREATE_PROBLEM, [queryData]);
    // 번호 반환
    return rows.insertId;
  }

  async createAnswer(problemId, answers) {
    // answer 의 첫번째 인자는 정답
    let isCorrect = true;

    for (const answer of answers) {
      await pools.PROBLEM_DB.query(SQL_QUERIES.option.CREATE_OPTION, [
        problemId,
        answer,
        isCorrect,
      ]);
      if (isCorrect) isCorrect = false;
    }
  }

  async getProblemCount(sectorId, difficulty) {
    // 조건에 맞는 쿼리 호출
    const [rows] = await pools.PROBLEM_DB.query(SQL_QUERIES.problem.GET_PROBLEM_COUNT, [
      sectorId,
      difficulty,
    ]);
    // 토탈카운트 반환, 조회 안될 시 0 반환
    return rows[0].total_count | 0;
  }

  async getProblemList(sectorId, difficulty, page) {
    // 오프셋 계산
    const offset = (page - 1) * 10;

    // 문제 리스트 쿼리 호출
    const [rows] = await pools.PROBLEM_DB.query(SQL_QUERIES.problem.FIND_PROBLEM_LIST, [
      sectorId,
      difficulty,
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

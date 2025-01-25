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
}

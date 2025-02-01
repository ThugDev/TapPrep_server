import pools from '../mysql/createPool.js';
import { SQL_QUERIES } from './queries.js';

export class ProgressRepository {
  async createProgress(userId, problemId, type, isCorrect, option) {
    await pools.PROGRESS_DB.query(SQL_QUERIES.progress.CREATE_PROGRESS, [
      userId,
      problemId,
      type,
      isCorrect,
      option,
    ]);
  }

  async getProgress(userId) {
    const [rows] = await pools.PROGRESS_DB.query(SQL_QUERIES.progress.GET_PROGRESS, [userId]);
    return rows;
  }

  async getProblemProgress(userId, problemId) {
    const [rows] = await pools.PROGRESS_DB.query(SQL_QUERIES.progress.GET_PROBLEM_PROGRESS, [
      userId,
      problemId,
    ]);
    return rows.length > 0 ? rows[0] : null;
  }
}

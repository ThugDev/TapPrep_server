import pools from '../mysql/createPool.js';
import { SQL_QUERIES } from './queries.js';
import { dbLogger } from '../utils/log/logger.js';

export class ProgressRepository {
  async createProgress(userId, problemId, type, isCorrect, option) {
    try {
      await pools.PROGRESS_DB.query(SQL_QUERIES.progress.CREATE_PROGRESS, [
        userId,
        problemId,
        type,
        isCorrect,
        option,
      ]);
    } catch (err) {
      dbLogger.error(`${userId} - Error occurred while creating progress: ${err.message}`);
      throw new Error(`Error occurred while creating progress: ${err.message}`);
    }
  }

  async getProgress(userId) {
    try {
      const [rows] = await pools.PROGRESS_DB.query(SQL_QUERIES.progress.GET_PROGRESS, [userId]);
      return rows;
    } catch (err) {
      dbLogger.error(`${userId} - Error occurred while fetching progress: ${err.message}`);
      throw new Error(`Error occurred while fetching progress: ${err.message}`);
    }
  }

  async getProblemProgress(userId, problemId) {
    try {
      const [rows] = await pools.PROGRESS_DB.query(SQL_QUERIES.progress.GET_PROBLEM_PROGRESS, [
        userId,
        problemId,
      ]);
      return rows.length > 0 ? rows[0] : null;
    } catch (err) {
      dbLogger.error(`${userId} - Error occurred while fetching problem progress: ${err.message}`);
      throw new Error(`Error occurred while fetching problem progress: ${err.message}`);
    }
  }
}

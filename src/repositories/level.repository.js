import pools from '../mysql/createPool.js';
import { dbLogger } from '../utils/log/logger.js';
import { SQL_QUERIES } from './queries.js';

export class LevelRepository {
  async getLevel(userId) {
    try {
      const [rows] = await pools.USER_DB.query(SQL_QUERIES.level.GET_LEVEL, [userId]);
      return rows.length > 0 ? rows[0] : null;
    } catch (err) {
      dbLogger.error(`${userId} - Error occurred while fetching user level : ${err}`);
      throw new Error(`Error occurred while fetching user level : ${err.message}`);
    }
  }

  async updateLevel(userId, level, exp) {
    try {
      const [rows] = await pools.USER_DB.query(SQL_QUERIES.level.UPDATE_LEVEL, [
        level,
        exp,
        userId,
      ]);
      return rows ? 'Level updated successfully' : null;
    } catch (err) {
      dbLogger.error(`${userId} - Error occurred while updating user level : ${err}`);
      throw new Error(`Error occurred while fetching user level : ${err.message}`);
    }
  }
}

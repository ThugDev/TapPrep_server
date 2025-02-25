import pools from '../mysql/createPool.js';
import { SQL_QUERIES } from './queries.js';

export class LevelRepository {
  async getLevel(userId) {
    const [rows] = await pools.USER_DB.query(SQL_QUERIES.level.GET_LEVEL, [userId]);
    return rows.length > 0 ? rows[0] : null;
  }

  async updateLevel(userId, level, exp) {
    const [rows] = await pools.USER_DB.query(SQL_QUERIES.level.UPDATE_LEVEL, [level, exp, userId]);
    return rows ? 'Level updated successfully' : null;
  }
}

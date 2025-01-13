import pools from '../mysql/createPool.js';
import { logger } from '../utils/log/logger.js';
import { SQL_QUERIES } from './queries.js';

export class AuthRepository {
  async createUser(userData) {
    try {
      const { login: username, name: nickname, avatar_url: profile_image, email } = userData;
      if (!username || !nickname || !profile_image || !email) {
        throw new Error('Invalid arguments');
      }

      // 사용자 생성 로직
      const [rows] = await pools.USER_DB.query(SQL_QUERIES.auth.CREATE_USER, [
        username,
        nickname,
        profile_image,
        email,
      ]);

      return rows;
    } catch (err) {
      logger.error(`${userData.login} - Error creating user : ${err}`);
      throw new Error('Error creating user');
    }
  }

  async getUserById(username) {
    try {
      if (!username) {
        throw new Error('Invalid arguments');
      }
      // 사용자 조회 로직
      const [rows] = await pools.USER_DB.query(SQL_QUERIES.auth.FIND_USER_BY_ID, [username]);
      return rows.length > 0 ? rows[0] : null;
    } catch (err) {
      logger.error(`${username} - Error finding user : ${err}`);
      throw new Error('Error finding user');
    }
  }

  async updateUserNickname(username, nickname) {
    try {
      // 사용자 업데이트 로직
      if (!username || !nickname) {
        throw new Error('Invalid arguments');
      }
      const [rows] = await pools.USER_DB.query(SQL_QUERIES.auth.UPDATE_USER_NICKNAME, [
        nickname,
        username,
      ]);
      return rows;
    } catch (err) {
      logger.error(`${username} - Error updating nickname : ${err}`);
      throw new Error('Error updating nickname');
    }
  }

  async deleteUser(username) {
    // 사용자 삭제 로직
    try {
      if (!username) {
        throw new Error('Invalid arguments');
      }
      const [rows] = await pools.USER_DB.query(SQL_QUERIES.auth.DELETE_USER, [username]);
      return rows;
    } catch (err) {
      logger.error(`${username} - Error deleting user : ${err}`);
      throw new Error('Error deleting user');
    }
  }
}

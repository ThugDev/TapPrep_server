import pools from '../mysql/createPool.js';
import { SQL_QUERIES } from './queries.js';
import { dbLogger } from '../utils/log/logger.js';

export class ProfileRepository {
  async getProfile(username) {
    try {
      // 프로필 조회 로직
      const [rows] = await pools.USER_DB.query(SQL_QUERIES.profile.GET_PROFILE, [username]);
      return rows.length > 0 ? rows[0] : null;
    } catch (err) {
      dbLogger.error(`${username} - Error occurred while fetching profile: ${err.message}`);
      throw new Error(`Error occurred while fetching profile: ${err.message}`);
    }
  }

  async updateProfile(username, nickname, profile_image) {
    try {
      // 프로필 업데이트 로직
      const [rows] = await pools.USER_DB.query(SQL_QUERIES.profile.UPDATE_PROFILE, [
        nickname,
        profile_image,
        username,
      ]);
      return rows ? 'Profile updated successfully' : null;
    } catch (err) {
      dbLogger.error(`${username} - Error occurred while updating profile: ${err.message}`);
      throw new Error(`Error occurred while updating profile: ${err.message}`);
    }
  }

  async updateProfileNickname(username, nickname) {
    try {
      // 프로필 닉네임 업데이트 로직
      const [rows] = await pools.USER_DB.query(SQL_QUERIES.profile.UPDATE_PROFILE_NICKNAME, [
        nickname,
        username,
      ]);
      return rows ? 'Nickname updated successfully' : null;
    } catch (err) {
      dbLogger.error(`${username} - Error occurred while updating nickname: ${err.message}`);
      throw new Error(`Error occurred while updating nickname: ${err.message}`);
    }
  }

  async updateProfileProfileImage(username, profile_image) {
    try {
      // 프로필 이미지 업데이트 로직
      const [rows] = await pools.USER_DB.query(SQL_QUERIES.profile.UPDATE_PROFILE_IMAGE, [
        profile_image,
        username,
      ]);
      return rows ? 'Profile image updated successfully' : null;
    } catch (err) {
      dbLogger.error(`${username} - Error occurred while updating profile image: ${err.message}`);
      throw new Error(`Error occurred while updating profile image: ${err.message}`);
    }
  }
}

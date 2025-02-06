import pools from '../mysql/createPool.js';
import { SQL_QUERIES } from './queries.js';

export class ProfileRepository {
  async getProfile(username) {
    // 프로필 조회 로직

    const [rows] = await pools.USER_DB.query(SQL_QUERIES.profile.GET_PROFILE, [username]);
    return rows.length > 0 ? rows[0] : null;
  }

  async updateProfile(username, nickname, profile_image) {
    // 프로필 업데이트 로직
    const [rows] = await pools.USER_DB.query(SQL_QUERIES.profile.UPDATE_PROFILE, [
      nickname,
      profile_image,
      username,
    ]);

    return rows ? 'Profile updated successfully' : null;
  }

  async updateProfileNickname(username, nickname) {
    // 프로필 닉네임 업데이트 로직
    const [rows] = await pools.USER_DB.query(SQL_QUERIES.profile.UPDATE_PROFILE_NICKNAME, [
      nickname,
      username,
    ]);
    return rows ? 'Nickname updated successfully' : null;
  }

  async updateProfileProfileImage(username, profile_image) {
    // 프로필 이미지 업데이트 로직
    const [rows] = await pools.USER_DB.query(SQL_QUERIES.profile.UPDATE_PROFILE_IMAGE, [
      profile_image,
      username,
    ]);
    return rows ? 'Profile_image updated successfully' : null;
  }
}

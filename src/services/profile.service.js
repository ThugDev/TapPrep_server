import { ProfileRepository } from '../repositories/profile.repository.js';
import CustomErr from '../utils/error/CustomErr.js';
import { ERR_CODES } from '../utils/error/ERR_CODES.js';

export class ProfileService {
  constructor() {
    this.profileRepository = new ProfileRepository();
  }

  async getProfile(username) {
    // 프로필 조회
    const profile = await this.profileRepository.getProfile(username);

    // 프로필이 없으면 에러 발생
    if (!profile) {
      throw new CustomErr(ERR_CODES.NOT_FOUND, 'User Not Found');
    }
    return profile;
  }

  async updateProfile(username, nickname, profile_image) {
    let profile = {};
    // 닉네임, 프로필 이미지 둘 다 있을 때
    if (nickname && profile_image) {
      profile.result = await this.profileRepository.updateProfile(
        username,
        nickname,
        profile_image,
      );
      // 닉네임만 있을 때
    } else if (nickname) {
      profile.result = await this.profileRepository.updateProfileNickname(username, nickname);
      // 프로필 이미지만 있을 때
    } else {
      profile.result = await this.profileRepository.updateProfileProfileImage(
        username,
        profile_image,
      );
    }

    // 프로필 업데이트 실패 시 에러 발생
    if (!profile) {
      throw new CustomErr(ERR_CODES.INTERNAL_SERVER_ERROR, 'Error updating profile');
    }
    profile.data = await this.profileRepository.getProfile(username);

    return profile;
  }
}

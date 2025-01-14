import { url } from '../constants/url.js';
import { ProfileService } from '../services/profile.service.js';
import CustomErr from '../utils/error/CustomErr.js';
import { ERR_CODES } from '../utils/error/ERR_CODES.js';

export class ProfileController {
  constructor() {
    this.profileService = new ProfileService();
  }

  getProfile = async (req, res, next) => {
    try {
      const { username } = req.user;
      const profile = await this.profileService.getProfile(username);

      return res.status(200).json({
        statusCode: 200,
        message: 'Get Profile Success',
        userData: {
          username: profile.username,
          nickname: profile.nickname,
          profile_image: profile.profile_image,
          level: profile.level,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  updateProfile = async (req, res, next) => {
    try {
      const {
        user: { username },
        body: { nickname, profile_image },
      } = req;

      if (!nickname && !profile_image) {
        throw new CustomErr(ERR_CODES.BAD_REQUEST, 'Invalid arguments');
      }

      // TODO: 닉네임 검증

      // TODO: 프로필 이미지 링크 검증

      const profile = await this.profileService.updateProfile(username, nickname, profile_image);

      return res.status(200).json({
        statusCode: 200,
        message: profile.result,
        userData: {
          username: profile.data.username,
          nickname: profile.data.nickname,
          profile_image: profile.data.profile_image,
          level: profile.data.level,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  deleteProfile = async (req, res, next) => {
    try {
      const { username } = req.user;
      // 프로필 이미지 삭제가 기본이미지로 변경이기 때문에 update 활용
      const profile = await this.profileService.updateProfile(username, null, url.profile.default);

      // 반환받은 프로필 이미지가 기본이미지가 아닐 때 에러 투척
      if (profile.data.profile_image !== url.profile.default) {
        throw new CustomErr(ERR_CODES.INTERNAL_SERVER_ERROR, 'Error deleting profile image');
      }
      return res.status(200).json({
        statusCode: 200,
        message: 'Delete Profile Success',
      });
    } catch (err) {
      next(err);
    }
  };
}

import { config } from '../config/config.js';
import { url } from '../constants/url.js';
import { AuthRepository } from '../repositories/auth.repository.js';
import CustomErr from '../utils/error/CustomErr.js';
import { ERR_CODES } from '../utils/error/ERR_CODES.js';
import { logger } from '../utils/log/logger.js';
import { TokenManager } from '../utils/manager/tokenManager.js';

export class AuthService {
  constructor() {
    this.authRepository = new AuthRepository();
    this.tokenManager = new TokenManager();
  }

  async oAuthLogin(code) {
    // OAuth 액세스토큰 취득
    const gitAccessToken = await this.getAccessToken(code);

    // 액세스토큰으로 사용자 정보 취득
    const userData = await this.getGitData(gitAccessToken);

    // 사용자 정보로 DB 조회 (없으면 생성)
    const isExistUser = await this.authRepository.getUserById(userData.login);
    let user_id, username, nickname, profile_image;
    if (!isExistUser) {
      user_id = await this.authRepository.createUser(userData);
      username = userData.login;
      nickname = userData.name;
      profile_image = userData.avatar_url;
    } else {
      ({ user_id, username, nickname, profile_image } = isExistUser);
    }

    // JWT 토큰 생성
    const accessToken = this.tokenManager.createAccessToken(user_id, username);
    const refreshToken = await this.tokenManager.createRefreshToken(user_id, username);

    if (!accessToken || !refreshToken) {
      throw new CustomErr(ERR_CODES.INTERNAL_SERVER_ERROR, 'Error creating token');
    }

    return {
      accessToken,
      refreshToken,
      username,
      nickname,
      profile_image,
    };
  }

  async logout(username, accessToken) {
    // 액세스 토큰 만료
    this.tokenManager.expireToken(accessToken);

    // 리프레시 토큰 삭제
    const result = await this.tokenManager.deleteRefreshToken(username);
    if (!result) {
      throw new CustomErr(ERR_CODES.INTERNAL_SERVER_ERROR, 'Error deleting token');
    }
  }

  async deleteUser(username, accessToken) {
    const result = await this.authRepository.deleteUser(username);
    if (!result) {
      throw new CustomErr(ERR_CODES.INTERNAL_SERVER_ERROR, 'Error deleting user');
    }
    this.logout(username, accessToken);
    return result;
  }

  async getAccessToken(code) {
    // OAuth 액세스토큰 취득 로직
    const response = await fetch(url.git.accessToken, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: config.git.client_id,
        client_secret: config.git.client_secret,
        code,
      }),
    });

    if (!response.ok) {
      // 에러 처리
      logger.error(`Error getting git access token : ${response.status}`);
      throw new CustomErr(ERR_CODES.INTERNAL_SERVER_ERROR, 'Error getting git access token');
    }

    const data = await response.text();
    const accessToken = new URLSearchParams(data).get('access_token');

    return accessToken;
  }

  async getGitData(accessToken) {
    // 사용자 정보 취득 로직
    const response = await fetch(url.git.userData, {
      method: 'GET',
      headers: {
        Authorization: `token ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // 에러 처리
      logger.error(`Error getting git Data : ${response.status}`);
      throw new CustomErr(ERR_CODES.INTERNAL_SERVER_ERROR, 'Error getting git Data');
    }

    const userData = await response.json();

    return userData;
  }

  async refreshToken(username, token) {
    // 리프레시 토큰 검증
    const isEqualToken = await this.tokenManager.compareRefreshToken(username, token);
    if (isEqualToken === null) {
      throw new CustomErr(ERR_CODES.NOT_FOUND, 'Not Found refresh token');
    } else if (!isEqualToken) {
      throw new CustomErr(ERR_CODES.UNAUTHORIZED, 'Invalid refresh token');
    }

    // 토큰 페이로드 획득
    const payload = this.tokenManager.decodeToken(token);

    // 액세스 토큰 발급
    const accessToken = this.tokenManager.createAccessToken(payload.user_id, username);
    if (!accessToken) {
      throw new CustomErr(ERR_CODES.INTERNAL_SERVER_ERROR, 'Error creating token');
    }

    return accessToken;
  }
}

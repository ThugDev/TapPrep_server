import { config } from '../config/config.js';
import { url } from '../constants/url.js';
import { AuthRepository } from '../repositories/auth.repository.js';
import CustomErr from '../utils/error/CustomErr.js';
import { createAccessToken, createRefreshToken } from '../utils/jwt/createToken.js';
import { logger } from '../utils/log/logger.js';

export class AuthService {
  constructor() {
    this.authRepository = new AuthRepository();
  }

  async oAuthLogin(code) {
    // OAuth 액세스토큰 취득
    const gitAccessToken = await this.getAccessToken(code);

    // 액세스토큰으로 사용자 정보 취득
    const userData = await this.getGitData(gitAccessToken);

    // 사용자 정보로 DB 조회 (없으면 생성)
    const isExistUser = await this.authRepository.getUserById(userData.login);
    let { username, nickname, profile_image } = isExistUser;

    if (!isExistUser) {
      await this.authRepository.createUser(userData);
      username = userData.login;
      nickname = userData.name;
      profile_image = userData.avatar_url;
    }

    // JWT 토큰 생성
    const accessToken = createAccessToken(userData.login);
    const refreshToken = createRefreshToken(userData.login);

    return {
      accessToken,
      refreshToken,
      username,
      nickname,
      profile_image,
    };
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
      throw new CustomErr(500, 'Error getting git access token');
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
      throw new CustomErr(500, 'Error getting git Data');
    }

    const userData = await response.json();

    return userData;
  }
}

import { AuthRepository } from '../repositories/auth.repository.js';

export class AuthServices {
  constructor() {
    this.authRepository = new AuthRepository();
  }

  async oAuthLogin(code) {
    // OAuth 액세스토큰 취득
    const accessToken = await this.getAccessToken(code);

    // 액세스토큰으로 사용자 정보 취득
    const userData = await this.getGitData(accessToken);

    // 사용자 정보로 DB 조회 (없으면 생성)
    const isExistUser = await this.authRepository.getUserById(userData.id);
    if (!isExistUser) {
      await this.authRepository.createUser(userData);
    }

    // JWT 토큰 생성

    return {};
  }

  async getAccessToken(code) {
    // OAuth 액세스토큰 취득 로직
  }

  async getGitData(accessToken) {
    // 사용자 정보 취득 로직
  }
}

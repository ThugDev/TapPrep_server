import { config } from '../../config/config.js';
import { checkHashed } from '../auth/checkHashed.js';
import { hashed } from '../auth/hashed.js';
import CustomErr from '../error/CustomErr.js';
import { ERR_CODES } from '../error/ERR_CODES.js';
import redisClient from '../redis/redisClient.js';
import jwt from 'jsonwebtoken';

export class TokenManager {
  constructor() {
    if (TokenManager.instance) {
      return TokenManager.instance;
    }
    TokenManager.instance = this;
    this.redis = redisClient;

    // 로그아웃시킨 액세스토큰 저장용
    this.removalToken = new Map();
    // 액세스토큰 만료 시간이 30분이므로 30분마다 만료된 토큰을 정리
    this.cleanRemovalToken();
  }

  // 만료된 토큰 정리
  cleanRemovalToken() {
    const CLEAN_INTERVAL = 1000 * 60 * 30; // 30분

    setInterval(() => {
      const now = Date.now();

      // 만료된 토큰 정리
      const cleanExpiredTokens = (map) => {
        for (const [token, exp] of map.entries()) {
          if (now > exp) {
            map.delete(token);
          }
        }
      };

      // 로그아웃용
      cleanExpiredTokens(this.removalToken);
    }, CLEAN_INTERVAL);
  }

  // 관리자 액세스토큰 등록
  async setAdminToken(username, token) {
    // 토큰 해시화화
    const hashedToken = await hashed(token);

    // 레디스에 저장
    const rUsername = username + ':adminToken';
    await this.redis.set(rUsername, hashedToken, 'EX', 60 * 60 * 24 * 7);
  }

  // 관리자 액세스토큰 확인
  async isAdminToken(username, token) {
    // 레디스에서 확인
    this.redis.get(username + ':adminToken', async (err, hashedToken) => {
      if (err) return false;
      return await checkHashed(token, hashedToken);
    });
  }

  // 액세스토큰 생성
  createAccessToken(user_id, username, isAdmin) {
    try {
      const payload = { user_id, username };
      const options = { expiresIn: '30m' };
      const token = jwt.sign(payload, config.auth.secret_key, options);

      // 어드민의 경우 레디스 등록
      if (isAdmin) {
        this.setAdminToken(username, token);
      }

      return token;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  // 액세스토큰 검증
  decodeToken(token) {
    try {
      if (this.removalToken.has(token)) {
        const err = new Error('Token has expired');
        err.name = 'TokenExpiredError';
        throw err;
      }
      const secretKey = config.auth.secret_key;
      const payload = jwt.verify(token, secretKey);
      return payload;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new CustomErr(ERR_CODES.UNAUTHORIZED, 'Token has expired');
      } else {
        throw new CustomErr(ERR_CODES.UNAUTHORIZED, 'Token is invalid');
      }
    }
  }

  // 로그아웃 시 액세스토큰 만료용
  expireToken(token) {
    const decodedToken = jwt.decode(token);
    const exp = decodedToken.exp * 1000;
    const now = Date.now();
    if (now > exp) return;
    this.removalToken.set(token, exp);
  }

  // 리프레시토큰 생성
  async createRefreshToken(user_id, username, isAdmin) {
    try {
      const payload = { user_id, username };
      const options = { expiresIn: '7d' };
      const token = jwt.sign(payload, config.auth.secret_key, options);
      const hashedToken = await hashed(token);

      // 리프레시토큰은 7일간 유효 (레디스 저장)
      const rUsername = username + ':refreshToken';
      const rData = JSON.stringify({ isAdmin, hashedToken });
      await this.redis.set(rUsername, rData, 'EX', 60 * 60 * 24 * 7);
      return token;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  // 리프레시토큰 삭제
  async deleteRefreshToken(username) {
    try {
      const rUsername = username + ':refreshToken';
      await this.redis.del(rUsername);
      return true;
    } catch (err) {
      return false;
    }
  }

  // 리프레시토큰 비교
  async compareRefreshTokenAndIsAdmin(username, refreshToken) {
    try {
      const rUsername = username + ':refreshToken';
      const redisData = await this.redis.get(rUsername);
      if (!redisData) return null;
      const isCorrectToken = this.decodeToken(refreshToken);
      if (!isCorrectToken) throw new CustomErr(ERR_CODES.UNAUTHORIZED, 'Token is invalid');

      const { isAdmin, hashedToken } = JSON.parse(redisData);
      const result = await checkHashed(refreshToken, hashedToken);
      // 토큰이 맞으면 isAdmin 반환
      return result ? { result, isAdmin } : false;
    } catch (err) {
      return false;
    }
  }
}

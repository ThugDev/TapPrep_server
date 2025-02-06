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
    setInterval(
      () => {
        const now = Date.now();
        for (const [token, exp] of this.removalToken) {
          if (now > exp) {
            this.removalToken.delete(token);
          }
        }
      },
      1000 * 60 * 30,
    );
  }

  // 액세스토큰 생성
  createAccessToken(user_id, username) {
    try {
      const payload = { user_id, username };
      const options = { expiresIn: '30m' };
      const token = jwt.sign(payload, config.auth.secret_key, options);
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
  async createRefreshToken(user_id, username) {
    try {
      const payload = { user_id, username };
      const options = { expiresIn: '7d' };
      const token = jwt.sign(payload, config.auth.secret_key, options);
      const hashedToken = await hashed(token);

      // 리프레시토큰은 7일간 유효 (레디스 저장)
      await this.redis.set(username, hashedToken, 'EX', 60 * 60 * 24 * 7);
      return token;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  // 리프레시토큰 삭제
  async deleteRefreshToken(username) {
    try {
      await this.redis.del(username);
      return true;
    } catch (err) {
      return false;
    }
  }

  // 리프레시토큰 비교
  async compareRefreshToken(username, refreshToken) {
    try {
      const hashedToken = await this.redis.get(username);
      if (!hashedToken) return null;
      const isCorrectToken = this.decodeToken(refreshToken);
      if (!isCorrectToken) throw new CustomErr(ERR_CODES.UNAUTHORIZED, 'Token is invalid');
      return await checkHashed(refreshToken, hashedToken);
    } catch (err) {
      return false;
    }
  }
}

import { config } from '../../config/config.js';
import { checkHashed } from '../auth/checkHashed.js';
import { hashed } from '../auth/hashed.js';
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
  }

  // 액세스토큰 생성
  createAccessToken(username) {
    try {
      const payload = { username };
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

  async createRefreshToken(username) {
    try {
      const payload = { username };
      const options = { expiresIn: '7d' };
      const token = jwt.sign(payload, config.auth.secret_key, options);
      const hashedToken = await hashed(token);
      await this.redis.set(username, hashedToken, 'EX', 60 * 60 * 24 * 7);
      return token;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async compareRefreshToken(username, refreshToken) {
    try {
      const hashedToken = await this.redis.get(username);
      if (!hashedToken) return null;
      const isCorrectToken = await this.decodeToken(refreshToken);
      if (!isCorrectToken) throw new CustomErr(ERR_CODES.UNAUTHORIZED, 'Token is invalid');
      return await checkHashed(refreshToken, hashedToken);
    } catch (err) {
      return false;
    }
  }
}

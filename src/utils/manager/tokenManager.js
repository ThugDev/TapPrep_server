import { config } from '../../config/config.js';
import { checkHashed } from '../auth/checkHashed.js';
import { hashed } from '../auth/hashed.js';
import redisClient from '../redis/redisClient.js';
import jwt from 'jsonwebtoken';

export class TokenManager {
  constructor() {
    this.redis = redisClient;
  }

  async createAccessToken(username) {
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

  async compareAccessToken(token) {
    try {
      const payload = jwt.verify(token, config.auth.secret_key);
      return payload;
    } catch (err) {
      return false;
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
      if (!hashedToken) return false;
      return await checkHashed(refreshToken, hashedToken);
    } catch (err) {
      return false;
    }
  }
}

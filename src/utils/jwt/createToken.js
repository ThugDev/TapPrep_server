import { config } from '../../config/config.js';
import jwt from 'jsonwebtoken';

export const createAccessToken = (userId) => {
  const payload = { userId };
  const options = { expiresIn: '30m' };
  const token = jwt.sign(payload, config.auth.secret_key, options);

  return token;
};

export const createRefreshToken = (userId) => {
  const payload = { userId };
  const options = { expiresIn: '7d' };
  const token = jwt.sign(payload, config.auth.secret_key, options);

  return token;
};

import { config } from '../../config/config.js';
import jwt from 'jsonwebtoken';

export const createAccessToken = (username) => {
  const payload = { username };
  const options = { expiresIn: '30m' };
  const token = jwt.sign(payload, config.auth.secret_key, options);

  return token;
};

export const createRefreshToken = (username) => {
  const payload = { username };
  const options = { expiresIn: '7d' };
  const token = jwt.sign(payload, config.auth.secret_key, options);

  return token;
};

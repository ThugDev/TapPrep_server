import {
  CLIENT_ID,
  CLIENT_SECRET,
  HOST,
  PEPPER,
  PORT,
  SALT,
  SECRET_KEY,
} from '../constants/env.js';

export const config = {
  server: {
    host: HOST,
    port: PORT,
  },
  auth: {
    pepper: PEPPER,
    salt: SALT,
    secret_key: SECRET_KEY,
  },
  git: {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  },
};

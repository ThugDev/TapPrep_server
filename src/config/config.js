import {
  CERT,
  CLIENT_ID,
  CLIENT_SECRET,
  DB1_HOST,
  DB1_NAME,
  DB1_PASSWORD,
  DB1_PORT,
  DB1_USER,
  HOST,
  KEY,
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
    key: KEY,
    cert: CERT,
  },
  git: {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  },
  database: {
    USER_DB: {
      name: DB1_NAME,
      user: DB1_USER,
      password: DB1_PASSWORD,
      host: DB1_HOST,
      port: DB1_PORT,
    },
  },
};

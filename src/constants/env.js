import dotenv from 'dotenv';

dotenv.config();

/* ============================SERVER============================ */
export const PORT = process.env.PORT;
export const HOST = process.env.HOST;

/* ============================ AUTH ============================ */
export const PEPPER = process.env.PEPPER;
export const SALT = process.env.SALT;
export const SECRET_KEY = process.env.SECRET_KEY;

/* ============================ GIT ============================ */
export const CLIENT_ID = process.env.CLIENT_ID;
export const CLIENT_SECRET = process.env.CLIENT_SECRET;

/* ============================ CERT ============================ */
export const KEY = process.env.KEY;
export const CERT = process.env.CERT;

/* ============================ D B ============================ */
export const DB1_NAME = process.env.DB1_NAME;
export const DB1_USER = process.env.DB1_USER;
export const DB1_PASSWORD = process.env.DB1_PASSWORD;
export const DB1_HOST = process.env.DB1_HOST;
export const DB1_PORT = process.env.DB1_PORT;

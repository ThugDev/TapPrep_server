import dotenv from 'dotenv';

dotenv.config();

/* ============================SERVER============================ */
export const PORT = process.env.PORT;
export const HOST = process.env.HOST;

/* ============================ AUTH ============================ */
export const PEPPER = process.env.PEPPER;
export const SALT = process.env.SALT;
export const SECRET_KEY = process.env.SECRET_KEY;

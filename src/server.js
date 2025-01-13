import express from 'express';
import { config } from './config/config.js';
import router from './router/index.route.js';
import https from 'https';
import fs from 'fs';
import { fileExists } from './utils/file/fileExists.js';
import { logger } from './utils/log/logger.js';
import { initServer } from './init/initServer.js';
import errorHandlingMiddleware from './middlewares/error-handling.middleware.js';

const app = express();
// SSL 인증서 파일 경로 설정

app.use(express.json());
app.use('/', router);
app.use(errorHandlingMiddleware);

// 인증서 있는지 확인
const [keyExists, certExists] = await Promise.all([
  fileExists(config.auth.key),
  fileExists(config.auth.cert),
]);

const certExist = keyExists || certExists;

// 인증서 유무에 따른 서버 실행
if (certExist) {
  // 서버 초기화 (인증서 로드)
  const sslOptions = {
    key: fs.readFileSync(config.auth.key), // 개인 키 파일
    cert: fs.readFileSync(config.auth.cert), // 인증서 파일
  };

  initServer().then(() => {
    https.createServer(sslOptions, app).listen(config.server.port, () => {
      logger.info(`${config.server.port} PORT - HTTPS SERVER ON!`);
    });
  });
} else {
  // 서버 초기화 (인증서 X)
  logger.warn('Failed to load SSL certificate');
  initServer().then(() => {
    app.listen(config.server.port, () => {
      logger.info(`${config.server.port} PORT - HTTP SERVER ON!`);
    });
  });
}

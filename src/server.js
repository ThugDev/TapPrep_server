import express from 'express';
import { config } from './config/config.js';
import router from './router/index.route.js';
import https from 'https';

console.log('hi');
const app = express();
// SSL 인증서 파일 경로 설정
/*
const sslOptions = {
  key: fs.readFileSync(config.auth.key), // 개인 키 파일
  cert: fs.readFileSync(config.auth.cert), // 인증서 파일
};
*/

app.use(express.json());
app.use('/', router);
//app.use(errorHandlingMiddleware);

// 서버 초기화
/*
initServer().then(() => {
  https.createServer(sslOptions, app).listen(config.server.port, () => {
    console.log(`${config.server.port} 포트로 HTTPS 서버가 열렸어요!`);
  });
});
*/

app.listen(config.server.port, () => {
  console.log(`${config.server.port} 포트로 HTTPS 서버가 열렸어요!`);
});

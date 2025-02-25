import CustomErr from '../utils/error/CustomErr.js';
import { ERR_CODES } from '../utils/error/ERR_CODES.js';
import { TokenManager } from '../utils/manager/tokenManager.js';

const tokenManager = new TokenManager();

export default async function (req, _, next) {
  try {
    const { authorization } = req.headers; // 헤더에서 토큰 정보 추출
    // const clientIp = req.headers['x-real-ip'] || req.connection.remoteAddress;

    // if (!authorization && config.admin.host.some((x) => x === clientIp)) {
    //   const user_id = 0;
    //   const username = 'admin';
    //   req.user = { user_id, username };
    //   return next();
    // }

    if (!authorization)
      // 토큰이 없을 시 에러
      throw new CustomErr(ERR_CODES.NOT_FOUND, 'Not Found TOKEN');

    const [type, token] = authorization.split(' ');
    const transferType = type.toLowerCase();
    if (transferType !== 'bearer')
      throw new CustomErr(ERR_CODES.BAD_REQUEST, 'Token type mismatch');

    const payload = tokenManager.decodeToken(token);
    payload.accessToken = token; // 리프레시 토큰 추가

    req.user = payload; // req 객체에 사용자 정보 추가
    next(); // 다음 미들웨어로 전달
  } catch (err) {
    next(err);
  }
}

import CustomErr from '../utils/error/CustomErr.js';
import { ERR_CODES } from '../utils/error/ERR_CODES.js';
import { TokenManager } from '../utils/manager/tokenManager.js';

const tokenManager = new TokenManager();

export default async function (req, _, next) {
  try {
    const { authorization } = req.headers; // 헤더에서 토큰 정보 추출
    if (!authorization)
      // 토큰이 없을 시 에러
      throw new CustomErr(ERR_CODES.NOT_FOUND, 'Not Found TOKEN');

    const [type, token] = authorization.split(' ');

    if (type !== 'bearer') throw new CustomErr(ERR_CODES.BAD_REQUEST, 'Token type mismatch');

    const payload = tokenManager.decodeToken(token);

    req.user = payload;
    next(); // 다음 미들웨어로 전달
  } catch (err) {
    next(err);
  }
}

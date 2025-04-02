import CustomErr from '../utils/error/CustomErr.js';
import { ERR_CODES } from '../utils/error/ERR_CODES.js';
import { TokenManager } from '../utils/manager/tokenManager.js';

const tokenManager = new TokenManager();

export default async function (req, _, next) {
  try {
    const { accessToken, username } = req.user; // 유저에서 토큰 정보 추출
    if (!accessToken)
      // 토큰이 없을 시 에러
      throw new CustomErr(ERR_CODES.NOT_FOUND, 'Not Found TOKEN');

    const isAdmin = tokenManager.isAdminToken(username, accessToken);
    if (!isAdmin)
      // 어드민 토큰이 아닐 시 에러
      throw new CustomErr(ERR_CODES.UNAUTHORIZED, 'Unauthorized');

    next(); // 다음 미들웨어로 전달
  } catch (err) {
    next(err);
  }
}

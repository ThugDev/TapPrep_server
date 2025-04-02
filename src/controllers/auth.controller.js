import { AuthService } from '../services/auth.service.js';
import CustomErr from '../utils/error/CustomErr.js';
import { ERR_CODES } from '../utils/error/ERR_CODES.js';

export class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  callback = async (req, res, next) => {
    try {
      // Authorization Code 취득
      const { code, state } = req.query;
      let redirectUri = null;

      // state 검증
      switch (state) {
        case 'mobile':
          redirectUri = 'tapprep1029://auth/callback';
          break;
        case 'web':
          redirectUri = 'https://tap-prep.vercel.app/auth';
          break;
        case 'dev':
          redirectUri = 'http://localhost:5173/auth';
          break;
        default:
          throw new CustomErr(ERR_CODES.BAD_REQUEST, 'Invalid state');
      }

      // 클라이언트로 `code` 전달
      res.redirect(redirectUri + `?code=${code}`);
    } catch (err) {
      next(err);
    }
  };

  oAuthLogin = async (req, res, next) => {
    try {
      // Authorization Code 취득
      const { code } = req.body;

      const user = await this.authService.oAuthLogin(code);

      return res.status(200).json({
        statusCode: 200,
        message: 'OAuth Login Success',
        token: {
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
        },
        userData: {
          username: user.username,
          nickname: user.nickname,
          profile_image: user.profile_image,
        },
        role: user.userRole,
      });
    } catch (err) {
      next(err);
    }
  };

  logout = async (req, res, next) => {
    try {
      const { username, accessToken } = req.user;
      await this.authService.logout(username, accessToken);

      return res.status(200).json({
        statusCode: 200,
        message: 'Logout Success',
      });
    } catch (err) {
      next(err);
    }
  };

  deleteUser = async (req, res, next) => {
    try {
      const { username, accessToken } = req.user;
      const result = await this.authService.deleteUser(username, accessToken);
      if (!result) {
        throw new CustomErr(ERR_CODES.INTERNAL_SERVER_ERROR, 'Error deleting user');
      }
      return res.status(200).json({
        statusCode: 200,
        message: 'Delete User Success',
      });
    } catch (err) {
      next(err);
    }
  };

  refreshToken = async (req, res, next) => {
    try {
      // Refresh Token 취득
      const { username, refreshToken } = req.body;
      if (!username || !refreshToken) {
        throw new Error('Invalid arguments');
      }

      const accessToken = await this.authService.refreshToken(username, refreshToken);

      return res.status(200).json({
        statusCode: 200,
        message: 'Refresh Access Token Success',
        accessToken,
      });
    } catch (err) {
      next(err);
    }
  };
}

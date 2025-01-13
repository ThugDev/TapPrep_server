import { AuthService } from '../services/auth.service.js';

export class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  oAuthLogin = async (req, res, next) => {
    try {
      // Authorization Code 취득
      const { code } = req.query;
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
      });
    } catch (err) {
      next(err);
    }
  };
}

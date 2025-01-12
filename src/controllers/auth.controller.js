import { AuthServices } from '../services/auth.service.js';

export class AuthController {
  constructor() {
    this.authServices = new AuthServices();
  }

  async oAuthLogin(req, res, next) {
    try {
      // Authorization Code 취득
      const { code } = req.query;

      const user = await this.authServices.oAuthLogin(code);

      return res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }
}

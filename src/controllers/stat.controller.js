import { StatService } from '../services/stat.service.js';

export class StatController {
  constructor() {
    this.statService = new StatService();
  }

  getFEStats = async (req, res, next) => {
    try {
      const { user_id: userId } = req.user;
      const stats = await this.statService.getStats(userId, 'fe');

      return res.status(200).json({
        statusCode: 200,
        message: 'Get Frontend Stats Success',
        stats,
      });
    } catch (err) {
      next(err);
    }
  };

  getBEStats = async (req, res, next) => {
    try {
      const { user_id: userId } = req.user;
      const stats = await this.statService.getStats(userId, 'be');

      return res.status(200).json({
        statusCode: 200,
        message: 'Get Backend Stats Success',
        stats,
      });
    } catch (err) {
      next(err);
    }
  };
}

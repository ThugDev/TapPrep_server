import { LevelRepository } from '../../repositories/level.repository.js';
import CustomErr from '../error/CustomErr.js';
import { ERR_CODES } from '../error/ERR_CODES.js';

export class LevelManager {
  constructor() {
    if (LevelManager.instance) {
      return LevelManager.instance;
    }
    LevelManager.instance = this;

    this.levelRepository = new LevelRepository();

    // TODO: 서버 기동 시 DB에서 레벨 테이블을 불러와서 초기화
    this.expTable = {
      1: 100,
      2: 200,
      3: 300,
    };

    this.totalExpTable = {
      0: 300,
      1: 600,
      2: 900,
      3: 1200,
      4: 1500,
      5: 1800,
    };
  }

  async gainExp(userId, difficulty) {
    try {
      // 유저 레벨, 경험치 가져오기
      const userLevel = await this.levelRepository.getLevel(userId);
      if (!userLevel) {
        throw new CustomErr(ERR_CODES.NOT_FOUND, 'User Level Column Not Found');
      }

      // 유저 레벨, 경험치
      const currentLevel = userLevel.level;
      const currentExp = userLevel.exp;

      // 얻은 경험치, 현재 경험치, 필요 경험치
      const gainedExp = this.expTable[difficulty];
      const totalExp = currentExp + gainedExp;
      const totalExpRequired = this.totalExpTable[currentLevel];

      console.log(difficulty);
      console.log(currentLevel, currentExp);
      console.log(gainedExp, totalExp, totalExpRequired);

      // 레벨 업 조건 확인
      if (totalExp >= totalExpRequired) {
        await this.levelRepository.updateLevel(
          userId,
          currentLevel + 1,
          totalExp - totalExpRequired,
        );
      } else {
        await this.levelRepository.updateLevel(userId, currentLevel, totalExp);
      }

      return true;
    } catch (err) {
      console.error(err);
      throw new CustomErr(ERR_CODES.INTERNAL_SERVER_ERROR, 'Error gaining exp');
    }
  }
}

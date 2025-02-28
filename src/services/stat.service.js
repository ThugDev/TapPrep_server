import { ProgressRepository } from '../repositories/progress.repository.js';
import { SectorRepository } from '../repositories/sector.repository.js';

export class StatService {
  constructor() {
    this.progressRepository = new ProgressRepository();
    this.sectorRepository = new SectorRepository();
  }
  async getStats(userId, type) {
    // 섹터 불러오기
    const sectors = await this.sectorRepository.getSectorList(type);

    // 프론트엔드 통계 조회 로직
    const result = await this.progressRepository.getProgress(userId);

    // 객체 배열 비교
    const statList = sectors.map(({ sector_id, sector_name }) => {
      // 해당하는 섹터의 유저 데이터를 찾아서 반환
      const statData = result.find((data) => data.sector_id === sector_id);
      return {
        sector_name,
        correct: statData ? statData.correctCount : 0,
        total: statData ? statData.totalCount : 0,
      };
    });

    return statList;
  }
}

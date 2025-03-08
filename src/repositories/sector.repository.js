import pools from '../mysql/createPool.js';
import { SQL_QUERIES } from './queries.js';
import { dbLogger } from '../utils/log/logger.js';

export class SectorRepository {
  constructor() {
    this.sectorNames = new Map();
  }

  async createSector(sector, sectorType) {
    try {
      // 여러 형태를 띈 이름을 통일
      const sectorName = sector.replace(/\s+/g, '').trim().toLowerCase();
      const sType = sectorType.replace(/\s+/g, '').trim().toLowerCase();

      // 이미 저장된 섹터이름이면 기존 저장된 번호 반환
      if (this.sectorNames.has(sectorName)) return this.sectorNames.get(sectorName);

      // 쿼리 등록
      const [rows] = await pools.PROBLEM_DB.query(SQL_QUERIES.sector.CREATE_SECTOR, [
        sectorName,
        sType,
      ]);

      const insertId = rows.insertId;

      if (!insertId) throw new Error('Failed to create sector'); // 에러 메시지 수정
      // 등록 번호 맵에 등록
      this.sectorNames.set(sectorName, insertId);

      return insertId;
    } catch (err) {
      dbLogger.error(`Error creating sector: ${err.message}`);
      throw new Error(`Error creating sector: ${err.message}`);
    }
  }

  async hasSector(sector) {
    try {
      // 여러 형태를 띈 이름을 통일
      const sectorName = sector.replace(/\s+/g, '').trim().toLowerCase();

      // 이미 저장된 섹터이름이면 기존 저장된 번호 반환
      if (this.sectorNames.has(sectorName)) return this.sectorNames.get(sectorName);

      // 쿼리에서 최신화
      const [rows] = await pools.PROBLEM_DB.query(SQL_QUERIES.sector.GET_SECTORS);

      // 읽어서 비교할 시간에 그냥 덮어씌우기
      for (const { sector_id, sector_name } of rows) {
        this.sectorNames.set(sector_name, sector_id);
      }

      // 결과 반환
      return this.sectorNames.get(sectorName) || null;
    } catch (err) {
      dbLogger.error(`Error checking sector: ${err.message}`);
      throw new Error(`Error checking sector: ${err.message}`);
    }
  }

  async getSectorList(type) {
    try {
      switch (type) {
        case 'fe':
          const [fe] = await pools.PROBLEM_DB.query(SQL_QUERIES.sector.GET_FE_SECTORS);
          return fe;
        case 'be':
          const [be] = await pools.PROBLEM_DB.query(SQL_QUERIES.sector.GET_BE_SECTORS);
          return be;
        default:
          return null;
      }
    } catch (err) {
      dbLogger.error(`Error getting sector list: ${err.message}`);
      throw new Error(`Error getting sector list: ${err.message}`);
    }
  }
}

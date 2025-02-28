import pools from '../mysql/createPool.js';
import { SQL_QUERIES } from './queries.js';

export class SectorRepository {
  constructor() {
    this.sectorNames = new Map();
  }
  async createSector(sector, sectorType) {
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

    if (!insertId) throw new Error('shit'); // 테스트용
    // 등록 번호 맵에 등록
    this.sectorNames.set(sectorName, insertId);

    return insertId;
  }

  async hasSector(sector) {
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
    return this.sectorNames.get(sectorName) | null;
  }

  async getSectorList(type) {
    switch (type) {
      case 'fe':
        const [fe] = await pools.PROBLEM_DB.query(SQL_QUERIES.sector.GET_FE_SECTORS);
        return fe;
        break;
      case 'be':
        const [be] = await pools.PROBLEM_DB.query(SQL_QUERIES.sector.GET_BE_SECTORS);
        return be;
        break;
      default:
        return null;
        break;
    }
  }
}

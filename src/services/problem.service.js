import { ProblemRepository } from '../repositories/problem.repository.js';
import { SectorRepository } from '../repositories/sector.repository.js';

export class ProblemService {
  constructor() {
    this.problemRepository = new ProblemRepository();
    this.sectorRepository = new SectorRepository();
  }

  async createProblem(bodyData) {
    const { sector, answer, ...problemData } = bodyData;
    let sectorId = null;

    // 섹터가 있는지 확인
    sectorId = await this.sectorRepository.hasSector(sector);

    // 없다면, 섹터 생성
    if (!sectorId) sectorId = await this.sectorRepository.createSector(sector);

    // 섹터에 맞는 문제 추가
    const problemId = await this.problemRepository.createProblem(sectorId, problemData);

    // 문제에 대한 답안을 등록
    await this.problemRepository.createAnswer(problemId, answer);

    return { sectorId, problemId };
  }
}

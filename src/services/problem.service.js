import { ProblemRepository } from '../repositories/problem.repository.js';
import { SectorRepository } from '../repositories/sector.repository.js';
import CustomErr from '../utils/error/CustomErr.js';
import { ERR_CODES } from '../utils/error/ERR_CODES.js';

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

  async getProblemList(sector, difficulty, page) {
    // 섹터가 있는지 조회
    const sectorId = await this.sectorRepository.hasSector(sector);
    if (!sectorId) throw new CustomErr(ERR_CODES.BAD_REQUEST, 'Incorrect sector');
    // 최대 페이지 계산
    const maxPage = await this.getProblemListPage(sectorId, difficulty);
    if (page > maxPage)
      throw new CustomErr(ERR_CODES.BAD_REQUEST, 'Exceeded maximum page views available');
    // 해당 페이지에 맞는 리스트 가져오기
    const problemList = await this.problemRepository.getProblemList(sectorId, difficulty, page);
    // 반환
    return { maxPage, problemList };
  }

  async getProblemListPage(sectorId, difficulty) {
    // 해당 조건에 맞는 문제 수 가져오기
    const problemCount = await this.problemRepository.getProblemCount(sectorId, difficulty);
    // 한 페이지당 10개의 문제로 계산해서 페이지량 추출
    const page = Math.floor((problemCount - 1) / 10) + 1;
    // 페이지 반환
    return page;
  }
}

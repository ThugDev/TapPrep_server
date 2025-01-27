import { ProblemRepository } from '../repositories/problem.repository.js';
import { SectorRepository } from '../repositories/sector.repository.js';
import CustomErr from '../utils/error/CustomErr.js';
import { ERR_CODES } from '../utils/error/ERR_CODES.js';

export class ProblemService {
  constructor() {
    this.problemRepository = new ProblemRepository();
    this.sectorRepository = new SectorRepository();
    this.typeNumber = {
      normal: 1,
      tf: 2,
      word: 3,
    };
  }

  async createProblem(bodyData) {
    const { sector, type, answer, ...problemData } = bodyData;
    let sectorId = null;

    // 섹터가 있는지 확인
    sectorId = await this.sectorRepository.hasSector(sector);

    // 없다면, 섹터 생성
    if (!sectorId) sectorId = await this.sectorRepository.createSector(sector);

    // 타입 변환
    const typeNum = this.typeNumber[type];
    if (!typeNum) throw new CustomErr(ERR_CODES.BAD_REQUEST, 'Incorrect Type');

    // 타입에 따른 답안 체크
    switch (typeNum) {
      case 1:
        if (!answer.length > 3)
          throw new CustomErr(
            ERR_CODES.BAD_REQUEST,
            'A normal question must have at least three answer options registered.',
          );
        break;
      case 2:
        if (!(answer === true || answer === false))
          throw new CustomErr(
            ERR_CODES.BAD_REQUEST,
            'A true/false question must have bool(true/false) options registered.',
          );
        break;
      case 3:
        if (typeof answer !== 'string')
          throw new CustomErr(
            ERR_CODES.BAD_REQUEST,
            'A word question must have one answer options registered.',
          );
        break;
    }

    // 섹터에 맞는 문제 추가
    const problemId = await this.problemRepository.createProblem(sectorId, typeNum, problemData);

    // 문제에 대한 답안을 등록
    await this.problemRepository.createAnswer(problemId, typeNum, answer);

    return { sectorId, problemId };
  }

  async getProblemList(sector, type, difficulty, page, limit) {
    // 섹터가 있는지 조회
    const sectorId = await this.sectorRepository.hasSector(sector);
    if (!sectorId) throw new CustomErr(ERR_CODES.BAD_REQUEST, 'Incorrect sector');

    // 타입 조회
    const typeNum = this.typeNumber[type];
    if (!typeNum) throw new CustomErr(ERR_CODES.BAD_REQUEST, 'Incorrect Type');

    // 최대 페이지 계산
    const maxPage = await this.getProblemListPage(sectorId, typeNum, difficulty, limit);
    if (page > maxPage)
      throw new CustomErr(ERR_CODES.BAD_REQUEST, 'Exceeded maximum page views available');
    // 해당 페이지에 맞는 리스트 가져오기
    const problemList = await this.problemRepository.getProblemList(
      sectorId,
      typeNum,
      difficulty,
      page,
      limit,
    );
    // 반환
    return { maxPage, problemList };
  }

  async getProblemListPage(sectorId, typeNum, difficulty, limit) {
    // 해당 조건에 맞는 문제 수 가져오기
    const problemCount = await this.problemRepository.getProblemCount(
      sectorId,
      typeNum,
      difficulty,
    );
    // 한 페이지당 리미트 계산해서 페이지량 추출
    const page = Math.floor((problemCount - 1) / limit) + 1;
    // 페이지 반환
    return page;
  }

  async getProblem(problemId) {
    // 해당 아이디에 대한 문제 내용 불러오기
    let problemData = await this.problemRepository.getProblem(problemId);

    if (problemData.length === 0)
      throw new CustomErr(ERR_CODES.NOT_FOUND, `Not Found problem_id - ${problemId}`);

    // 옵션 재설정
    problemData = problemData[0];

    const options = problemData.options;
    if (!options) throw new CustomErr(ERR_CODES.INTERNAL_SERVER_ERROR, 'Server Error');

    // 문자열 스플릿
    const optionArr = options.split(',');
    const optionObj = [];
    for (let data of optionArr) {
      const [option_id, option_text] = data.split(':');
      optionObj.push({ [option_id]: option_text });
    }
    // 객체 배열로 치환
    problemData.options = optionObj;

    // 문제 반환
    return problemData;
  }

  async getProblemAnswer(problemId, optionId) {
    // 문제에 대한 옵션 가져오기
    const answers = await this.problemRepository.getAnswer(problemId);
    // 문제에 대한 옵션 아이디를 제시했는지 체크
    let isCorrectOptionId = false;
    // 정답만 가져오기
    const correctAnswer = answers.map((answer) => {
      if (answer.option_id === optionId) isCorrectOptionId = true;
      if (answer.isCorrect) return answer;
    })[0];

    // 문제에 대한 옵션 중 해당하는 옵션이 없을 경우 에러처리
    if (!isCorrectOptionId)
      throw new CustomErr(ERR_CODES.BAD_REQUEST, 'Incorrect option ID for the problem');

    // 문제 해설 가져오기
    const solution = await this.problemRepository.getProblemSolution(problemId);

    // 문제 정답 삽입
    solution.answer = correctAnswer.option_text;

    // 제출 답안 정답인지 여부 삽입
    solution.isCorrect = correctAnswer.option_id === optionId;

    return solution;
  }
}

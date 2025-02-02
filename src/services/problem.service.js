import { ProblemRepository } from '../repositories/problem.repository.js';
import { ProgressRepository } from '../repositories/progress.repository.js';
import { SectorRepository } from '../repositories/sector.repository.js';
import CustomErr from '../utils/error/CustomErr.js';
import { ERR_CODES } from '../utils/error/ERR_CODES.js';

export class ProblemService {
  constructor() {
    this.problemRepository = new ProblemRepository();
    this.sectorRepository = new SectorRepository();
    this.progressRepository = new ProgressRepository();
    this.typeNumber = {
      normal: 1,
      tf: 2,
      word: 3,
    };
    this.reverseTypeNumber = Object.fromEntries(
      Object.entries(this.typeNumber).map(([key, value]) => [value, key]),
    );
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

  async getProblemList(userId, sector, difficulty, page, limit) {
    // 섹터가 있는지 조회
    const sectorId = await this.sectorRepository.hasSector(sector);

    if (!sectorId) throw new CustomErr(ERR_CODES.BAD_REQUEST, 'Incorrect sector');

    // 최대 페이지 계산
    const maxPage = await this.getProblemListPage(sectorId, difficulty, limit);
    if (maxPage === 0) throw new CustomErr(ERR_CODES.NOT_FOUND, 'Empty database');
    if (page > maxPage)
      throw new CustomErr(ERR_CODES.BAD_REQUEST, 'Exceeded maximum page views available');

    const nextPage = maxPage >= page + 1 ? page + 1 : false;
    // 해당 페이지에 맞는 리스트 가져오기
    let problemList = await this.problemRepository.getProblemList(
      userId,
      sectorId,
      difficulty,
      page,
      limit,
    );

    // 타입 변환
    problemList = problemList.map((problem) => {
      // 푼 문제인지 판단 후 적용 및 삭제
      problem.isSolved = problem.progress_id ? true : false;
      delete problem.progress_id;
      // 타입 이름화
      problem.type = this.reverseTypeNumber[problem.type];
      return problem;
    });

    // 반환
    return { nextPage, problemList };
  }

  async getProblemListPage(sectorId, difficulty, limit) {
    // 해당 조건에 맞는 문제 수 가져오기
    const problemCount = await this.problemRepository.getProblemCount(sectorId, difficulty);
    // 한 페이지당 리미트 계산해서 페이지량 추출
    const page = Math.floor((problemCount - 1) / limit) + 1;
    // 페이지 반환
    return page;
  }

  async getProblem(userId, problemId) {
    // 해당 아이디에 대한 문제 내용 불러오기
    let problemData = await this.problemRepository.getProblem(problemId);

    if (problemData.length === 0)
      throw new CustomErr(ERR_CODES.NOT_FOUND, `Not Found problem_id - ${problemId}`);

    // 옵션 재설정
    problemData = problemData[0];

    // 타입에 따른 옵션 부여
    if (problemData.type === 1) {
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
    } else {
      delete problemData.options;
    }
    // 이미 푼 문제이면 전에 푼 결과 반환
    const progressData = await this.progressRepository.getProblemProgress(userId, problemId);

    let isSolved = false;
    if (progressData) {
      isSolved = true;
      // 문제 해설 가져오기
      const solutionData = await this.problemRepository.getProblemSolution(problemId);

      // TODO: 답에 따른 형변환 함수 만들기
      switch (problemData.type) {
        case 1:
          progressData.optionData = Number(progressData.optionData);
          break;
        case 2:
          progressData.optionData = progressData.optionData === 'true';
      }

      console.log(`ssibal:${progressData.isCorrect}`);
      // 문제 해설과 진행 데이터를 문제 데이터에 병합
      Object.assign(problemData, {
        explanation: solutionData.explanation,
        reference: solutionData.reference,
        answer: progressData.optionData,
        isCorrect: progressData.isCorrect === 1,
      });

      return { isSolved, problemData };
    }

    // 문제 반환
    return { isSolved, problemData };
  }

  async getProblemAnswer(userId, problemId, option) {
    // 이미 푼 문제인지 확인
    const isSolved = await this.progressRepository.getProblemProgress(userId, problemId);
    console.log(`isSolved : ${isSolved}, userId: ${userId}`);
    if (isSolved) throw new CustomErr(ERR_CODES.BAD_REQUEST, 'Already Solved Problem, Bro.');

    // 문제에 대한 옵션 가져오기
    const answers = await this.problemRepository.getAnswer(problemId);

    if (answers.length === 0)
      throw new CustomErr(ERR_CODES.NOT_FOUND, `Not Found Answers about ${problemId} `);

    // 문제 타입 가져오기
    const typeNum = answers[0].type;

    // 문제에 대한 옵션 아이디를 제시했는지 체크
    let isCorrectOptionValue = false;
    let isCorrect = null;
    let correctAnswer = null;
    // 타입 별 스위칭
    switch (typeNum) {
      case 1:
        // 정답만 가져오기
        const result = answers.map((answer) => {
          if (answer.option_id === option) isCorrectOptionValue = true;
          if (answer.isCorrect) return answer;
        })[0];

        // 정답 기입
        correctAnswer = result.option_id;

        // 정답이 맞는지 여부 확인
        isCorrect = correctAnswer === option;
        break;
      case 2:
        // OX, 단답형 문제는 answers 요소가 한 개만 있음
        if (typeof option === 'boolean') {
          isCorrectOptionValue = true;
        }

        // 정답 기입
        correctAnswer = answers[0].option_text === '1';

        // 정답이 맞는지 여부 확인
        isCorrect = correctAnswer === option;
        break;
      case 3:
        // OX, 단답형 문제는 answers 요소가 한 개만 있음
        if (typeof option === 'string') isCorrectOptionValue = true;

        // 정답 기입
        correctAnswer = answers[0].option_text;

        // 정답이 맞는지 여부 확인
        isCorrect = correctAnswer === option;
        break;
      case 4:
        if (typeof option === 'string') isCorrectOptionValue = true;

        break;
    }

    // 문제에 대한 옵션 중 해당하는 옵션이 없을 경우 에러처리
    if (!isCorrectOptionValue)
      throw new CustomErr(ERR_CODES.BAD_REQUEST, 'Incorrect option value for the problem');

    // 문제 해설 가져오기
    const solution = await this.problemRepository.getProblemSolution(problemId);

    // 문제 정답 삽입
    solution.answer = correctAnswer;

    // 제출 답안 정답인지 여부 삽입
    solution.isCorrect = isCorrect;

    // progress 추가
    this.progressRepository.createProgress(userId, problemId, typeNum, isCorrect, String(option));

    return solution;
  }
}

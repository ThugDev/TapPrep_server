export const ERR_CODES = {
  BAD_REQUEST: 400, // 잘못된 요청
  UNAUTHORIZED: 401, // 인증 실패
  FORBIDDEN: 403, // 접근 금지
  NOT_FOUND: 404, // 리소스를 찾을 수 없음
  METHOD_NOT_ALLOWED: 405, // 허용되지 않은 HTTP 메서드
  CONFLICT: 409, // 중복

  INTERNAL_SERVER_ERROR: 500, // 서버 내부 오류
};

export default class CustomErr extends Error {
  constructor(statusCode, message) {
    super(message); // Error 클래스의 message 속성 설정
    this.statusCode = statusCode; // 추가적인 statusCode 속성 설정
  }
}

export class BadRequestError extends CustomErr {
  constructor(message = 'Bad Request') {
    super(400, message);
  }
}

export class UnauthorizedError extends CustomErr {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}

export class NotFoundError extends CustomErr {
  constructor(message = 'Not Found') {
    super(404, message);
  }
}

export class InternalServerError extends CustomErr {
  constructor(message = 'Internal Server Error') {
    super(500, message);
  }
}

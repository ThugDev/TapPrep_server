# TapPrep_server
----
![image](https://github.com/user-attachments/assets/40be6123-b983-4cb9-8054-23d0353357a8)

## 소개
TapPrep_server는 TapPrep 애플리케이션의 백엔드 서버입니다. <br>
[TapPrep_server 노션 바로가기](https://flawless-may-c23.notion.site/Interview-Web-App-177cadc8968e80ab8ce8d5fb6c04f4a6)


## 주요 기능

- OAuth 로그인: GitHub OAuth를 통해 사용자 인증을 처리합니다.
- 프로필 관리: 사용자 프로필 조회, 업데이트, 삭제 기능을 제공합니다.
- 문제 관리: 문제 생성, 조회, 업데이트, 삭제 기능을 제공합니다.
- 통계 조회: 사용자별 프론트엔드 및 백엔드 통계 조회 기능을 제공합니다.
- 레벨 관리: 사용자 레벨 및 경험치 관리 기능을 제공합니다.
- 토큰 관리: JWT 토큰 생성, 검증, 만료 및 리프레시 토큰 관리 기능을 제공합니다.
  
## 주요 API

### 인증 (Auth)
- GET /auth/git/callback: GitHub OAuth 콜백 처리
- POST /auth/git/token: GitHub OAuth 로그인 처리
- POST /auth/token/refresh: 리프레시 토큰을 사용하여 액세스 토큰 갱신
- POST /auth/logout: 로그아웃 처리
- DELETE /auth/delete: 사용자 계정 삭제

### 프로필 (Profile)
- GET /profile: 사용자 프로필 조회
- PATCH /profile: 사용자 프로필 업데이트
- DELETE /profile: 사용자 프로필 삭제

### 문제 (Problem)
- POST /problem: 문제 생성 (관리자 전용)
- GET /problem/list: 문제 리스트 조회
- GET /problem/:problemId: 문제 상세 조회
- PATCH /problem: 문제 업데이트 (관리자 전용)
- DELETE /problem: 문제 삭제 (관리자 전용)
- POST /problem/answer: 문제 답안 제출 및 정답 여부 확인

### 통계 (Stat)
- GET /stat/fe: 프론트엔드 통계 조회
- GET /stat/be: 백엔드 통계 조회
---

## ERD
![image](https://github.com/user-attachments/assets/43614c29-619e-4fb3-8453-e15d22868656)

## 기술 스택
<img src="https://shields.io/badge/JavaScript-F7DF1E?logo=JavaScript&logoColor=000&style=flat-square" style="height : 25px; margin-left : 10px; margin-right : 10px;"/>&nbsp;
<img src="https://shields.io/badge/Node.js-339933?logo=Node.js&logoColor=fff&style=flat-square" style="height : 25px; margin-left : 10px; margin-right : 10px;"/>&nbsp;
<img src="https://shields.io/badge/Express-000000?logo=Express&logoColor=fff&style=flat-square" style="height : 25px; margin-left : 10px; margin-right : 10px;"/>&nbsp;

## 인증
<img src="https://shields.io/badge/JWT-000000?logo=JSONWebTokens&logoColor=fff&style=flat-square" style="height : 25px; margin-left : 10px; margin-right : 10px;"/>&nbsp;
<img src="https://shields.io/badge/BCRYPT-3C873A?logo=OAuth&logoColor=fff&style=flat-square" style="height : 25px; margin-left : 10px; margin-right : 10px;"/>&nbsp;

## DevOps
<img src="https://shields.io/badge/Docker-2496ED?logo=Docker&logoColor=fff&style=flat-square" style="height : 25px; margin-left : 10px; margin-right : 10px;"/>&nbsp;

## 배포 환경
<img src="https://shields.io/badge/GCP-4285F4?logo=GoogleCloud&logoColor=fff&style=flat-square" style="height : 25px; margin-left : 10px; margin-right : 10px;"/>&nbsp;

## 프로젝트 구조
```
📦src
 ┣ 📂config
 ┃ ┗ 📜config.js
 ┣ 📂constants
 ┃ ┣ 📜env.js
 ┃ ┗ 📜url.js
 ┣ 📂controllers
 ┃ ┣ 📜auth.controller.js
 ┃ ┣ 📜problem.controller.js
 ┃ ┣ 📜profile.controller.js
 ┃ ┗ 📜stat.controller.js
 ┣ 📂init
 ┃ ┗ 📜initServer.js
 ┣ 📂middlewares
 ┃ ┣ 📜admin.middleware.js
 ┃ ┣ 📜auth.middleware.js
 ┃ ┣ 📜error-handling.middleware.js
 ┃ ┗ 📜params.middleware.js
 ┣ 📂mysql
 ┃ ┣ 📂migration
 ┃ ┃ ┣ 📜createSchemas.js
 ┃ ┃ ┗ 📜testDataBase.js
 ┃ ┣ 📂sql
 ┃ ┃ ┣ 📜tap_problem_db.sql
 ┃ ┃ ┣ 📜tap_progress_db.sql
 ┃ ┃ ┗ 📜tap_user_db.sql
 ┃ ┗ 📜createPool.js
 ┣ 📂repositories
 ┃ ┣ 📜auth.repository.js
 ┃ ┣ 📜level.repository.js
 ┃ ┣ 📜problem.repository.js
 ┃ ┣ 📜profile.repository.js
 ┃ ┣ 📜progress.repository.js
 ┃ ┣ 📜queries.js
 ┃ ┗ 📜sector.repository.js
 ┣ 📂router
 ┃ ┣ 📜auth.route.js
 ┃ ┣ 📜index.route.js
 ┃ ┣ 📜problem.route.js
 ┃ ┣ 📜profile.route.js
 ┃ ┗ 📜stat.route.js
 ┣ 📂services
 ┃ ┣ 📜auth.service.js
 ┃ ┣ 📜problem.service.js
 ┃ ┣ 📜profile.service.js
 ┃ ┗ 📜stat.service.js
 ┣ 📂utils
 ┃ ┣ 📂auth
 ┃ ┃ ┣ 📜checkHashed.js
 ┃ ┃ ┗ 📜hashed.js
 ┃ ┣ 📂error
 ┃ ┃ ┣ 📜CustomErr.js
 ┃ ┃ ┗ 📜ERR_CODES.js
 ┃ ┣ 📂file
 ┃ ┃ ┗ 📜fileExists.js
 ┃ ┣ 📂formatter
 ┃ ┃ ┣ 📜dateFormatter.js
 ┃ ┃ ┗ 📜timeFormatter.js
 ┃ ┣ 📂log
 ┃ ┃ ┗ 📜logger.js
 ┃ ┣ 📂manager
 ┃ ┃ ┣ 📜levelManager.js
 ┃ ┃ ┗ 📜tokenManager.js
 ┃ ┗ 📂redis
 ┃ ┃ ┗ 📜redisClient.js
 ┗ 📜server.js
 ```

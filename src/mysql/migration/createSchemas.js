import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pools from '../createPool.js';

// 디렉터리 정의
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SQL 파일 실행 함수
const executeSqlFile = async (pool, filePath) => {
  const sql = fs.readFileSync(filePath, 'utf8');
  // SQL 쪼개기
  const queries = sql
    .split(';')
    .map((query) => query.trim())
    .filter((query) => query.length > 0);

  for (const query of queries) {
    await pool.query(query);
  }
};

export const createSchemas = async () => {
  const sqlDir = path.join(__dirname, '../sql');
  try {
    // sol_DB SQL 파일 실행
    await executeSqlFile(pools.USER_DB, path.join(sqlDir, 'tap_user_db.sql'));

    console.log('데이터베이스 테이블이 성공적으로 생성되었습니다.');
  } catch (error) {
    console.error('데이터베이스 테이블 마이그레이션 중 오류가 발생했습니다:', error.message);
    process.exit(1);
  }
};

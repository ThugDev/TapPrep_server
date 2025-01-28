export const SQL_QUERIES = {
  auth: {
    FIND_USER_BY_ID: `SELECT username, nickname, profile_image FROM users WHERE username = ?`,
    CREATE_USER: `INSERT INTO users (username, nickname, profile_image, email) VALUES (?, ?, ?, ?)`,
    DELETE_USER: `DELETE FROM users WHERE username = ?;`,
  },
  profile: {
    GET_PROFILE: `SELECT username, nickname, profile_image,level FROM users WHERE username = ?`,
    UPDATE_PROFILE: `UPDATE users SET nickname = ?, profile_image = ? WHERE username = ?`,
    UPDATE_PROFILE_NICKNAME: `UPDATE users SET nickname = ? WHERE username = ?`,
    UPDATE_PROFILE_IMAGE: `UPDATE users SET profile_image = ? WHERE username = ?`,
  },
  sector: {
    CREATE_SECTOR: `INSERT INTO sectors (sector_name) VALUES (?)`,
    GET_SECTORS: `SELECT sector_id, sector_name FROM sectors`,
  },
  problem: {
    CREATE_PROBLEM: `INSERT INTO problems (sector_id, type, difficulty, title, description, hint, explanation, reference) VALUES ?`,
    FIND_PROBLEM_LIST: `SELECT problem_id, title, type FROM problems WHERE sector_id = ? AND difficulty = ? LIMIT ? OFFSET ?`,
    FIND_PROBLEM: `SELECT p.problem_id, p.type, p.title, p.description, p.hint, GROUP_CONCAT(CONCAT(o.option_id, ':', o.option_text) ORDER BY RAND()) AS options
                   FROM problems p
                   JOIN options o ON p.problem_id = o.problem_id
                   WHERE p.problem_id = ?
                   GROUP BY p.problem_id`,
    GET_PROBLEM_COUNT: `SELECT COUNT(*) AS total_count FROM problems WHERE sector_id = ? AND difficulty = ?`,
    GET_ANSWER: `SELECT option_id, type, option_text, isCorrect FROM options WHERE problem_id = ?`,
    GET_SOLUTION: `SELECT problem_id, title, explanation, reference FROM problems WHERE problem_id = ?`,
  },
  option: {
    CREATE_OPTION: `INSERT INTO options (problem_id, type, option_text, isCorrect) VALUES (?,?,?,?)`,
  },
};

export const SQL_QUERIES = {
  auth: {
    FIND_USER_BY_ID: `SELECT * FROM users WHERE username = ?`,
    CREATE_USER: `INSERT INTO users (username, nickname, profile_image, email) VALUES(?, ?, ?, ?)`,
    UPDATE_USER_NICKNAME: `UPDATE users SET nickname = ? WHERE username = ?`,
    UPDATE_USER_PROFILE_IMAGE: `UPDATE users SET profile_image = ? WHERE username = ?`,
    DELETE_USER: `DELETE FROM users WHERE username = ?;`,
  },
};

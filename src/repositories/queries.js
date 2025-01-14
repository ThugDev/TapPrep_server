export const SQL_QUERIES = {
  auth: {
    FIND_USER_BY_ID: `SELECT username, nickname, profile_image FROM users WHERE username = ?`,
    CREATE_USER: `INSERT INTO users (username, nickname, profile_image, email)`,
    DELETE_USER: `DELETE FROM users WHERE username = ?;`,
  },
};

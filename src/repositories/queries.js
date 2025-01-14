export const SQL_QUERIES = {
  auth: {
    FIND_USER_BY_ID: `SELECT username, nickname, profile_image FROM users WHERE username = ?`,
    CREATE_USER: `INSERT INTO users (username, nickname, profile_image, email)`,
    DELETE_USER: `DELETE FROM users WHERE username = ?;`,
  },
  profile: {
    GET_PROFILE: `SELECT username, nickname, profile_image,level FROM users WHERE username = ?`,
    UPDATE_PROFILE: `UPDATE users SET nickname = ?, profile_image = ? WHERE username = ?`,
    UPDATE_PROFILE_NICKNAME: `UPDATE users SET nickname = ? WHERE username = ?`,
    UPDATE_PROFILE_IMAGE: `UPDATE users SET profile_image = ? WHERE username = ?`,
  },
};

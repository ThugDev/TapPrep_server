import { config } from "../../config/config.js";
import CustomErr from "../error/CustomErr.js";
import { ERR_CODES } from "../error/ERR_CODES.js";
import jwt from "jsonwebtoken";

export const decodeToken = (token) => {
  try {
    const secretKey = config.auth.secret_key;

    const payload = jwt.verify(token, secretKey);
    return payload;
  } catch (err) {
    throw new CustomErr(ERR_CODES.UNAUTHORIZED, err.message);
  }
};

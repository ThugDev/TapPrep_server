import bcrypt from "bcrypt";

export const checkHashed = async (password, hashed) => {
  return await bcrypt.compare(password, hashed);
};

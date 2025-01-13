import { access } from 'fs/promises';

export const fileExists = async (path) => {
  try {
    await access(path);
    return true;
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false;
    } else {
      throw err;
    }
  }
};

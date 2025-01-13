import { dbLogger } from '../../utils/log/logger.js';

const testDbConnection = async (pool) => {
  try {
    await pool.query('SELECT 1 + 1 AS solution');
    const date = new Date();
    dbLogger.info('Database connected successfully');
  } catch (err) {
    dbLogger.error('Database connect failed');
    process.exit(1);
  }
};

export const testAllConnections = async (pools) => {
  await testDbConnection(pools.USER_DB);
};

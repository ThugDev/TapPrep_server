import pools from '../mysql/createPool.js';
import { createSchemas } from '../mysql/migration/createSchemas.js';
import { testAllConnections } from '../mysql/migration/testDataBase.js';
import { dbLogger, logger } from '../utils/log/logger.js';

export const initServer = async () => {
  logger.info('Server is initializing...');
  // 서버 초기화 작업
  try {
    await createSchemas().then(() => {
      dbLogger.info('Database schema created successfully');
    });
    await testAllConnections(pools).then(() => {
      logger.info('Database connection test completed successfully');
    });
    logger.info('Server initialization is complete');
  } catch (err) {
    logger.error('Server initialization failed:', err);
    process.exit(1);
  }
};

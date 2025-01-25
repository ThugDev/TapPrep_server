import Redis from 'ioredis';
import { config } from '../../config/config.js';
import { redisLogger } from '../log/logger.js';

const redisClient = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
});

const originSet = redisClient.set;
redisClient.set = async function (key, value) {
  redisLogger.info(`REDIS SET - ${key}`);
  return originSet.call(this, key, value);
};

const originGet = redisClient.get;
redisClient.get = async function (key) {
  redisLogger.info(`REDIS GET - ${key}`);
  return originGet.call(this, key);
};

redisClient.on('connect', () => console.log('Connected to Redis'));
redisClient.on('error', (err) => console.log('Redis Client Error', err));

export default redisClient;

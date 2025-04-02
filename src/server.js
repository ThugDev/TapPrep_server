import os from 'os';
import cluster from 'cluster';
import { httpServer } from './httpServer.js';

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running And Worker Count: ${numCPUs}`);

  // 워커 프로세스 포크
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died - code: ${code}, signal: ${signal}`);
    console.log('Starting a new worker');
    cluster.fork();
  });
} else {
  await httpServer();
  console.log(`Worker ${process.pid} started`);
}

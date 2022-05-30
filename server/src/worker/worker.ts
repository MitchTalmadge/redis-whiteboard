import { parentPort, workerData } from 'node:worker_threads';
import { WorkerMessage } from "./model/worker/worker-message";

(() => {
  const workerId = workerData.workerId;
  console.log(`[W${workerId}] Started`);

  parentPort!.on('message', (message: WorkerMessage) => {
    console.log(`[W${workerId}] Received message:`, message);

    switch(message.type) {
      case 'socket':
        
      break;
    }
  });
})();
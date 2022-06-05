import { parentPort, workerData } from 'node:worker_threads';
import { ClientActionController } from "./controllers/client-action";
import { WorkerMessage } from "./model/worker/worker-message";

(() => {
  const workerId = workerData.workerId;
  console.log(`[W${workerId}] Started`);

  parentPort!.on('message', (message: WorkerMessage) => {
    console.log(`[W${workerId}] Received message:`, message);

    switch(message.type) {
      case 'client-action':
        ClientActionController.getInstance().onClientAction(message.message);
      break;
    }
  });
})();
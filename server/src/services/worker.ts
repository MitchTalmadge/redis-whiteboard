import path from "node:path";
import { Worker } from 'node:worker_threads';
import { ClientSocketMessage } from "../../../common/src/model/socket/message";
import { ClientActionWorkerMessage } from "../worker/model/worker/worker-message";

export class WorkerService {
  private static instance: WorkerService;
  private workers: Worker[];
  
  // TODO: Configurable
  public static numWorkers = 4;

  private constructor() {
    this.workers = [];
  }

  public static getInstance() {
    if (!WorkerService.instance) {
      WorkerService.instance = new WorkerService();
    }
    return WorkerService.instance;
  }

  public startWorkers() {
    for (let i = 0; i < WorkerService.numWorkers; i++) {
      const worker = new Worker(path.join(__dirname, '../worker/worker.js'), { workerData: { workerId: i } });
      this.workers.push(worker);
      worker.on('error', (err) => {
        console.error("[M] Worker " + i + " failed:", err);
      });
      worker.on('exit', (code) => {
        console.log("[M] Worker " + i + " exited with code " + code);
      });
    }
  }

  public forwardSocketMessage(workerId: number, socketId: string, message: ClientSocketMessage) {
    const workerMessage: ClientActionWorkerMessage = {
      type: "client-action",
      socketId: socketId,
      message
    };
    this.workers[workerId].postMessage(workerMessage);
  }
}
// import { HttpController } from "./controllers/http";
// import { RedisController } from "./controllers/redis";
// import { SocketController } from "./controllers/socket";

import path from 'node:path';
import { Worker } from 'node:worker_threads';
import { HttpController } from "./controllers/http";
import { RedisController } from "./controllers/redis";
import { SocketController } from "./controllers/socket";
import { SocketService } from "./services/socket";
import { WorkerService } from "./services/worker";

// (async () => {
//   try {
//     const port = +process.argv[2];
//     await HttpController.getInstance().init(port);
//     await RedisController.getInstance().init();
//     await SocketController.getInstance().init();
//   } catch (err) {
//     console.error("Startup Failure:", err);
//     process.exit(1);
//   }
// })();

(async () => {
  try {
    const port = +process.argv[2];
    WorkerService.getInstance().startWorkers();
    await HttpController.getInstance().init(port);
    await RedisController.getInstance().init();
    await SocketController.getInstance().init();
  } catch (err) {
    console.error("Startup Failure:", err);
    process.exit(1);
  }
})();
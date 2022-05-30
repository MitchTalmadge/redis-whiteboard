import { HttpController } from "./controllers/http";
import { RedisController } from "./controllers/redis";
import { SocketController } from "./controllers/socket";
import { WorkerService } from "./services/worker";

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
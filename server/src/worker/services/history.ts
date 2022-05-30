import { HistoryItem } from "../../../../common/src/model/history/history-item";
import { RedisController } from "../../controllers/redis";

export class HistoryService {
  private static instance: HistoryService;

  private constructor() {}

  public static getInstance() {
    if (!HistoryService.instance) {
      HistoryService.instance = new HistoryService();
    }
    return HistoryService.instance;
  }

  private getRoomHistoryKey(room: string) {
    return `room:${room}:history`;
  }

  public async initRoom(room: string) {
    await RedisController.getInstance().setJson(
      this.getRoomHistoryKey(room),
      "$",
      []
    );
  }

  public async teardownRoom(room: string) {
    await RedisController.getInstance().delJson(this.getRoomHistoryKey(room));
  }

  public async append(room: string, item: HistoryItem) {
    const redisController = RedisController.getInstance();
    redisController.appendJson(this.getRoomHistoryKey(room), "$", item);
  }
}

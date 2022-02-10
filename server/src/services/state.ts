import { RedisController } from "../controllers/redis";

export class StateService {
  private static instance: StateService;

  private constructor() {}

  public static getInstance() {
    if (!StateService.instance) {
      StateService.instance = new StateService();
    }
    return StateService.instance;
  }

  private getRoomStateKey(room: string) {
    return `room:${room}:state`;
  }

  public async initRoom(room: string) {
    await RedisController.getInstance().setJson(
      this.getRoomStateKey(room),
      "$",
      {}
    );
  }

  public async teardownRoom(room: string) {
    await RedisController.getInstance().delJson(this.getRoomStateKey(room));
  }
}

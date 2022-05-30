import { RedisController } from "../controllers/redis";
import { Action } from "../../../../common/src/model/action/action";
import { PathStateItem } from "../../../../common/src/model/state/item/path";

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
      {
        items: [],
      }
    );
  }

  public async teardownRoom(room: string) {
    await RedisController.getInstance().delJson(this.getRoomStateKey(room));
  }

  public async applyAction(room: string, action: Action) {
    switch (action.type) {
      case "path-add": {
        const pathItem: PathStateItem = {
          itemId: action.itemId,
          type: "path",
          data: {
            segments: action.segments,
            closed: action.closed,
            strokeCap: action.strokeCap,
            strokeColor: action.strokeColor,
            strokeWidth: action.strokeWidth,
          },
        };
        await RedisController.getInstance().appendJson(
          this.getRoomStateKey(room),
          "$.items",
          pathItem
        );
      }
    }
  }
}

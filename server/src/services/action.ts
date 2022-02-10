import { PathAddAction } from "../../../common/src/model/action/path-add";
import { ClientSocketMessage } from "../../../common/src/model/socket/message";
import { nanoid } from "nanoid";
import { SocketController } from "../controllers/socket";
import { SocketSource } from "../model/socket/socket-source";
import { StateService } from "./state";

export class ActionService {
  private static instance: ActionService;
  private inProgressPathAdds: {
    [socketId: string]: PathAddAction;
  } = {};

  private constructor() {}

  public static getInstance() {
    if (!ActionService.instance) {
      ActionService.instance = new ActionService();
    }
    return ActionService.instance;
  }

  public async processSocketMessage(
    source: SocketSource,
    message: ClientSocketMessage
  ): Promise<void> {
    switch (message.event) {
      case "path-start": {
        this.inProgressPathAdds[source.socketId] = {
          type: "path-add",
          itemId: nanoid(),
          segments: [{ x: message.data.x, y: message.data.y }],
          closed: message.data.closed,
          strokeCap: message.data.strokeCap,
          strokeColor: message.data.strokeColor,
          strokeWidth: message.data.strokeWidth,
        };
        SocketController.getInstance().sendMessageToRoom(source.room, {
          event: "path-start",
          data: {
            itemId: this.inProgressPathAdds[source.socketId].itemId,
            ...message.data,
          },
        });
        break;
      }
      case "path-append": {
        this.inProgressPathAdds[source.socketId].segments.push({
          x: message.data.x,
          y: message.data.y,
        });
        SocketController.getInstance().sendMessageToRoom(source.room, {
          event: "path-append",
          data: {
            itemId: this.inProgressPathAdds[source.socketId].itemId,
            ...message.data,
          },
        });
        break;
      }
      case "path-end": {
        this.inProgressPathAdds[source.socketId].segments.push({
          x: message.data.x,
          y: message.data.y,
        });

        const action = this.inProgressPathAdds[source.socketId];
        delete this.inProgressPathAdds[source.socketId];

        await StateService.getInstance().applyAction(source.room, action);

        SocketController.getInstance().sendMessageToRoom(source.room, {
          event: "path-end",
          data: {
            itemId: action.itemId,
            ...message.data,
          },
        });
      }
    }
  }
}

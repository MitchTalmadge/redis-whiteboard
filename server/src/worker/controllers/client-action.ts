import { ClientSocketMessage } from "../../../../../../common/src/model/socket/message";

export class ClientActionController {
  private static instance: ClientActionController;

  private constructor() {}

  public static getInstance(): ClientActionController {
    if (!ClientActionController.instance) {
      ClientActionController.instance = new ClientActionController();
    }
    return ClientActionController.instance;
  }

  public onClientAction(message: ClientSocketMessage) {
    console.log("Received client action:", message);
  }
}
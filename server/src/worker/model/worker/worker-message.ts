import { ClientSocketMessage } from "../../../../../common/src/model/socket/message";

export interface ClientActionWorkerMessage {
  type: 'client-action',
  socketId: string,
  message: ClientSocketMessage
}

export type WorkerMessage = ClientActionWorkerMessage;
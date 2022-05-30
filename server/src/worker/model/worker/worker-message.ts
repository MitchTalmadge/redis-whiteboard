import { ClientSocketMessage } from "../../../../../common/src/model/socket/message";

export interface WorkerSocketMessage {
  type: 'socket',
  socketId: string,
  message: ClientSocketMessage
}

export type WorkerMessage = WorkerSocketMessage;
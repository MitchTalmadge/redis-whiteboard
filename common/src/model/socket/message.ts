import { PathAppendClientMessage } from "./client/path-append";
import { PathAppendServerMessage } from "./server/path-append";
import { PathEndClientMessage } from "./client/path-end";
import { PathEndServerMessage } from "./server/path-end";
import { PathStartClientMessage } from "./client/path-start";
import { PathStartServerMessage } from "./server/path-start";

export interface AbstractSocketMessage {
  event: string;
  data: any;
}

export type ClientSocketMessage =
  | PathStartClientMessage
  | PathAppendClientMessage
  | PathEndClientMessage;

export type ServerSocketMessage =
  | PathStartServerMessage
  | PathAppendServerMessage
  | PathEndServerMessage;

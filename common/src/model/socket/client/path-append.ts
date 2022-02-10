import { AbstractSocketMessage } from "../message";

export interface PathAppendClientMessage extends AbstractSocketMessage {
  event: "path-append";
  data: {
    x: number;
    y: number;
  };
}

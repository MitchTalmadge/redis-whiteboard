import { AbstractSocketMessage } from "../message";

export interface PathAppendServerMessage extends AbstractSocketMessage {
  event: "path-append";
  data: {
    itemId: string;
    x: number;
    y: number;
  };
}

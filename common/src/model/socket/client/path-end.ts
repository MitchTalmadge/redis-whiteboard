import { AbstractSocketMessage } from "../message";

export interface PathEndClientMessage extends AbstractSocketMessage {
  event: "path-end";
  data: {
    x: number;
    y: number;
  };
}

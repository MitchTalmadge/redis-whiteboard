import { AbstractSocketMessage } from "../message";

export interface PathEndServerMessage extends AbstractSocketMessage {
  event: "path-end";
  data: {
    itemId: string;
    x: number;
    y: number;
  };
}

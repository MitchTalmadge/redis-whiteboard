import { AbstractSocketMessage } from "../message";

export interface PathStartClientMessage extends AbstractSocketMessage {
  event: "path-start";
  data: {
    x: number;
    y: number;
    closed: boolean;
    strokeCap: string;
    strokeColor: string;
    strokeWidth: number;
  };
}

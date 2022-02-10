import { AbstractSocketMessage } from "../message";

export interface PathStartServerMessage extends AbstractSocketMessage {
  event: "path-start";
  data: {
    itemId: string;
    x: number;
    y: number;
    closed: boolean;
    strokeCap: string;
    strokeColor: [number, number, number];
    strokeWidth: number;
  };
}

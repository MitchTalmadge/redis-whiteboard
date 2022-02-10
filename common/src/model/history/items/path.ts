import { AbstractHistoryItem } from "../history-item";

export interface PathHistoryItem extends AbstractHistoryItem {
  type: "path";
  action: "create" | "update" | "delete";
  itemId: number;
  segments: { x: number; y: number }[];

  closed: boolean;
  strokeCap: string;
  strokeColor: string;
  strokeWidth: number;
}

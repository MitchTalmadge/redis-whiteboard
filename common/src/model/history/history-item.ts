import { PathHistoryItem } from "./items/path";

export interface AbstractHistoryItem {
  id: number;
  timestamp: number;
  type: string;
  action: string;
}

export type HistoryItem = PathHistoryItem;

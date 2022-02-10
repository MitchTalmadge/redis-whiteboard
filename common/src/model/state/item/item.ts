import { PathStateItem } from "./path";

export interface AbstractStateItem {
  itemId: string;
  type: string;
  data: any;
}

export type StateItem = PathStateItem;

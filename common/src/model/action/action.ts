import { PathAddAction } from "./path-add";

export interface AbstractAction {
  type: string;
}

export type Action = PathAddAction;

import { AbstractAction } from "./action";

export interface PathAddAction extends AbstractAction {
  type: "path-add";
  itemId: string;
  segments: { x: number; y: number }[];
  closed: boolean;
  strokeCap: string;
  strokeColor: [number, number, number];
  strokeWidth: number;
}

import { AbstractStateItem } from "./item";

export interface PathStateItem extends AbstractStateItem {
  type: "path";
  data: {
    segments: { x: number; y: number }[];
    closed: boolean;
    strokeCap: string;
    strokeColor: [number, number, number];
    strokeWidth: number;
  };
}

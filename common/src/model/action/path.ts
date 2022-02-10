export interface PathAddAction {
  type: "path-add";
  itemId: string;
  segments: { x: number; y: number }[];
  closed: boolean;
  strokeCap: string;
  strokeColor: string;
  strokeWidth: number;
}

// The types in this file are transferred using JSON. The JSON is validated
// against a JSON Schema file `level.schema.json`, which is autogenerated from
// this file.
//
// Whenever types in this file are modified, the schema must be regenerated
// with:
// >  npx typescript-json-schema "src/level.ts" Level > src/level.schema.json

export type Direction = "U" | "R" | "D" | "L";

export interface Arrow {
  direction: Direction;
}

export type GadgetType = "ARROW" | "EMPTY";
export type Gadget =
  | "UPARROW"
  | "RIGHTARROW"
  | "DOWNARROW"
  | "LEFTARROW"
  | "EMPTY";

export function gadgetType(gadget: Gadget): GadgetType {
  switch (gadget) {
    case "UPARROW":
    case "RIGHTARROW":
    case "DOWNARROW":
    case "LEFTARROW":
      return "ARROW";
    case "EMPTY":
      return "EMPTY";
  }
}

export function gadgetDirection(gadget: Gadget): Direction | undefined {
  switch (gadget) {
    case "UPARROW":
      return "U";
    case "RIGHTARROW":
      return "R";
    case "DOWNARROW":
      return "D";
    case "LEFTARROW":
      return "L";
  }
  return undefined;
}

// Gadget is an object that can be placed onto a field. GadgetOnBoard represents
// its placement.
export type GadgetsOnBoard = { [position: number]: Gadget };

// Provides availability for different gadgets.
export type GadgetToolbox = { [index in Gadget]?: number };

// The position of the dragon on the board is the main component of the state of
// the game.
export interface Dragon {
  position: number;
  direction: Direction;
}

// Interface Level describes the level of the Smok game.
export interface Level {
  width: number;
  height: number;
  board: GadgetsOnBoard;
  toolbox: GadgetToolbox;
  dragon: Dragon;
}

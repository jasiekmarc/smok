import equal from "fast-deep-equal/es6";
import {
  BasketAttributes,
  Direction,
  Dragon,
  gadgetColourOut,
  gadgetDirection,
  GadgetInfo,
  gadgetType,
  GemBalance,
  GemColour,
  Level,
} from "./level";

export type State = {
  dragon: Dragon;
  balance: GemBalance;
  gateOpen: boolean;
};

export function move(state: State, level: Level, field: GadgetInfo): boolean {
  if (state.dragon.balance === undefined) {
    state.dragon.balance = {};
  }
  // Alter the state accoring to the current gadget.
  if (gadgetType(field.gadget) === "ARROW") {
    state.dragon.direction = gadgetDirection(field.gadget) as Direction;
  } else if (gadgetType(field.gadget) === "SCALE") {
    // Dragon puts all of his gems (of a particular colour) on the scale.
    const col = gadgetColourOut(field.gadget) as GemColour;
    state.balance[col] =
      (state.balance[col] || 0) + (state.dragon.balance[col] || 0);
    state.dragon.balance[col] = 0;
  } else if (gadgetType(field.gadget) === "BASKET") {
    const attrs = field.attributes as BasketAttributes;
    if (typeof attrs.count === "number") {
      state.dragon.balance[attrs.colour] =
        (state.dragon.balance[attrs.colour] || 0) + attrs.count;
    } else {
      state.dragon.balance[attrs.colour] =
        (state.dragon.balance[attrs.colour] || 0) +
        (state.dragon.balance[attrs.count] || 0);
    }
  }
  state.gateOpen = equal(state.balance, level.goal);
  // Check if the dragon may be moved.
  if (gadgetType(field.gadget) == "FINISH" && state.gateOpen) {
    return false;
  }
  let posX = state.dragon.position % level.width;
  let posY = Math.trunc(state.dragon.position / level.width);
  switch (state.dragon.direction) {
    case "R":
      posX += 1;
      break;
    case "D":
      posY += 1;
      break;
    case "L":
      posX -= 1;
      break;
    case "U":
      posY -= 1;
      break;
  }
  if (posX < 0 || posX >= level.width || posY < 0 || posY >= level.height) {
    return false;
  }
  state.dragon.position = posY * level.width + posX;
  return true;
}

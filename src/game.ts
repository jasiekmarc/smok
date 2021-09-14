import {
  Level,
  Dragon,
  Gadget,
  gadgetType,
  gadgetDirection,
  Direction,
} from "./level";

export type State = {
  dragon: Dragon;
};

export function move(state: State, level: Level, gadget: Gadget): boolean {
  // Alter the state accoring to the current gadget.
  if (gadgetType(gadget) === "ARROW") {
    state.dragon.direction = gadgetDirection(gadget) as Direction;
  }
  // Check if the dragon may be moved.
  if (gadgetType(gadget) == "FINISH") {
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

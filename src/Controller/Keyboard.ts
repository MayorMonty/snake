/**
 * Keyboard Controller
 */

import Snake, { Direction, oppositeDirection } from "../Entity/Snake";

let direction = Direction.NONE;

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowDown":
      direction = Direction.SOUTH;
      break;

    case "ArrowUp":
      direction = Direction.NORTH;
      break;

    case "ArrowLeft":
      direction = Direction.EAST;
      break;

    case "ArrowRight":
      direction = Direction.WEST;
      break;
  }
});

export default (snake: Snake) => {
  if (
    oppositeDirection(direction) == snake.lastDirection &&
    direction != Direction.NONE
  ) {
    return snake.lastDirection;
  }

  return direction;
};

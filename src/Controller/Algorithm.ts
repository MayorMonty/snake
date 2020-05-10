import Snake, { Direction } from "../Entity/Snake";
import { Point, BoardItem } from "../Entity/Board";

export default (snake: Snake) => {
  let food: Point | null = null;

  return () => {
    while (!food) {
      food = snake.board.find((p) => snake.board.get(p) === BoardItem.FOOD);
    }

    if (snake.head().y < food.y) {
      return Direction.SOUTH;
    }

    if (snake.head().y > food.y) {
      return Direction.NORTH;
    }

    if (snake.head().x > food.x) {
      return Direction.EAST;
    }

    if (snake.head().x < food.x) {
      return Direction.WEST;
    }

    return Direction.NONE;
  };
};

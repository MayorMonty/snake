import Board, { Point, BoardItem, movePoint } from "./Board";
import { EventEmitter } from "events";

export enum Direction {
  NORTH,
  EAST,
  SOUTH,
  WEST,
  NONE,
}

export function oppositeDirection(a: Direction) {
  if (a == Direction.NONE) return Direction.NONE;

  switch (a) {
    case Direction.NORTH:
      return Direction.SOUTH;
    case Direction.SOUTH:
      return Direction.NORTH;
    case Direction.EAST:
      return Direction.WEST;
    case Direction.WEST:
      return Direction.EAST;
  }
}

export type SnakeController = (snake: Snake) => Direction;

export default class Snake extends EventEmitter {
  body: Point[] = [];
  board: Board;

  lastDirection: Direction = Direction.NONE;

  constructor({
    board,
    head,
    size,
    facing,
  }: {
    board: Board;
    head: Point;
    size: number;
    facing: Direction;
  }) {
    super();
    this.board = board;
    this.lastDirection = facing;

    // Create the body
    this.body[0] = head;
    for (let i = 1; i < size; i++) {
      this.body[i] = movePoint(this.body[i - 1], oppositeDirection(facing));
    }

    // Set up the board
    this.body.forEach((point) => this.board.set(point, BoardItem.SNAKE));
  }

  head(): Point {
    return this.body[0];
  }

  move(direction: Direction) {
    // You can't move backwards in snake
    if (oppositeDirection(direction) == this.lastDirection) {
      return null;
    }

    this.lastDirection = direction;

    // Create the new head by creating a new point based on the old one
    const head = movePoint(this.head(), direction);

    // Moving into a wall is losing
    if (!this.board.hasPoint(head)) {
      this.emit("lost");
      return null;
    }

    // Running into ourself is losing
    if (this.board.get(head) == BoardItem.SNAKE) {
      this.emit("lost");
      return null;
    }

    // Take off the end of the snake, and add to the beginning to move (that way moving is O(1) instead of O(n))
    const tail = this.body.pop() as Point;
    this.body.unshift(head);

    // We've eaten food!
    if (this.board.get(head) == BoardItem.FOOD) {
      // Add on to the end of the snake
      this.body.push(
        movePoint(
          this.body[this.body.length - 1],
          oppositeDirection(this.lastDirection)
        )
      );

      // Add a new food to the board
      let foods = this.board.addFood(1);

      this.emit("grow", foods);
    }

    // Update board data
    this.board.set(head, BoardItem.SNAKE).set(tail, BoardItem.EMPTY);
  }
}

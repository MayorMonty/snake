import { Direction } from "./Snake";

export enum BoardItem {
  EMPTY,
  SNAKE,
  FOOD,
}

export interface Point {
  x: number;
  y: number;
}

/**
 * Creates a point structure
 * @param x
 * @param y
 */
export function p(x: number, y: number): Point {
  return { x, y };
}

export function movePoint(point: Point, direction: Direction): Point {
  switch (direction) {
    case Direction.NONE:
      return point;
    case Direction.NORTH:
      return p(point.x, point.y - 1);
    case Direction.SOUTH:
      return p(point.x, point.y + 1);
    case Direction.EAST:
      return p(point.x - 1, point.y);
    case Direction.WEST:
      return p(point.x + 1, point.y);
  }
}

export default class Board {
  size: [number, number] = [100, 50];
  contents: BoardItem[][] = [...Array(this.size[0])].map(() =>
    [...Array(this.size[1])].map(() => BoardItem.EMPTY)
  );
  colors = ["#2d3436", "#55efc4", "#e17055"];

  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  boxWidth: number;
  boxHeight: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d") as CanvasRenderingContext2D;

    this.boxWidth = this.canvas.width / this.size[0];
    this.boxHeight = this.canvas.width / this.size[0];
  }

  set(p: Point, value: BoardItem) {
    this.contents[p.x][p.y] = value;
    return this;
  }

  get(p: Point) {
    return this.contents[p.x][p.y];
  }

  hasPoint(p: Point) {
    return p.x >= 0 && p.y >= 0 && p.x < this.size[0] && p.y < this.size[1];
  }

  find(search: (p: Point) => boolean): Point | null {
    for (let x = 0; x < this.size[0]; x++) {
      for (let y = 0; y < this.size[1]; y++) {
        if (search(p(x, y))) return p(x, y);
      }
    }

    return null;
  }

  addFood(food: number) {
    let pos: Point[] = [];

    for (let i = 0; i < food; i++) {
      let position = p(
        Math.round(Math.random() * this.size[0]),
        Math.round(Math.random() * this.size[1])
      );

      // Reroll if we've landed on snake
      if (this.get(position) == BoardItem.SNAKE) {
        i--;
        continue;
      }

      this.set(position, BoardItem.FOOD);
      pos.push(position);
    }

    return pos;
  }

  marked: Point[] = [];

  mark(point: Point) {
    this.marked.push(point);
  }

  unmark(point: Point) {
    this.marked = this.marked.filter((p) => p.x != point.x || p.y != point.y);
  }

  isMarked(point: Point) {
    return this.marked.some((p) => p.x == point.x && p.y == point.y);
  }

  render = () => {
    // Iterate through each item
    this.contents.forEach((col, x) =>
      col.forEach((item, y) => {
        this.context.globalAlpha = 1;
        this.context.fillStyle = this.colors[item];
        this.context.fillRect(
          x * this.boxWidth,
          y * this.boxHeight,
          this.boxWidth,
          this.boxHeight
        );

        // Show the marked points
        if (this.isMarked(p(x, y))) {
          this.context.fillStyle = "#6c5ce7";
          this.context.globalAlpha = 0.5;
          this.context.fillRect(
            x * this.boxWidth,
            y * this.boxHeight,
            this.boxWidth,
            this.boxHeight
          );
        }
      })
    );
  };
}

import Board, { p, BoardItem } from "./Entity/Board";
import Snake, { Direction } from "./Entity/Snake";
import keyboard from "./Controller/Keyboard";

const canvas = document.querySelector("canvas#snake") as HTMLCanvasElement;
const board = new Board(canvas);

const snake = new Snake({
    board,
    head: p(10, 5),
    facing: Direction.NONE,
    size: 1
});

// Create Food
board.set(p(30, 30), BoardItem.FOOD)

// Start the render
board.render();

let input = setInterval(() => {
    const direction = keyboard(snake);
    snake.move(direction);

    if (board.lost) clearInterval(input);

}, 50);
import Board, { p, BoardItem } from "./Entity/Board";
import Snake, { Direction } from "./Entity/Snake";
import keyboard from "./Controller/Keyboard";
import algorithmic from "./Controller/Algorithm";

const canvas = document.querySelector("canvas#snake") as HTMLCanvasElement;
const board = new Board(canvas);

const snake = new Snake({
    board,
    head: p(5, 5),
    facing: Direction.NONE,
    size: 1
});

// Create Food
board.set(p(30, 30), BoardItem.FOOD)

// Start the render
board.render();

const controller = algorithmic(snake);

let input = setInterval(() => {
    const direction = controller();
    snake.move(direction);
}, 5);

snake.on("lose", () => clearInterval(input));
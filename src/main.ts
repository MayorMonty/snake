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
  size: 1,
});

// Create Food
board.addFood(1);

let lost = false;

function render() {
  board.render();

  if (!lost) requestAnimationFrame(render);
}

function loop() {
  const direction = keyboard(snake);
  snake.move(direction);
}

const controller = algorithmic(snake);

let loopTimer: NodeJS.Timeout | null = setInterval(loop, 50);

window.addEventListener("keydown", (e) => {
  e.preventDefault();

  if (e.key !== " ") return;

  if (loopTimer) {
    clearInterval(loopTimer);
    loopTimer = null;
  } else {
    loopTimer = setInterval(loop, 50);
  }
});

render();

snake.on("lost", () => (lost = true));

import Board, { p } from "./Entity/Board";
import { Snake } from "./Entity/Snake";

const canvas = document.querySelector("canvas");
const board = new Board(canvas);

const snake = new Snake(board,
    p(5, 5), p(5, 6), p(5, 7)
);

// Start the render
board.render();
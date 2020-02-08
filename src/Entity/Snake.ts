import Board, { Point, BoardItem } from "./Board";

export class Snake {

    body: Point[] = [];
    board: Board;

    constructor(board: Board, ...body: Point[]) {
        this.board = board;
        this.body = body;

        body.forEach(point => this.board.set(point, BoardItem.SNAKE));
    }


}
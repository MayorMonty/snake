export enum BoardItem {
    EMPTY,
    SNAKE,
    FOOD
}

export interface Point {
    x: number;
    y: number;
}

export function p(x: number, y: number): Point {
    return { x, y };
}

export default class Board {

    size = [100, 50]
    contents: BoardItem[][] = [...Array(this.size[0])].map(() => [...Array(this.size[1])].map(() => BoardItem.EMPTY));
    colors = ["#2d3436", "#55efc4", "#ff7675"]

    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;

    boxWidth: number;
    boxHeight: number;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");

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

    render = () => {

        // Iterate through each item
        this.contents.forEach((col, x) => col.forEach((item, y) => {

            this.context.fillStyle = this.colors[item]
            this.context.fillRect(x * this.boxWidth, y * this.boxHeight, this.boxWidth, this.boxHeight);


        }));

        requestAnimationFrame(this.render);

    }

}
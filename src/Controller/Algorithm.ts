/**
 * Algorithmic Control
 *
 * Initally, the snake will follow an A* pathfinding algorithm
 */


import Snake, { Direction } from "../Entity/Snake";
import Board, { Point, BoardItem, movePoint } from "../Entity/Board";


class Node implements Point {
    x: number;
    y: number;

    cost: number;
    ground: number;
    heuristic: number;

    // The directional change in regards to the parent node
    represents: Direction;

    parent: Node;
    end: Point;

    // Whether or not this is the original node
    base = false;

    /**
     * Returns the square distance from this node to another
     * @param p Point (or Node)
     */
    distance(p: Point) {
        return (this.x - p.x) ** 2 + (this.y - p.y) ** 2;
    }

    constructor(base: Point, end: Point, represents: Direction, parentNode?: Node) {

        this.x = base.x;
        this.y = base.y;

        this.represents = represents;

        this.ground = parentNode ? parentNode.ground + 1 : 0;
        this.heuristic = this.distance(end);
        this.cost = this.ground + this.heuristic;
        this.parent = parentNode;
        this.end = end;

        this.base = !parentNode;

    }

    is(point: Point) {
        return this.x == point.x && this.y == point.y;
    }

    setParent(node: Node) {
        this.parent = node;

        this.ground = node.ground
        this.heuristic = this.distance(this.end);
        this.cost = this.ground + this.heuristic;
    }
}


export class PriorityQueue<T> implements Iterable<T> {

    heap: [T, number][] = [];
    comparator: (a: T, b: T) => boolean = (a, b) => a === b;

    constructor(comparator?: (a: T, b: T) => boolean) {
        if (comparator) {
            this.comparator = comparator;
        }
    }

    /**
     * Inserts the value at the specified priority
     * @param value 
     * @param priority 
     */
    insert(value: T, priority: number) {
        let inserted = false;
        for (let i = 0; i < this.heap.length; i++) {
            const compare = this.heap[i];

            if (compare[1] < priority) {
                this.heap.splice(i, 0, [value, priority]);
                inserted = true;
            }

        }

        if (!inserted) {
            this.heap.push([value, priority])
        }
    }

    /**
     * Use the comparator argument (defaults to triple equals) to see if the queue has an item
     * @param value Value to compare
     */
    has(value: T) {
        return this.heap.some(item => this.comparator(item[0], value));
    }

    /**
     * Gets the size of the queue
     */
    size() {
        return this.heap.length;
    }

    // Access Methods

    /**
     * Gets the highest priority item without removing
     */
    peek() {
        return this.heap[0][0];
    }

    /**
     * Gets the lowest priority item without removing
     */
    peekEnd() {
        this.heap[this.heap.length - 1][0];
    }

    /**
     * Gets the lowest priority item
     */
    getEnd() {
        return this.heap.pop()[0];
    }

    /**
     * Gets the highest priority item
     */
    get() {
        return this.heap.shift()[0];
    }


    // Iteration methods

    /**
     * Returns an array of each of the values
     */
    values() {
        return this.heap.map(([val]) => val);
    }

    /**
     * Returns an array of the priorities
     */
    priorities() {
        return this.heap.map(([, p]) => p);
    }

    /**
     * Returns an entries array like [value, priority]
     */
    entries() {
        return this.heap;
    }

    /**
     * Iterates through the object, returns [value, priority]
     */
    private step = 0;
    public [Symbol.iterator]() {
        return {
            next: function () {
                return {
                    done: this.step === this.heap.length,
                    value: this.heap[this.step]
                }
            }.bind(this)
        }
    }

}



function pathfind(board: Board, start: Point, end: Point) {


    const frontier = new PriorityQueue<Node>((a, b) => a.is(b));
    const origin = new Node(start, end, Direction.NONE);

    frontier.insert(origin, origin.cost);

    while (frontier.size() > 0) {
        const current = frontier.getEnd();

        // If we've reached the end, reconstruct the path
        if (current.is(end)) {
            let directions: Direction[] = [];
            let node = current;

            while (!node.base) {
                directions.unshift(node.represents);
                node = node.parent;
            }

            return directions;
        }

        // For each of the directions
        for (let direction = 0; direction < 4; direction++) {

            // Create new node and add it to frontier
            const point = movePoint(current, direction);
            if (board.hasPoint(point) && board.get(point) !== BoardItem.SNAKE) {
                const node = new Node(point, end, direction, current);

                if (frontier.has(node)) {

                } else {
                    frontier.insert(node, node.cost);
                }


            }


        }

    }

    return [];

}

export default (snake: Snake) => {

    const board = snake.board;
    const start = snake.head();
    const end = board.find(p => board.get(p) === BoardItem.FOOD);

    // let path = pathfind(board, start, end);
    let path = [];

    return () => {
        const direction = path.shift();
        if (typeof direction === "undefined") {
            return Direction.NONE;
        }

        console.log(direction);
        return direction;
    }
}
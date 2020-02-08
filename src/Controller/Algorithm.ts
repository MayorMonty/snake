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


export default function AStarHamiltonianControl(snake: Snake) {

    let PATH = [];

    function generateAStarPath(): Direction[] {

        // Get the current position of the food, the target
        const target = snake.board.find(p => snake.board.get(p) == BoardItem.FOOD);

        // Add the starting square to the open list
        let openList = [
            new Node(snake.head(), target, Direction.NONE)
        ];

        // Closed list
        let closedList = [];

        let endNode: Node;

        // Search for the path
        while (openList.length > 0 && !endNode) {

            // Sort openList by lowest total cost
            openList = openList.sort((a, b) => a.cost - b.cost);

            // Remove the lowest cost as the current, and add to closed list
            let current = openList.shift();
            closedList.push(current);

            // For each of the directions
            for (let i = 0; i < 4; i++) {
                let direction: Direction = i;

                // Get the point at this place, if it's snake or the wall, we can't go there
                let point = movePoint(current, direction);
                if (!snake.board.hasPoint(point) || snake.board.get(point) == BoardItem.SNAKE) continue;

                // Create a node for the possible path
                let node = new Node(point, target, direction, current);

                // If we've reached the target, break!
                if (node.is(target)) {
                    endNode = node;
                    break;
                }

                // If it's not on the open list, add it
                let same = openList.find(n => n.is(node));

                if (!same) {
                    openList.push(node);

                    // Else compare the G cost of the two nodes, if it's better, use current as the parent (marking the shorter path)
                } else if (node.ground < same.ground) {
                    same.setParent(current);
                }

            }
        }

        // If we couldn't find a path, just stay still for now
        if (!endNode) {
            return [];
        }

        // Else create a list of directions to the food
        let directions = [];
        let node: Node = endNode;

        while (!node.base) {
            directions.unshift(node.represents);
            node = node.parent;
        }

        return directions;


    };

    // Regenerate the path whenever we grow
    snake.on("grow", () => {
        PATH = generateAStarPath();
    })

    // Start by generateing the path
    PATH = generateAStarPath();

    // Follow the path each iteration
    return () => {
        return PATH.shift() || Direction.NONE;
    }

}
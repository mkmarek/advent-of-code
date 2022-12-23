const fs = require("fs");
const PriorityQueue = require("javascript-priority-queue");
const { QuadTree, Box } = require("js-quadtree");
const {
  sum,
  groupBy,
  toKeyValue,
  intersect,
  distinct,
  iterateTwoDimArray,
  deepCopy,
  getNeighbors,
  makeGraph,
  cache,
  getNeighborsDiagonal,
} = require("../utils");

let input = fs
  .readFileSync("23.txt")
  .toString()
  .split("\n")
  .map((e) => e.trim().split(""));

function getBounds(input) {
  const xx = [];
  const yy = [];
  iterateTwoDimArray(input, (e, y, x) => {
    if (e === "#") {
      xx.push(x);
      yy.push(y);
    }
  });

  return {
    x: { min: Math.min(...xx), max: Math.max(...xx) },
    y: { min: Math.min(...yy), max: Math.max(...yy) },
  };
}

function enlargeInput(input, size) {
  if (input.length >= size) {
    return input;
  }

  const newInput = [];
  let emptyLine = [];
  for (let i = 0; i < input[0].length + 2; i++) {
    emptyLine.push(".");
  }

  newInput.push([...emptyLine]);

  for (let y = 0; y < input.length; y++) {
    const ln = ["."];
    for (let x = 0; x < input[y].length; x++) {
      ln.push(input[y][x]);
    }
    ln.push(".");
    newInput.push(ln);
  }
  newInput.push([...emptyLine]);

  return newInput;
}

function proposeDirection(x, y, dir) {
  let isAtNorth = input[y - 1][x] === "#";
  let isAtSouth = input[y + 1][x] === "#";
  let isAtWest = input[y][x - 1] === "#";
  let isAtEast = input[y][x + 1] === "#";
  let isAtNorthEast = input[y - 1][x + 1] === "#";
  let isAtNorthWest = input[y - 1][x - 1] === "#";
  let isAtSouthEast = input[y + 1][x + 1] === "#";
  let isAtSouthWest = input[y + 1][x - 1] === "#";

  if (
    !isAtNorth &&
    !isAtSouth &&
    !isAtWest &&
    !isAtEast &&
    !isAtNorthEast &&
    !isAtNorthWest &&
    !isAtSouthEast &&
    !isAtSouthWest
  ) {
    return null;
  }

  if (dir === "N" && !isAtNorth && !isAtNorthEast && !isAtNorthWest) {
    return "N";
  }

  if (dir === "S" && !isAtSouth && !isAtSouthEast && !isAtSouthWest) {
    return "S";
  }

  if (dir === "W" && !isAtWest && !isAtNorthWest && !isAtSouthWest) {
    return "W";
  }

  if (dir === "E" && !isAtEast && !isAtSouthEast && !isAtNorthEast) {
    return "E";
  }

  return null;
}

function run() {
  const directions = ["N", "S", "W", "E"];
  let directionIndex = 0;

  let iter = 0;
  while (true) {
    if (iter === 10) {
      const bounds = getBounds(input);
      let empty = 0;
      for (let y = bounds.y.min; y <= bounds.y.max; y++) {
        for (let x = bounds.x.min; x <= bounds.x.max; x++) {
          if (input[y][x] === ".") {
            empty++;
          }
        }
      }

      console.log("Part1:", empty);
    }

    const b = getBounds(input);
    input = enlargeInput(input, Math.max(b.x.max, b.y.max) + 4);

    const proposedDirections = [];
    iterateTwoDimArray(input, (e, y, x) => {
      if (e === "#") {
        for (let d = 0; d < directions.length; d++) {
          const proposed = proposeDirection(
            x,
            y,
            directions[(directionIndex + d) % directions.length]
          );
          if (
            proposed &&
            !proposedDirections.some((e) => e.x === x && e.y === y)
          ) {
            proposedDirections.push({ proposed, x, y });
          }
        }
      }
    });

    const cloned = deepCopy(input);
    const moves = [];
    const clashes = [];
    for (const proposedDirection of proposedDirections) {
      const { proposed, x, y } = proposedDirection;

      if (proposed === "N") {
        if (cloned[y - 1][x] === "#") {
          clashes.push({ x, y: y - 1 });
        }

        cloned[y - 1][x] = "#";
        moves.push({ from: { x, y }, to: { x, y: y - 1 } });
      }

      if (proposed === "S") {
        if (cloned[y + 1][x] === "#") {
          clashes.push({ x, y: y + 1 });
        }

        cloned[y + 1][x] = "#";
        moves.push({ from: { x, y }, to: { x, y: y + 1 } });
      }

      if (proposed === "W") {
        if (cloned[y][x - 1] === "#") {
          clashes.push({ x: x - 1, y });
        }

        cloned[y][x - 1] = "#";
        moves.push({ from: { x, y }, to: { x: x - 1, y } });
      }

      if (proposed === "E") {
        if (cloned[y][x + 1] === "#") {
          clashes.push({ x: x + 1, y });
        }

        cloned[y][x + 1] = "#";
        moves.push({ from: { x, y }, to: { x: x + 1, y } });
      }
    }

    if (moves.length === 0) {
      console.log("Part2:", iter + 1);
      return;
    }

    const validMoves = moves.filter(
      (e) => !clashes.some((c) => c.x === e.to.x && c.y === e.to.y)
    );

    for (let m = 0; m < validMoves.length; m++) {
      const { from, to } = validMoves[m];
      input[to.y][to.x] = "#";
      input[from.y][from.x] = ".";
    }

    directionIndex = (directionIndex + 1) % directions.length;
    iter++;
  }
}

run();

const fs = require("fs");
const PriorityQueue = require("javascript-priority-queue");
const { QuadTree, Box } = require("js-quadtree");
const { start } = require("repl");
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
  .readFileSync("24.txt")
  .toString()
  .split("\n")
  .map((e) => e.trim().split(""));

function pointEquals(p1, p2) {
  return p1.x === p2.x && p1.y === p2.y;
}

const blizTypes = [">", "<", "^", "v"];

const directionFromFacing = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: -1 },
  { x: 0, y: 1 },
];

function moveBlizzards(blizzards, bounds) {
  return blizzards.map((b) => {
    const dir = directionFromFacing[b.facing];
    let newX = b.x + dir.x;
    let newY = b.y + dir.y;

    if (newX > bounds.x2) {
      newX = bounds.x1;
    }

    if (newX < bounds.x1) {
      newX = bounds.x2;
    }

    if (newY > bounds.y2) {
      newY = bounds.y1;
    }

    if (newY < bounds.y1) {
      newY = bounds.y2;
    }

    return { x: newX, y: newY, facing: b.facing };
  });
}

function isPointInBounds(p, bounds) {
  return (
    p.x >= bounds.x1 && p.x <= bounds.x2 && p.y >= bounds.y1 && p.y <= bounds.y2
  );
}

function getPossibleMoves(loc, blizzards, bounds) {
  return [
    { x: loc.x + 1, y: loc.y },
    { x: loc.x - 1, y: loc.y },
    { x: loc.x, y: loc.y + 1 },
    { x: loc.x, y: loc.y - 1 },
  ].filter((e) => !blizzards[`${e.x},${e.y}`] && isPointInBounds(e, bounds));
}

function manhattanDistance(p1, p2) {
  return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

function calculatePath(start, end, blizzards, bounds, stepsCounter) {
  const visited = {};
  const queue = new PriorityQueue.default("min");

  queue.enqueue({ loc: start, steps: stepsCounter }, stepsCounter);

  while (queue.size()) {
    const el = queue.dequeue();

    if (manhattanDistance(el.loc, end) === 1) {
      return el.steps + 1;
    }

    const moves = getPossibleMoves(
      el.loc,
      blizzards[(el.steps + 1) % blizzards.length],
      bounds
    );

    for (const move of moves) {
      const key = `${move.x},${move.y},${(el.steps + 1) % blizzards.length}`;
      if (visited[key]) {
        continue;
      }
      visited[key] = true;
      queue.enqueue(
        { loc: move, steps: el.steps + 1, parent: el },
        manhattanDistance(move, end) + el.steps + 1
      );
    }

    if (
      !blizzards[(el.steps + 1) % blizzards.length][`${el.loc.x},${el.loc.y}`]
    ) {
      queue.enqueue(
        { loc: el.loc, steps: el.steps + 1, parent: el },
        manhattanDistance(el.loc, end) + el.steps + 1
      );
    }
  }
}

function getInput() {
  const blizzards = [];
  let start = { x: input[0].findIndex((e) => e === "."), y: 0 };
  let end = {
    x: input[input.length - 1].findIndex((e) => e === "."),
    y: input.length - 1,
  };

  const bounds = { x1: 0999999, y1: 9999, x2: 0, y2: 0 };
  iterateTwoDimArray(input, (e, y, x) => {
    if (blizTypes.includes(e)) {
      blizzards.push({ x, y, facing: blizTypes.indexOf(e) });
    }

    if (
      [">", "<", "^", "v", "."].includes(e) &&
      !pointEquals({ x, y }, start) &&
      !pointEquals({ x, y }, end)
    ) {
      bounds.x1 = Math.min(bounds.x1, x);
      bounds.y1 = Math.min(bounds.y1, y);
      bounds.x2 = Math.max(bounds.x2, x);
      bounds.y2 = Math.max(bounds.y2, y);
    }
  });

  return { start, end, blizzards, bounds };
}

function blizzardMaps(blizzards, bounds) {
  function toMap(blizzards) {
    const b = {};
    for (const bliz of blizzards) {
      b[`${bliz.x},${bliz.y}`] = true;
    }
    return b;
  }

  const map = [toMap(blizzards)];
  const set = new Set();
  set.add(blizzards.map((b) => `${b.x},${b.y},${b.facing}`).join("|"));

  while (true) {
    const newBlizzards = moveBlizzards(blizzards, bounds);
    const key = newBlizzards.map((b) => `${b.x},${b.y},${b.facing}`).join("|");
    if (set.has(key)) {
      break;
    }
    set.add(key);
    blizzards = newBlizzards;

    map.push(toMap(blizzards));
  }

  return map;
}

function run() {
  const { start, end, blizzards, bounds } = getInput();
  const blizzardm = blizzardMaps(blizzards, bounds);

  const steps1 = calculatePath(start, end, blizzardm, bounds, 0);
  console.log(`Part 1: ${steps1}`);

  const steps2 = calculatePath(end, start, blizzardm, bounds, steps1);
  const steps3 = calculatePath(start, end, blizzardm, bounds, steps2);
  console.log(`Part 2: ${steps3}`);
}

run();

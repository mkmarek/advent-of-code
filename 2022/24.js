const fs = require("fs");
const PriorityQueue = require('javascript-priority-queue');
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

const blizTypes = ['>', '<', '^', 'v'];

const directionFromFacing = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: -1 },
  { x: 0, y: 1 },
]

function moveBlizzards(blizzards, bounds) {
  return blizzards.map(b => {
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
  return p.x >= bounds.x1 && p.x <= bounds.x2 && p.y >= bounds.y1 && p.y <= bounds.y2;
}

function getPossibleMoves(loc, blizzards, bounds) {
  return [
    { x: loc.x + 1, y: loc.y },
    { x: loc.x - 1, y: loc.y },
    { x: loc.x, y: loc.y + 1 },
    { x: loc.x, y: loc.y - 1 },
  ].filter(e => !blizzards.some(b => pointEquals(b, e)) && isPointInBounds(e, bounds));
}

function manhattanDistance(p1, p2) {
  return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

function calculatePath(start, end, blizzards, bounds) {
  const visited = {};
  const queue = new PriorityQueue.default('min');

  queue.enqueue({ loc: start, steps: 0, blizzards: deepCopy(blizzards) }, 0);

  while (queue.size()) {
    const el = queue.dequeue();

    if (manhattanDistance(el.loc, end) === 1) {
      return [el.steps + 1, moveBlizzards(el.blizzards, bounds)];
    }

    const blizzardsAfter = moveBlizzards(el.blizzards, bounds);
    const moves = getPossibleMoves(el.loc, blizzardsAfter, bounds);

    let hasNextMoves = false;
    for (const move of moves) {
      const key = `${move.x},${move.y},${blizzardsAfter.map(b => `${b.x},${b.y},${b.facing}`).join('|')}`;
      if (visited[key]) {
        continue;
      }
      visited[key] = true;
      // hasNextMoves = true;
      queue.enqueue({ loc: move, steps: el.steps + 1, blizzards: blizzardsAfter, parent: el }, manhattanDistance(move, end) + el.steps + 1);
    }

    if (!hasNextMoves) {
      const afterWait = moveBlizzards(el.blizzards, bounds);
      if (!afterWait.some(b => pointEquals(b, el.loc))) {
        queue.enqueue({ loc: el.loc, steps: el.steps + 1, blizzards: blizzardsAfter, parent: el }, manhattanDistance(el.loc, end) + el.steps + 1);
      }
    }
  }
}

function getInput() {
  const blizzards = [];
  let start = { x: input[0].findIndex(e => e === '.'), y: 0 };
  let end = { x: input[input.length - 1].findIndex(e => e === '.'), y: input.length - 1 };
  
  const bounds = { x1: 0999999, y1: 9999, x2: 0, y2: 0 };
  iterateTwoDimArray(input, (e, y, x) => {
    if (blizTypes.includes(e)) {
      blizzards.push({ x, y, facing: blizTypes.indexOf(e) });
    }
    
    if (['>', '<', '^', 'v', '.'].includes(e) && !pointEquals({ x, y }, start) && !pointEquals({ x, y }, end)) {
      bounds.x1 = Math.min(bounds.x1, x);
      bounds.y1 = Math.min(bounds.y1, y);
      bounds.x2 = Math.max(bounds.x2, x);
      bounds.y2 = Math.max(bounds.y2, y);
    }
  });

  return { start, end, blizzards, bounds };
}

function part1() {
  const { start, end, blizzards, bounds } = getInput();
  return calculatePath(start, end, blizzards, bounds)[0];
}

function part2() {
  const { start, end, blizzards, bounds } = getInput();

  console.log('Calculating way there');
  const [steps1, blizzards1] = calculatePath(start, end, blizzards, bounds);
  console.log(`Calculating way back (Steps so far: ${steps1})`);
  const [steps2, blizzards2] = calculatePath(end, start, blizzards1, bounds);
  console.log(`Calculating way there again (Steps so far: ${steps1 + steps2})`);
  const [steps3] = calculatePath(start, end, blizzards2, bounds);

  return steps1 + steps2 + steps3;
}

console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);


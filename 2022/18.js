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
} = require("../utils");

const input = fs
  .readFileSync("18.txt")
  .toString()
  .trim()
  .split("\n")
  .map((x) => x.trim().split(",").map(Number));

function getNeighbors3d(pos) {
  const neighbors = [
    [-1, 0, 0],
    [1, 0, 0],
    [0, -1, 0],
    [0, 1, 0],
    [0, 0, -1],
    [0, 0, 1],
  ].map((e) => [e[0] + pos[0], e[1] + pos[1], e[2] + pos[2]]);

  return neighbors;
}

function coordEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}

function part1() {
  const sides = input
    .map((x) => getNeighbors3d(x))
    .flat()
    .filter((y) => !input.some((g) => coordEquals(g, y)));

  return sides.length;
}

function bounds(input) {
  const xs = input.map((x) => x[0]);
  const ys = input.map((x) => x[1]);
  const zs = input.map((x) => x[2]);

  return [
    [Math.min(...xs), Math.max(...xs)],
    [Math.min(...ys), Math.max(...ys)],
    [Math.min(...zs), Math.max(...zs)],
  ];
}

function getExteriorPoints(input) {
  const [xBounds, yBounds, zBounds] = bounds(input);

  let startPoint = [xBounds[0] - 1, yBounds[0] - 1, zBounds[0] - 1];
  const queue = [startPoint];
  const visited = new Set();

  while (queue.length > 0) {
    const current = queue.shift();

    visited.add(`${current[0]},${current[1]},${current[2]}`);
    const neighbors = getNeighbors3d(current).filter(
      (x) =>
        x[0] >= xBounds[0] - 1 &&
        x[0] <= xBounds[1] + 1 &&
        x[1] >= yBounds[0] - 1 &&
        x[1] <= yBounds[1] + 1 &&
        x[2] >= zBounds[0] - 1 &&
        x[2] <= zBounds[1] + 1
    ).filter(e => !input.some(x => coordEquals(x, e)));

    for (const neighbor of neighbors) {
      if (!visited.has(`${neighbor[0]},${neighbor[1]},${neighbor[2]}`)) {
        queue.push(neighbor);
        visited.add(`${neighbor[0]},${neighbor[1]},${neighbor[2]}`);
      }
    }
  }

  return visited;
}

function part2() {
  const exterior = getExteriorPoints(input);

  const sides = input
    .map((x) => getNeighbors3d(x))
    .flat()
    .filter((y) => exterior.has(`${y[0]},${y[1]},${y[2]}`))
    .filter((y) => !input.some((g) => coordEquals(g, y)));

  return sides.length;
}

console.log(`Part1: ${part1()}`);
console.log(`Part2: ${part2()}`);

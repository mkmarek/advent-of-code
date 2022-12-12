const fs = require("fs");
const PriorityQueue = require("javascript-priority-queue");
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
} = require("../utils");

const input = fs
  .readFileSync("12.txt")
  .toString()
  .trim()
  .split("\n")
  .map((x) => x.trim().split(""));

function findPath(start, end) {
  const open = new PriorityQueue.default("min");
  open.enqueue(start, start.steps);
  const m = {};

  while (open.size()) {
    const current = open.dequeue();

    let neighbors = getNeighbors([current.y, current.x], input);
    for (let neighbor of neighbors) {
      let y = neighbor[0];
      let x = neighbor[1];

      if (m[`[${y},${x}]`]) {
        continue;
      }

      let ord = input[y][x].charCodeAt(0);
      let currOrd = input[current.y][current.x].charCodeAt(0);

      if (input[current.y][current.x] === "S") {
        currOrd = "s".charCodeAt(0);
      }

      if (input[y][x] === "E") {
        ord = "z".charCodeAt(0);
      }

      if (ord - currOrd > 1) {
        continue;
      }

      if (x === end.x && y === end.y) {
        return current.steps + 1;
      }

      m[`[${y},${x}]`] = true;
      open.enqueue({ x, y, steps: current.steps + 1 }, current.steps + 1);
    }
  }
}

function part1() {
  let start = null;
  let end = null;

  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      if (input[y][x] === "S") {
        start = { x, y, steps: 0, cost: 0 };
      }
      if (input[y][x] === "E") {
        end = { x, y, steps: 0, cost: 0 };
      }
    }
  }

  return findPath(start, end);
}

function part2() {
  let starts = [];
  let end = null;

  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      if (input[y][x] === "a" || input[y][x] === "S") {
        starts.push({ x, y, steps: 0, cost: 0 });
      }
      if (input[y][x] === "E") {
        end = { x, y, steps: 0, cost: 0 };
      }
    }
  }

  let steps = [];
  for (let start of starts) {
    steps.push(findPath(start, end));
  }

  return Math.min(...steps.filter((e) => e));
}

console.log(`Part1: ${part1()}`);
console.log(`Part2: ${part2()}`);

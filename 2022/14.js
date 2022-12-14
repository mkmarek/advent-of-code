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
  .readFileSync("14.txt")
  .toString()
  .trim()
  .split("\n")
  .map((e) =>
    e
      .trim()
      .split(" -> ")
      .map((e) => e.split(",").map(Number))
  );

function part1() {
  let bounds = { x: 500, y: 0, w: 500, h: 0 };
  let grid = [];

  for (let i = 0; i < input.length; i++) {
    let lines = input[i];
    for (let j = 0; j < lines.length - 1; j++) {
      let from = lines[j];
      let to = lines[j + 1];

      bounds.x = Math.min(bounds.x, from[0], to[0]);
      bounds.w = Math.max(bounds.w, from[0], to[0]);
      bounds.y = Math.min(bounds.y, from[1], to[1]);
      bounds.h = Math.max(bounds.h, from[1], to[1]);

      if (from[0] !== to[0]) {
        for (let x = from[0]; x !== to[0]; x += Math.sign(to[0] - from[0])) {
          grid[x] = grid[x] || [];
          grid[x][from[1]] = "#";
        }

        grid[to[0]] = grid[to[0]] || [];
        grid[to[0]][from[1]] = "#";
      }

      if (from[1] !== to[1]) {
        for (let y = from[1]; y !== to[1]; y += Math.sign(to[1] - from[1])) {
          grid[from[0]] = grid[from[0]] || [];
          grid[from[0]][y] = "#";
        }

        grid[from[0]] = grid[from[0]] || [];
        grid[from[0]][to[1]] = "#";

      }
    }
  }

  let grains = {};
  while (true) {
    let grain = [500, 0];

    while (true) {
      const gridBelowEmpty =
        ((grid[grain[0]] || [])[grain[1] + 1] || ".") === ".";
      const grainBelowEmpty = !grains[grain[0] + "," + (grain[1] + 1)];
      const gridLeftBelowEmpty =
        ((grid[grain[0] - 1] || [])[grain[1] + 1] || ".") === ".";
      const grainLeftBelowEmpty = !grains[grain[0] - 1 + "," + (grain[1] + 1)];
      const gridRightBelowEmpty =
        ((grid[grain[0] + 1] || [])[grain[1] + 1] || ".") === ".";
      const grainRightBelowEmpty = !grains[grain[0] + 1 + "," + (grain[1] + 1)];

      if (gridBelowEmpty && grainBelowEmpty) {
        grain[1]++;
      } else if (gridLeftBelowEmpty && grainLeftBelowEmpty) {
        grain[0]--;
        grain[1]++;
      } else if (gridRightBelowEmpty && grainRightBelowEmpty) {
        grain[0]++;
        grain[1]++;
      } else {
        break;
      }

      if (grain[1] > bounds.h) {
        return Object.keys(grains).length
      }
    }

    grains[grain[0] + "," + grain[1]] = true;
  }
}

function part2() {
  let bounds = { x: 500, y: 0, w: 500, h: 0 };
  let grid = [];

  for (let i = 0; i < input.length; i++) {
    let lines = input[i];
    for (let j = 0; j < lines.length - 1; j++) {
      let from = lines[j];
      let to = lines[j + 1];

      bounds.x = Math.min(bounds.x, from[0], to[0]);
      bounds.w = Math.max(bounds.w, from[0], to[0]);
      bounds.y = Math.min(bounds.y, from[1], to[1]);
      bounds.h = Math.max(bounds.h, from[1], to[1]);

      if (from[0] !== to[0]) {
        for (let x = from[0]; x !== to[0]; x += Math.sign(to[0] - from[0])) {
          grid[x] = grid[x] || [];
          grid[x][from[1]] = "#";
        }

        grid[to[0]] = grid[to[0]] || [];
        grid[to[0]][from[1]] = "#";
      }

      if (from[1] !== to[1]) {
        for (let y = from[1]; y !== to[1]; y += Math.sign(to[1] - from[1])) {
          grid[from[0]] = grid[from[0]] || [];
          grid[from[0]][y] = "#";
        }

        grid[from[0]] = grid[from[0]] || [];
        grid[from[0]][to[1]] = "#";

      }
    }
  }

  let grains = {};
  while (true) {
    let grain = [500, 0];

    while (true) {
      const gridBelowEmpty =
        ((grid[grain[0]] || [])[grain[1] + 1] || ".") === ".";
      const grainBelowEmpty = !grains[grain[0] + "," + (grain[1] + 1)];
      const gridLeftBelowEmpty =
        ((grid[grain[0] - 1] || [])[grain[1] + 1] || ".") === ".";
      const grainLeftBelowEmpty = !grains[grain[0] - 1 + "," + (grain[1] + 1)];
      const gridRightBelowEmpty =
        ((grid[grain[0] + 1] || [])[grain[1] + 1] || ".") === ".";
      const grainRightBelowEmpty = !grains[grain[0] + 1 + "," + (grain[1] + 1)];

      if (gridBelowEmpty && grainBelowEmpty) {
        grain[1]++;
      } else if (gridLeftBelowEmpty && grainLeftBelowEmpty) {
        grain[0]--;
        grain[1]++;
      } else if (gridRightBelowEmpty && grainRightBelowEmpty) {
        grain[0]++;
        grain[1]++;
      } else {
        break;
      }

      if (grain[1] === bounds.h + 1) {
        break;
      }
    }

    if (grain[0] !== 500 || grain[1] !== 0) {
      grains[grain[0] + "," + grain[1]] = true;
    } else {
      return Object.keys(grains).length + 1;
    }
  }
}

console.log(`Part1: ${part1()}`);
console.log(`Part2: ${part2()}`);

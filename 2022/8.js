const fs = require("fs");
const {
  sum,
  groupBy,
  toKeyValue,
  intersect,
  distinct,
  iterateTwoDimArray,
} = require("../utils");

const input = fs
  .readFileSync("8.txt")
  .toString()
  .trim()
  .split("\n")
  .map((x) => x.trim().split(""));

function isVisible(x, y, grid) {
  if (x == 0 || y == 0 || x == grid[0].length - 1 || y == grid.length - 1) {
    return true;
  }

  let val = grid[y][x];

  let v = true;
  for (let i = 0; i < x; i++) {
    if (grid[y][i] >= val) {
      v = false;
      break;
    }
  }

  if (v) {
    return true;
  }

  v = true;
  for (let i = x + 1; i < grid[0].length; i++) {
    if (grid[y][i] >= val) {
      v = false;
      break;
    }
  }

  if (v) {
    return true;
  }
 v = true;
  for (let i = 0; i < y; i++) {
    if (grid[i][x] >= val) {
      v = false;
      break;
    }
  }

  if (v) {
    return true;
  }

  v = true;
  for (let i = y+1; i < grid.length; i++) {
    if (grid[i][x] >= val) {
      v = false;
      break;
    }
  }

  if (v) {
    return true;
  }

  return false;
}

function part1() {
  let cnt = 0;
  iterateTwoDimArray(input, (val, x, y) => {


    if (isVisible(x, y, input)) {
      cnt++
    }
  });

  return cnt;
}

function scenicScore(x, y, grid) {
  let val = grid[y][x];

  let a = 0;
  for (let i = x-1; i >= 0; i--) {
    a++;
    if (grid[y][i] >= val) {
      break;
    }
  }

  let b = 0;
  for (let i = x + 1; i < grid[0].length; i++) {
    b++;
    if (grid[y][i] >= val) {
      break;
    }
  }


  let c = 0;
  for (let i = y - 1; i >= 0; i--) {
    c++;
    if (grid[i][x] >= val) {
      break
    }
  }

  let d = 0;
  for (let i = y + 1; i < grid.length; i++) {
    d++;
    if (grid[i][x] >= val) {
      break
    }
  }

  return a * b * c * d;
}

function part2() {
  let score = 0;
  iterateTwoDimArray(input, (val, x, y) => {
    let s = scenicScore(x, y, input)
    if (s > score) {
      score = s;
    }
  });

  return score;
}

console.log(`Part1: ${part1()}`);
console.log(`Part2: ${part2()}`);

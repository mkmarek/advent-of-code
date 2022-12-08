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

function getTrees(x, y, input) {
  return [
    input[y].slice(0, x).reverse(),
    input[y].slice(x + 1),
    input
      .map((v) => v[x])
      .slice(0, y)
      .reverse(),
    input.map((v) => v[x]).slice(y + 1),
  ];
}

function part1() {
  let cnt = 0;
  iterateTwoDimArray(input, (val, y, x) => {
    if (getTrees(x, y, input).some((e) => e.every((v) => v < val))) {
      cnt++;
    }
  });

  return cnt;
}

function part2() {
  let score = 0;
  iterateTwoDimArray(input, (val, y, x) => {
    let s = getTrees(x, y, input).reduce((p, c) => {
      const biggerIndex = c.findIndex((v) => v >= val);
      if (biggerIndex === -1) {
        return p * c.length;
      }

      return p * (biggerIndex + 1);
    }, 1);

    if (s > score) {
      score = s;
    }
  });

  return score;
}

console.log(`Part1: ${part1()}`);
console.log(`Part2: ${part2()}`);

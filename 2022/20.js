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
  .readFileSync("20.txt")
  .toString()
  .trim()
  .split("\n")
  .map((e) => Number(e.trim()));

function placeIndex(arr, i, j) {
  if (i < j) {
    let tmp = arr[i];
    for (let x = i; x < j; x++) {
      arr[x] = arr[x + 1];
    }
    arr[j] = tmp;
  }

  if (i > j) {
    let tmp = arr[i];
    for (let x = i; x > j; x--) {
      arr[x] = arr[x - 1];
    }
    arr[j] = tmp;
  }
}

function part1() {
  const indexes = [];
  for (let i = 0; i < input.length; i++) {
    indexes.push(i);
  }

  for (let i = 0; i < input.length; i++) {
    let idx1 = indexes.indexOf(i);

    let num = input[i];
    let wrapArounds = Math.abs(Math.floor(num / input.length));
    if (num < 0) {
      num = num + input.length * wrapArounds - wrapArounds;
    }

    num = idx1 + num;
    wrapArounds = Math.abs(Math.floor(num / input.length));
    if (num >= input.length) {
      num = num - input.length * wrapArounds + wrapArounds;
    }

    const idx2 = num;

    placeIndex(indexes, idx1, idx2);
  }

  const result = indexes.map((e) => input[e]);
  const zeroLoc = result.indexOf(0);

  return (
    result[(zeroLoc + 1000) % input.length] +
    result[(zeroLoc + 2000) % input.length] +
    result[(zeroLoc + 3000) % input.length]
  );
}

function part2() {
  const indexes = [];

  for (let z = 0; z < 10; z++) {
    for (let i = 0; i < input.length; i++) {
      indexes.push(i);
    }

    for (let i = 0; i < input.length; i++) {
      let idx1 = indexes.indexOf(i);

      let num = input[i] * 811589153;
      while (num < 0) {
        let wrapArounds = Math.abs(Math.floor(num / input.length));
        num = num + input.length * wrapArounds - wrapArounds;
      }

      num = idx1 + num;
      while (num >= input.length) {
        wrapArounds = Math.abs(Math.floor(num / input.length));
        num = num - input.length * wrapArounds + wrapArounds;
      }

      const idx2 = num;

      placeIndex(indexes, idx1, idx2);
    }
  }

  const result = indexes.map((e) => input[e] * 811589153);
  const zeroLoc = result.indexOf(0);

  return (
    result[(zeroLoc + 1000) % input.length] +
    result[(zeroLoc + 2000) % input.length] +
    result[(zeroLoc + 3000) % input.length]
  );
}

console.log(`Part1: ${part1()}`);
console.log(`Part2: ${part2()}`);

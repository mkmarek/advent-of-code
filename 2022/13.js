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
  .readFileSync("13.txt")
  .toString()
  .trim()
  .split("\r\n\r\n")
  .map((e) => e.split("\n").map((e) => JSON.parse(e.trim())));

function isRightOrder(left, right) {
  for (let j = 0; j < Math.max(left.length, right.length); j++) {
    if (left.length == j) return true;
    if (right.length == j) return false;

    if (typeof left[j] === "number" && typeof right[j] === "number") {
      if (left[j] < right[j]) return true;
      if (left[j] > right[j]) return false;
    }

    if (Array.isArray(left[j]) && Array.isArray(right[j])) {
      const val = isRightOrder(left[j], right[j]);

      if (val === true || val === false) return val;
    }

    if (typeof left[j] === "number" && Array.isArray(right[j])) {
      const val = isRightOrder([left[j]], right[j]);
      if (val === true || val === false) return val;
    }

    if (Array.isArray(left[j]) && typeof right[j] === "number") {
      const val = isRightOrder(left[j], [right[j]]);
      if (val === true || val === false) return val;
    }
  }
}

function part1() {
  let cnt = 0;
  for (let i = 0; i < input.length; i++) {
    let pair = input[i];

    let [left, right] = pair;
    if (isRightOrder(left, right)) {
      cnt += i + 1;
    }
  }

  return cnt;
}

function part2() {
  const packets = input
    .reduce((p, c) => [...p, ...c], [])
    .sort((a, b) => (isRightOrder(a, b) ? -1 : 1));

  let product = 1;
  for (let i = 0; i < packets.length; i++) {
    if (JSON.stringify(packets[i]) === "[[2]]" || JSON.stringify(packets[i]) === "[[6]]") {
      product *= i + 1;
    }
  }

  return product;
}

console.log(`Part1: ${part1()}`);
console.log(`Part2: ${part2()}`);

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
  .readFileSync("15.txt")
  .toString()
  .trim()
  .split("\n")
  .map((e) => ({
    sensor: {
      x: parseInt(e.split(" ")[2].split("=")[1]),
      y: parseInt(e.split(" ")[3].split("=")[1]),
    },
    beacon: {
      x: parseInt(e.split(" ")[8].split("=")[1]),
      y: parseInt(e.split(" ")[9].split("=")[1]),
    },
  }));

function joinRanges(ranges) {
  let result = [];
  for (let range of ranges) {
    let last = result[result.length - 1];
    if (last && last.xTo + 1 >= range.xFrom) {
      last.xTo = Math.max(last.xTo, range.xTo);
    } else {
      result.push(range);
    }
  }
  return result;
}

function getNonExistingRange(row) {
  const distances = input.map((e) => ({
    x: e.sensor.x,
    y: e.sensor.y,
    radius:
      Math.abs(e.sensor.x - e.beacon.x) + Math.abs(e.sensor.y - e.beacon.y),
  }));

  return joinRanges(
    distances
      .map((e) => ({
        xFrom: e.x - (e.radius - Math.abs(e.y - row)),
        xTo: e.x + (e.radius - Math.abs(e.y - row)),
      }))
      .filter((e) => e.xFrom <= e.xTo)
      .sort((a, b) => a.xFrom - b.xFrom)
  );
}

function part1() {
  return getNonExistingRange(2000000).reduce(
    (p, x) => p + (x.xTo - x.xFrom),
    0
  );
}

function part2() {
  for (let row = 0; row < 4000000; row++) {
    const ranges = getNonExistingRange(row);
    if (ranges.length > 1) {
      return (ranges[0].xTo + 1) * 4000000 + row;
    }
  }
}

console.log(`Part1: ${part1()}`);
console.log(`Part2: ${part2()}`);

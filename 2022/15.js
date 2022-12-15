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

function manhattanDistance(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function getPointsInManhattanDistance(position, distance) {
  const points = [];
  for (let x = position.x - distance; x <= position.x + distance; x++) {
    for (let y = position.y - distance; y <= position.y + distance; y++) {
      if (manhattanDistance(position, { x, y }) <= distance) {
        points.push({ x, y });
      }
    }
  }
  return points;
}

const input = fs
  .readFileSync("15.txt")
  .toString()
  .trim()
  .split("\n")
  //Sensor at x=2, y=18: closest beacon is at x=-2, y=15
  .map((e) => ({
    sensor: { x: parseInt(e.split(' ')[2].split('=')[1]), y: parseInt(e.split(' ')[3].split('=')[1]) },
    beacon: { x: parseInt(e.split(' ')[8].split('=')[1]), y: parseInt(e.split(' ')[9].split('=')[1]) },
  }));

function getNonExistingRange(row) {
  const distances = input.map(e => ({
    sensor: e.sensor,
    beacon: e.beacon,
    freeRadius: manhattanDistance(e.sensor, e.beacon)
  }));
  
  let d = distances.map(e => ({
    ydistance: Math.abs(e.sensor.y - row),
    radius: Math.max(0, e.freeRadius - Math.abs(e.sensor.y - row)),
    xBeacon: e.sensor.x,
    xFrom: e.sensor.x - Math.abs(e.freeRadius - Math.abs(e.sensor.y - row)),
    xTo: e.sensor.x + Math.abs(e.freeRadius - Math.abs(e.sensor.y - row)),
  })).filter(e => e.radius > 0).sort((a, b) => a.xFrom - b.xFrom);

  let ranges = [];
  for (let g of d) {
    let range = ranges.find(e => e.xFrom <= g.xFrom && e.xTo >= g.xFrom);
    if (range) {
      range.xTo = Math.max(range.xTo, g.xTo);
    } else {
      ranges.push({ xFrom: g.xFrom, xTo: g.xTo } );
    }
  }

  return ranges;
}

function part1() {
  const ranges = getNonExistingRange(10);
  return ranges.reduce((p, x) => p + (x.xTo - x.xFrom), 0);
}

function part2() {
  for (let row = 0; row < 4000000; row++) {
    const ranges = getNonExistingRange(row);
    if (ranges.length > 1 && ranges[0].xTo !== ranges[1].xFrom) {
      return (ranges[0].xTo + 1) * 4000000 + row;
    }
  }
}

console.log(`Part1: ${part1()}`);
console.log(`Part2: ${part2()}`);

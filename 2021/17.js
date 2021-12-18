const fs = require("fs");
const { deepCopy, getNeighbors, distinct } = require("../utils");

const data = fs
  .readFileSync("17.txt")
  .toString()
  .trim()
  .substring("target area: ".length)
  .split(", ")
  .reduce(
    (acc, line) => {
      const parts = line.split("=");
      if (parts[0] == "x") {
        acc.x = parts[1].split("..").map((x) => parseInt(x));
      }
      if (parts[0] == "y") {
        acc.y = parts[1].split("..").map((x) => parseInt(x));
      }
      return acc;
    },
    { x: [], y: [] }
  );

function endsUpInTargetArea(initialVelocity, target) {
  let position = { x: 0, y: 0 };
  let velocity = { ...initialVelocity };
  let maxY = 0;

  while (true) {
    position.x += velocity.x;
    position.y += velocity.y;

    if (position.y > maxY) maxY = position.y;

    if (velocity.x !== 0) velocity.x += velocity.x > 0 ? -1 : 1;

    velocity.y -= 1;

    if (position.x >= target.x[0] && position.x <= target.x[1] && position.y >= target.y[0] && position.y <= target.y[1] ) return [true, maxY];

    if (position.y < target.y[0]) {
      return [false, maxY];
    }
    if (position.x > target.x[1]) {
      return [false, maxY];
    }
    if (position.x < target.x[0] && velocity.x === 0) {
      return [false, maxY];
    }
  }
}

function part1(input) {
  let maxY = 0;
  for (let x = 0; x < 1000; x++) {
    for (let y = 0; y < 1000; y++) {
      const result = endsUpInTargetArea({ x: x, y: y }, input);
      if (result[0] && result[1] > maxY) maxY = result[1];
    }
  }
  return maxY;
}

function part2(input) {
  let velocities = [];
  for (let x = 0; x < 1000; x++) {
    for (let y = -1000; y < 1000; y++) {
      const result = endsUpInTargetArea({ x: x, y: y }, input);
      if (result[0]) velocities.push({ x: x, y: y });
    }
  }
  return distinct(velocities).length;
}

console.log(`Part1: ${part1(deepCopy(data))}`);
console.log(`Part2: ${part2(deepCopy(data))}`);

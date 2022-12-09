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
  .readFileSync("9.txt")
  .toString()
  .trim()
  .split("\n")
  .map((x) => x.trim().split(" "));

function move(head, tail) {
  let xDiff = head.x - tail.x;
  let yDiff = head.y - tail.y;

  if (Math.abs(xDiff) == 1 && Math.abs(yDiff) > 1) {
    tail.x += Math.sign(xDiff);
    tail.y += Math.sign(yDiff);
  } else if (Math.abs(xDiff) > 1 && Math.abs(yDiff) == 1) {
    tail.x += Math.sign(xDiff);
    tail.y += Math.sign(yDiff);
  } else {
    for (let j = 0; j < Math.abs(xDiff)-1; j++) {
      tail.x += Math.sign(xDiff);
    }

    for (let j = 0; j < Math.abs(yDiff)-1; j++) {
      tail.y += Math.sign(yDiff);
    }
  }
}

function part1() {
  let pos = [];
  let head = { x: 0, y: 0 };
  let tail = { x: 0, y: 0 };

  pos.push({ x: tail.x, y: tail.y });

  for (let i = 0; i < input.length; i++) {
    switch (input[i][0]) {
      case "R":
        for (let j = 0; j < parseInt(input[i][1]); j++) {
          head.x++;
          move(head, tail, pos);
          pos.push({ x: tail.x, y: tail.y });
        }
        break;
      case "L":
        for (let j = 0; j < parseInt(input[i][1]); j++) {
          head.x--;
          move(head, tail, pos);
          pos.push({ x: tail.x, y: tail.y });
        }
        break;
      case "U":
        for (let j = 0; j < parseInt(input[i][1]); j++) {
          head.y++;
          move(head, tail, pos);
          pos.push({ x: tail.x, y: tail.y });
        }

        break;
      case "D":
        for (let j = 0; j < parseInt(input[i][1]); j++) {
          head.y--;
          move(head, tail, pos);
          pos.push({ x: tail.x, y: tail.y });
        }
        break;
    }
  }

  return distinct(pos).length;
}

function part2() {
  let pos = [];
  let parts = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ]

  let head = parts[0];
  let tail = parts[parts.length - 1];

  pos.push({ x: tail.x, y: tail.y });

  for (let i = 0; i < input.length; i++) {
    switch (input[i][0]) {
      case "R":
        for (let j = 0; j < parseInt(input[i][1]); j++) {
          head.x++;
          for (let b = 0; b < parts.length - 1; b++) {
            move(parts[b], parts[b + 1], pos);
          }
          pos.push({ x: tail.x, y: tail.y });
        }
        break;
      case "L":
        for (let j = 0; j < parseInt(input[i][1]); j++) {
          head.x--;
          for (let b = 0; b < parts.length - 1; b++) {
            move(parts[b], parts[b + 1], pos);
          }
          pos.push({ x: tail.x, y: tail.y });
        }
        break;
      case "U":
        for (let j = 0; j < parseInt(input[i][1]); j++) {
          head.y++;
          for (let b = 0; b < parts.length - 1; b++) {
            move(parts[b], parts[b + 1], pos);
          }
          pos.push({ x: tail.x, y: tail.y });
        }

        break;
      case "D":
        for (let j = 0; j < parseInt(input[i][1]); j++) {
          head.y--;
          for (let b = 0; b < parts.length - 1; b++) {
            move(parts[b], parts[b + 1], pos);
          }
          pos.push({ x: tail.x, y: tail.y });
        }
        break;
    }
  }

  return distinct(pos).length;
}

console.log(`Part1: ${part1()}`);
console.log(`Part2: ${part2()}`);

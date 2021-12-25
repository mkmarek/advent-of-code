const fs = require("fs");

function parseInput() {
  const data = fs
    .readFileSync("25.txt")
    .toString()
    .trim()
    .split("\r\n")
    .filter((e) => e)
    .map((e) => e.split(""));

  return data;
}

function move(input, char, direction) {
  let output = [];
  for (let y = 0; y < input.length; y++) {
    if (!output[y]) output[y] = [];
    for (let x = 0; x < input[y].length; x++) {
      output[y][x] = input[y][x] !== char ? input[y][x] : ".";
    }
  }

  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      if (input[y][x] === char) {
        let [dstX, dstY] = [x + direction[0], y + direction[1]];
        if (dstX >= input[y].length) {
          dstX = 0;
        }
        if (dstY >= input.length) {
          dstY = 0;
        }

        if (input[dstY][dstX] === ".") {
          output[dstY][dstX] = char;
        } else {
          output[y][x] = char;
        }
      }
    }
  }

  return output;
}

function isTheSame(a, b) {
  for (let y = 0; y < a.length; y++) {
    for (let x = 0; x < b[y].length; x++) {
      if (a[y][x] !== b[y][x]) {
        return false;
      }
    }
  }
  return true;
}

function solve(input) {
  let curr = input;
  let index = 0;
  while (true) {
    const next = move(move(curr, ">", [1, 0]), "v", [0, 1]);
    if (isTheSame(next, curr)) {
      return index + 1;
    }

    index++;
    curr = next;
  }
}

console.log(`Result: ${solve(parseInput())}`);

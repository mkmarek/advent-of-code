const fs = require("fs");
const { deepCopy, getNeighbors, distinct, sum } = require("../utils");

function parseInput() {
  const data = fs
    .readFileSync("20.txt")
    .toString()
    .trim()
    .split("\n")
    .map((e) => e.trim());

  let enhancement = "";
  const input = [];

  let doenhancement = 1;

  for (let line of data) {
    if (line === "") {
      doenhancement = 0;
      continue;
    }
    if (doenhancement === 1) {
      enhancement += line;
    } else {
      input.push(line.split(""));
    }
  }

  return [enhancement, input];
}

function getIndex(input, x, y, background) {
  let output = "";

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (!input[i + x]) {
        output += background === "#" ? "1" : "0";
        continue;
      }

      if (!input[i + x][j + y]) {
        output += background === "#" ? "1" : "0";
        continue;
      }

      input[i + x][j + y] === "#" ? (output += "1") : (output += "0");
    }
  }

  return parseInt(output, 2);
}

function enhance(
  input,
  enhancement,
  x1,
  x2,
  y1,
  y2,
  background = "."
) {
  let output = [];
  for (let x = x1 - 1; x < x2 + 1; x++) {
    for (let y = y1 - 1; y < y2 + 1; y++) {
      const index = getIndex(input, x - 1, y - 1, background);

      if (!output[x]) {
        output[x] = [];
      }

      output[x][y] = enhancement[index];
    }
  }
  return [output, x1 - 1, x2 + 1, y1 - 1, y2 + 1];
}

function solve(enhancement, input, turns) {
  let x1 = 0;
  let x2 = input.length;
  let y1 = 0;
  let y2 = input[0].length;

  let background = ".";
  for (let i = 0; i < turns; i++) {
    const [output, _x1, _x2, _y1, _y2] = enhance(
      input,
      enhancement,
      x1,
      x2,
      y1,
      y2,
      1,
      background
    );
    input = output;
    x1 = _x1;
    x2 = _x2;
    y1 = _y1;
    y2 = _y2;

    background =
      enhancement[
        getIndex(
          [
            [background, background, background],
            [background, background, background],
            [background, background, background],
          ],
          0,
          0,
          background
        )
      ];
  }

  let lit = 0;
  for (let x = x1; x < x2; x++) {
    for (let y = y1; y < y2; y++) {
      if (!input[x] || !input[x][y]) {
        continue;
      }
      if (input[x][y] === "#") {
        lit++;
      }
    }
  }

  return lit;
}

function part1([enhancement, input]) {
  return solve(enhancement, input, 2);
}

function part2([enhancement, input]) {
  return solve(enhancement, input, 50);
}

console.log(`Part1: ${part1(parseInput())}`);
console.log(`Part2: ${part2(parseInput())}`);

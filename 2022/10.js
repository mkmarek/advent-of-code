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
  .readFileSync("10.txt")
  .toString()
  .trim()
  .split("\n")
  .map((x) => x.trim().split(" "));

function part1() {
  let reg = 1;
  let cycle = 1;
  let res = [];

  for (let i = 0; i < input.length; i++) {
    if (input[i][0] == "noop") {
      cycle++
    } else if (input[i][0] == "addx") {
      let n = Number(input[i][1]);
      cycle += 1;

      if ([20, 60, 100, 140, 180, 220].includes(cycle)) {
        res.push(reg * cycle);
      }
      reg += n;

      cycle += 1;
    } else {
      throw new Error('fdsfs')
    }

    if ([20, 60, 100, 140, 180, 220].includes(cycle)) {
      res.push(reg * cycle);
    }
  }

  return sum(res)
}

function part2() {
  let reg = 1;
  let cycle = 1;
  let res = [];

  for (let i = 0; i < input.length; i++) {
    if (input[i][0] == "noop") {
      cycle++
    } else if (input[i][0] == "addx") {
      let n = Number(input[i][1]);
      cycle += 1;
      let line = Math.floor(cycle / 40)
      let pos = cycle % 40;
  
      if (res[line] == undefined) {
        res[line] = new Array(41).join('.');
      }
  
      if ((pos-1) <= (reg % 40) + 1 && (pos-1) >= (reg % 40) - 1) {
        let s = res[line].split('');
        s[pos - 1] = '#';
  
        res[line] = s.join('');
      }

      reg += n;
      cycle += 1;
    } else {
      throw new Error('fdsfs')
    }

    let line = Math.floor(cycle / 40)
    let pos = cycle % 40;

    if (res[line] == undefined) {
      res[line] = new Array(41).join('.');
    }

    if ((pos-1) <= (reg % 40) + 1 && (pos-1) >= (reg % 40) - 1) {
      let s = res[line].split('');
      s[pos - 1] = '#';

      res[line] = s.join('');
    }
  }

  return '\n' + res.join('\n');
}

console.log(`Part1: ${part1()}`);
console.log(`Part2: ${part2()}`);

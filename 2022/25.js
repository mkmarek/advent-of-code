const fs = require("fs");
const PriorityQueue = require('javascript-priority-queue');
const { QuadTree, Box } = require("js-quadtree");
const { start } = require("repl");
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
  getNeighborsDiagonal,
} = require("../utils");

let input = fs
  .readFileSync("25.txt")
  .toString()
  .split("\n")
  .map((e) => e.trim());

  function printSNAFU(n) {
    let str = "";
  
    while (n > 0) {
      let digit = n % 5;
      n = Math.floor(n / 5);
      
      switch (digit) {
        case 0:
          str += "0";
          break;
        case 1:
          str += "1";
          break;
        case 2:
          str += "2";
          break;
        case 3:
          str += "=";
          n += 1;
          break;
        case 4:
          str += "-";
          n += 1;
          break;
      }
    }
      
    return str.split('').reverse().join('');
  }

function parseSNAFU(n) {
  let num = 0;

  let pow = 1;
  for (let i = n.length - 1; i >= 0; i--) {
    switch (n[i]) {
      case "0":
        num += 0 * pow;
        pow *= 5;
        break;
      case "1":
        num += 1 * pow;
        pow *= 5;
        break;
      case "2":
        num += 2 * pow;
        pow *= 5;
        break;
      case "-":
        num += -1 * pow;
        pow *= 5;
        break;
      case "=":
        num += -2 * pow;
        pow *= 5;
        break;
    }
  }

  return num;
}

function part1() {
  const s = sum(input.map(e => parseSNAFU(e)));

  return printSNAFU(s);
}

console.log(`Part 1: ${part1()}`);


const fs = require('fs');
const { sum, groupBy, toKeyValue, intersect, distinct, iterateTwoDimArray} = require('../utils');

const input = fs.readFileSync('3.txt').toString()
  .trim()
  .split('\n')
  .map(e => e.trim());

function part1() {
  let result = 0;

  for (let i = 0; i < input.length; i++) {
    let middle = (input[i].length / 2);
    let right = input[i].substring(middle);

    let m = {};
    for (let j = 0; j < middle - 1; j++) {
      let left = input[i][j];

      if (m[left]) {
        continue;
      }

      m[left] = true;

      if (right.includes(left)) {
        console.log(left);
        if (left.toLowerCase() == left) {
          result += (left.charCodeAt(0) - 96);
        } else {
          result += (left.charCodeAt(0) - 64) + 26;
        }
      }
    }
  }

  return result;
}

function part2() {
  let result = 0;

  let badge = {};
  for (let i = 0; i < input.length; i++) {
    let m = {};
    for (let j = 0; j < input[i].length; j++) {
      let left = input[i][j];

      if (m[left]) {
        continue;
      }

      m[left] = true;

      badge[left] = (badge[left] || 0) + 1;
    }

    if ((i+ 1) % 3 == 0) {
      for (let k in badge) {
        if (badge[k] < 3) {
          continue;
        }

        console.log(k);
        if (k.toLowerCase() == k) {
          result += (k.charCodeAt(0) - 96);
        } else {
          result += (k.charCodeAt(0) - 64) + 26;
        }
      }

      badge = {};
    }
  }

  return result;
}

console.log(`Part1: ${part1()}`)
console.log(`Part2: ${part2()}`)
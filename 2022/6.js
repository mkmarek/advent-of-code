const fs = require('fs');
const { sum, groupBy, toKeyValue, intersect, distinct, iterateTwoDimArray} = require('../utils');

const input = fs.readFileSync('6.txt').toString()
  .trim()

function allLastCharactersDifferent(str, num) {
  let last = str.substring(str.length - num);
  let set = new Set(last);
  return set.size === num;
}

function part1() {
  for (let i = 4; i < input.length; i++) {
    if (allLastCharactersDifferent(input.substring(i - 4, i), 4)) {
      return i
    }
  }
}

function part2() {
  for (let i = 14; i < input.length; i++) {
    if (allLastCharactersDifferent(input.substring(i - 14, i), 14)) {
      return i
    }
  }
}

console.log(`Part1: ${part1()}`)
console.log(`Part2: ${part2()}`)
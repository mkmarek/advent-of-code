const fs = require('fs');
const { sum, groupBy, toKeyValue, intersect, distinct, iterateTwoDimArray} = require('../utils');

const input = fs.readFileSync('6.txt').toString()
  .trim()

function scan(uniqueCharacterSize) {
  for (let i = uniqueCharacterSize; i < input.length; i++) {
    if (new Set(input.substring(i - uniqueCharacterSize, i)).size === uniqueCharacterSize) {
      return i
    }
  }
}

function part1() {
  return scan(4);
}

function part2() {
  return scan(14);
}

console.log(`Part1: ${part1()}`)
console.log(`Part2: ${part2()}`)
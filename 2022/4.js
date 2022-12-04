const fs = require('fs');
const { sum, groupBy, toKeyValue, intersect, distinct, iterateTwoDimArray} = require('../utils');

const input = fs.readFileSync('4.txt').toString()
  .trim()
  .split('\n')
  .map(e => e.trim().split(','));

function rangeContainsRange(a, b) {
  return a[0] <= b[0] && a[1] >= b[1];
}

function rangeOverlaps(a, b) {
  return a[0] <= b[1] && b[0] <= a[1];
}

function part1() {
  let contains = 0;

  for (let i = 0; i < input.length; i++) {
    let pairA = input[i][0].split('-').map(e => parseInt(e));
    let pairB = input[i][1].split('-').map(e => parseInt(e));

    if (rangeContainsRange(pairA, pairB) || rangeContainsRange(pairB, pairA)) {
      contains++;
    }
  }

  return contains;
}

function part2() {
  let overlaps = 0;

  for (let i = 0; i < input.length; i++) {
    let pairA = input[i][0].split('-').map(e => parseInt(e));
    let pairB = input[i][1].split('-').map(e => parseInt(e));

    if (rangeOverlaps(pairA, pairB) || rangeOverlaps(pairB, pairA)) {
      overlaps++;
    }
  }

  return overlaps;
}

console.log(`Part1: ${part1()}`)
console.log(`Part2: ${part2()}`)
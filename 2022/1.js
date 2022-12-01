const fs = require('fs');

const input = fs.readFileSync('1.txt').toString()
  .trim()
  .split('\n');

function part1() {
  let elves = [];
  let elfIndex = 0;

  for (let i = 0; i < input.length; i++) {
    if (input[i].trim() === '') {
      elfIndex++;
      continue;
    }

    elves[elfIndex] = (elves[elfIndex] || 0) + Number(input[i]);
  }

  return elves.sort((a, b) => b - a)[0];
}

function part2() {
  let elves = [];
  let elfIndex = 0;

  for (let i = 0; i < input.length; i++) {
    if (input[i].trim() === '') {
      elfIndex++;
      continue;
    }

    elves[elfIndex] = (elves[elfIndex] || 0) + Number(input[i]);
  }

  const sorted = elves.sort((a, b) => b - a);

  return sorted[0] + sorted[1] + sorted[2];
}

console.log(`Part1: ${part1()}`)
console.log(`Part2: ${part2()}`)
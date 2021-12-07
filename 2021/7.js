const fs = require('fs');

let input = fs.readFileSync('7.txt').toString().split(',').filter(e => e).map(Number);

function part1() {
    const arr = input.sort((a, b) => a - b);
    const median = arr[Math.floor((arr.length + 1) / 2)];
    return arr.reduce((a, b) => a + Math.abs(b - median), 0);
}

function part2() {
    const mean = Math.ceil(input.reduce((a, b) => a + b, 0) / input.length);

    const score = (input) => input.reduce((a, b) => a + (b / 2) * (b + 1), 0)
    return Math.min(
        score(input.map(e => Math.abs(e - mean))),
        score(input.map(e => Math.abs(e - mean + 1)))
    );
}

console.log(`Part1: ${part1()}`)
console.log(`Part2: ${part2()}`)
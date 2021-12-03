const fs = require('fs');

const input =  fs.readFileSync('2.txt').toString().split('\n')
    .map(e => ({ direction:  e.split(' ')[0].trim(), distance: parseInt(e.split(' ')[1]) }));

function part1() {
    let horizontal = 0;
    let depth = 0;
    for (const { direction, distance } of input) {
        switch (direction) {
            case 'forward': horizontal += distance; break;
            case 'down': depth += distance; break;
            case 'up': depth -= distance; break;
        }
    }

    return horizontal * depth;
}

function part2() {
    let horizontal = 0;
    let depth = 0;
    let aim = 0;
    for (const { direction, distance } of input) {
        switch (direction) {
            case 'forward': horizontal += distance; depth += aim * distance; break;
            case 'down': aim += distance; break;
            case 'up': aim -= distance; break;
        }
    }

    return horizontal * depth;
}

console.log(`Part1: ${part1()}`)
console.log(`Part2: ${part2()}`)
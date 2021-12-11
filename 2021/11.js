const fs = require('fs');
const { getNeighborsDiagonal, iterateTwoDimArray, deepCopy } = require('../utils');

const data = fs.readFileSync('11.txt').toString().split('\n').map(e => e.trim().split('').map(x => parseInt(x.trim())));

function step(input) {
    const positions = [];
    const flashed = {};

    iterateTwoDimArray(input, (_, x, y) => {
        positions.push([x, y])
    });

    while (positions.length > 0) {
        const p = positions.pop();

        if (flashed[`${p[0]}_${p[1]}`]) continue;

        input[p[0]][p[1]]++;

        if (input[p[0]][p[1]] > 9) {
            input[p[0]][p[1]] = 0;
            flashed[`${p[0]}_${p[1]}`] = true;

            positions.push(...getNeighborsDiagonal(p, input));
        }
    }

    return Object.keys(flashed).length;
}

function part1(input) {
    return new Array(100).fill(0).reduce((acc) => acc + step(input), 0);
}

function part2(input) {
    const totalOcto = input.reduce((acc, curr) => acc + curr.length, 0);

    let steps = 1;
    while (step(input) !== totalOcto) steps++;
    return steps;
}

console.log(`Part1: ${part1(deepCopy(data))}`)
console.log(`Part2: ${part2(deepCopy(data))}`)
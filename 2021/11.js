const fs = require('fs');
const { getNeighborsDiagonal, iterateTwoDimArray, deepCopy } = require('../utils');

const data = fs.readFileSync('11.txt').toString().split('\n').map(e => e.trim().split('').map(x => parseInt(x.trim())));

function simulate(input, onFlashed) {
    let toIncrease = [];
    const flashed = {};

    iterateTwoDimArray(input, (_, x, y) => {
        toIncrease.push([x, y])
    });

    while (toIncrease.length > 0) {
        const p = toIncrease.pop();

        if (flashed[`${p[0]}_${p[1]}`]) continue;

        input[p[0]][p[1]]++;

        if (input[p[0]][p[1]] > 9) {
            onFlashed(p);

            input[p[0]][p[1]] = 0;
            flashed[`${p[0]}_${p[1]}`] = true;

            toIncrease.push(...getNeighborsDiagonal(p, input).filter(n => !flashed[`${n[0]}_${n[1]}`]));
        }
    }
}

function part1(input) {
    let flashes = 0;

    for (let i = 0; i < 100; i++) {
        simulate(input, () => { flashes++ });        
    }

    return flashes;
}

function part2(input) {
    const totalOcto = input.reduce((acc, curr) => acc + curr.length, 0);

    let steps = 0;
    while (true) {
        let flashes = 0;
        simulate(input, () => { flashes++ });   
        
        if (flashes === totalOcto) {
            return steps + 1;
        }
        
        steps++;
    }
}

console.log(`Part1: ${part1(deepCopy(data))}`)
console.log(`Part2: ${part2(deepCopy(data))}`)
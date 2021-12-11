const fs = require('fs');
const { sum, groupBy, toKeyValue, distinct, intersect, getNeighbors, getNeighborsDiagonal, iterateTwoDimArray } = require('../utils');

const data = fs.readFileSync('11.txt').toString().split('\n').map(e => e.trim().split('').map(x => parseInt(x.trim())));

function part1() {
    const input = [...data.map(e => ([...e]))];
    let flashes = 0;

    for (let i = 0; i < 100; i++) {
        let flashed = {};
        let toIncrease = [];
        iterateTwoDimArray(input, (value, x, y) => {
            toIncrease.push([x, y])
        });

        while (toIncrease.length > 0) {
            let p = toIncrease.pop();
            input[p[0]][p[1]]++;

            if (input[p[0]][p[1]] > 9) {
                flashes++;
                input[p[0]][p[1]] = 0;
                flashed[`${p[0]}_${p[1]}`] = true;
                toIncrease = toIncrease.filter(e => !flashed[`${e[0]}_${e[1]}`]);

                let neighborsDiagonal = getNeighborsDiagonal(p, input);
                for (let i = 0; i < neighborsDiagonal.length; i++) {
                    let n = neighborsDiagonal[i];
                    if (!flashed[`${n[0]}_${n[1]}`]) {
                        toIncrease.push(n);
                    }
                }
            }
        }
    }

    return flashes;
}

function part2() {
    const input = [...data.map(e => ([...e]))];
    const totalOcto = input.reduce((acc, curr) => acc + curr.length, 0);

    let steps = 0;
    while (true) {
        let flashed = {};
        let toIncrease = [];
        iterateTwoDimArray(input, (value, x, y) => {
            toIncrease.push([x, y])
        });

        while (toIncrease.length > 0) {
            let p = toIncrease.pop();
            input[p[0]][p[1]]++;

            if (input[p[0]][p[1]] > 9) {
                input[p[0]][p[1]] = 0;
                flashed[`${p[0]}_${p[1]}`] = true;
                toIncrease = toIncrease.filter(e => !flashed[`${e[0]}_${e[1]}`]);

                let neighborsDiagonal = getNeighborsDiagonal(p, input);
                for (let i = 0; i < neighborsDiagonal.length; i++) {
                    let n = neighborsDiagonal[i];
                    if (!flashed[`${n[0]}_${n[1]}`]) {
                        toIncrease.push(n);
                    }
                }
            }
        }

        if (Object.keys(flashed).length === totalOcto) {
            return steps;
        }
        steps++;
    }
}

console.log(`Part1: ${part1()}`)
console.log(`Part2: ${part2() + 1}`)
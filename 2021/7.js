const fs = require('fs');

const input = fs.readFileSync('7.txt').toString().split(',').map(Number);

function part1() {
    let minCost = null;
    for (let i = 0; i < input.length; i++) {
        let cost = 0;
        for (let y = 0; y < input.length; y++) {
            cost += Math.abs(input[y] - i);
        }

        if (minCost === null || minCost > cost) {
            minCost = cost;
        }
    }

    return minCost;
}

function part2() {
    let minCost = null;
    for (let i = 0; i < input.length; i++) {
        let cost = 0;
        for (let y = 0; y < input.length; y++) {
            const d = Math.abs(input[y] - i);
            cost += (d / 2) * (d + 1)
        }

        if (minCost === null || minCost > cost) {
            minCost = cost;
        }
    }

    return minCost;
}

console.log(`Part1: ${part1()}`)
console.log(`Part2: ${part2()}`)
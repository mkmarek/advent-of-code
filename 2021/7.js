const fs = require('fs');

const input = fs.readFileSync('7.txt').toString().split(',').map(Number);

function part1() {
    let minCost = 9999999999999999;
    for (let i = 0; i < input.length; i++) {
        let cost = 0;
        for (let y = 0; y < input.length; y++) {
            cost += Math.abs(input[y] - i);
        }

        if (minCost > cost) {
            minCost = cost;
        }
    }

    return minCost;
}

function part2() {
    let minCost = 9999999999999999;
    for (let i = 0; i < input.length; i++) {
        let cost = 0;
        for (let y = 0; y < input.length; y++) {
            let c = Math.abs(input[y] - i);

            for (var v = 0; v <= c; v++) {
                cost += v;
            }
        }

        if (minCost > cost) {
            minCost = cost;
        }
    }

    return minCost;
}

console.log(`Part1: ${part1()}`)
console.log(`Part2: ${part2()}`)
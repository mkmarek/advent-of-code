const fs = require('fs');

const input =  fs.readFileSync('1.txt').toString().split('\n')
    .map(e => Number(e));

const part1 = input
    .map(e => Math.floor(e / 3) - 2)
    .reduce((a, b) => a + b, 0);

const part2 = input
    .map((fuel) => {
        let total = 0;

        while (fuel > 0) {
            fuel = Math.floor(fuel / 3) - 2;

            if (fuel > 0)
                total += fuel;
        }
        
        return total;
    })
    .reduce((a, b) => a + b, 0);

console.log(`Part 1: ${part1}`);
console.log(`Part 2: ${part2}`);
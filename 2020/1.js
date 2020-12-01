const fs = require('fs');

const input =  fs.readFileSync('1.txt').toString().split('\n')
    .map(e => Number(e));

function part1() {
    for (var i = 0; i < input.length; i++) {
        for (var y = 0; y < input.length; y++) {
            if (i === y) continue;

            if (input[i] + input[y] === 2020) return input[i] * input[y];
        }
    }
}

function part2() {
    for (var i = 0; i < input.length; i++) {
        for (var y = 0; y < input.length; y++) {
            if (i === y) continue;

            for (var z = 0; z < input.length; z++) {
                if (y === z || i === z) continue;
    
                if (input[i] + input[y]+ input[z] === 2020) return input[i] * input[y] * input[z];
            }
        }
    }
}

console.log(`Part1: ${part1()}`)
console.log(`Part2: ${part2()}`)
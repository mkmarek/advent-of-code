const fs = require('fs');

const input = fs.readFileSync('9.txt').toString().split('\n')
    .map(e => Number(e));

const preamble = 25;

function part1() {
    for (var i = 0; i < input.length; i++) {
        if (i <= preamble) continue;
        let isSum = false;

        for (var x = i - preamble - 1; x < i; x++) {
            for (var y = i - preamble - 1; y < i; y++) {
                if (x === y) continue;

                if (input[i] === input[x] + input[y]) { 
                    isSum = true;
                    break;
                }
            }

            if (isSum) break;
        }

        if (!isSum) {
            return input[i]
        }
    }

    return -1;
}

function part2() {
   const invalid = part1();

    for (var i = 0; i < input.length; i++) {
        let sum = 0;
        let found = false;
        let y = i;
        for (y = i; y < input.length;) {
            sum += input[y];

            if (sum === invalid) {
                found = true;
                break;
            }

            if (sum > invalid) {
                found = false;
                break;
            }

            y++
        }
        
        if (found) {
           let min = input[i];
           let max = input[y];

           for (let v = i; v <= y;v++) {
            if (min > input[v]) min = input[v];
            if (max < input[v]) max = input[v];
           }

           return min + max;
        }
    }

    return 0;
}

console.log(`Part1: ${part1()}`)
console.log(`Part2: ${part2()}`)
const fs = require('fs');

let input = fs.readFileSync('16.txt').toString().trim();
let signal = input.split('').map(e => Number(e.trim()));

const basePattern = [0, 1, 0, -1]

function run(multiplication) {
    let arr = new Array(signal.length * multiplication)
    for (let g = 0; g < signal.length * multiplication; g++) {
        arr[g] = signal[g % signal.length];
    }

    for (let i = 0; i < 100; i++) {
        let tmp = [];
        for (let d = arr.length - 1; d >= 0; d--) {
            let sum = 0;
            if (d > input.length / 2) {
                sum += arr[d] + (tmp[d + 1] || 0);
                tmp[d] = Math.abs(sum) % 10;
            } else {
                let basePatternOffset = 1;
                for (let x = d; x < input.length;) {
                    let num = basePattern[basePatternOffset++ % basePattern.length];
                    if (num == 0) { x += d + 1; continue; }
                    else if (num == 1) { 
                        for (let h = 0; h <= d && x < input.length; h++) {
                            sum += arr[x++] * num;
                        }
                    } else if (num == -1) { 
                        for (let h = 0; h <= d && x < input.length; h++) {
                            sum += arr[x++] * num;
                        }
                    }
                }
                tmp[d] = Math.abs(sum) % 10;
            }
        }
        arr = tmp;
    }

    return arr;
}

console.log(`Part1: ${run(1).slice(0, 8).join('')}`)
console.log(`Part2: ${run(10000).slice(Number(input.slice(0, 7)), Number(input.slice(0, 7)) + 8).join('')}`)

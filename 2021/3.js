const fs = require('fs');

const input = fs.readFileSync('3.txt').toString().split('\n').map(e => e.trim());

function part1() {
    let gamma = '';
    let epsilon = '';
    const numberOfBits = input[0].length;

    for (let i = 0; i < numberOfBits; i++) {
        let b = mostCommonBit(i, input);

        if (b === '0') {
            gamma += '0';
            epsilon += '1';
        } else {
            gamma += '1';
            epsilon += '0';
        }
    }

    return parseInt(gamma, 2) * parseInt(epsilon, 2);
}

function mostCommonBit(n, input) {
    const bits = {};

    for (let i = 0; i < input.length; i++) {
        bits[input[i][n]] = (bits[input[i][n]] || 0) + 1;
    }

    return Object.keys(bits).reduce((a, b) => bits[a] > bits[b] ? a : b, '0');
}

function part2() {
    const numberOfBits = input[0].length;

    let oxygenRating = [...input];
    let co2ScrubberRating = [...input];

    while (oxygenRating.length > 1) {
        for (var i = 0; i < numberOfBits; i++) {
            let common = mostCommonBit(i, oxygenRating);
            oxygenRating = oxygenRating.filter(e => e[i] === common);
            if (oxygenRating.length === 1) {
                break;
            }
        }
    }

    while (co2ScrubberRating.length > 1) {
        for (var i = 0; i < numberOfBits; i++) {
            let common = mostCommonBit(i, co2ScrubberRating) == '0' ? '1' : '0';
            co2ScrubberRating = co2ScrubberRating.filter(e => e[i] === common);
            if (co2ScrubberRating.length === 1) {
                break;
            }
        }
    }

    return parseInt(oxygenRating[0], 2) * parseInt(co2ScrubberRating[0], 2);
}

console.log(`Part1: ${part1()}`)
console.log(`Part2: ${part2()}`)
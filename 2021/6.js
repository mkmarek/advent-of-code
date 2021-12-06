const fs = require('fs');

const input = fs.readFileSync('6.txt').toString().split(',').map(Number);

function part1() {
    return simulateDays(80);
}

function part2() {
    return simulateDays(256);
}

function simulateDays(days)
{
    let numberMap = input.reduce((acc, curr) => ({
        ...acc,
        [curr]: (acc[curr] || 0) + 1
    }) , {});

    for (let d = 0; d < days; d++) {
        const keys = Object.keys(numberMap);
        let newNumberMap = {}

        for (let i = 0; i < keys.length; i++) {
            let n = Number(keys[i]);
            if (n !== 0) {
                newNumberMap[`${n - 1}`] = numberMap[`${n}`] 
            }
        }

        newNumberMap['8'] = (newNumberMap['8'] || 0) + (numberMap['0'] || 0)
        newNumberMap['6'] = (newNumberMap['6'] || 0) + (numberMap['0'] || 0)

        numberMap = newNumberMap;
    }

    return Object.keys(numberMap).reduce((acc, curr) => acc + numberMap[curr], 0);
}

console.log(`Part1: ${part1()}`)
console.log(`Part2: ${part2()}`)
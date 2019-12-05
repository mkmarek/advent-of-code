const fs = require('fs');

const input = fs.readFileSync('5.txt').toString().split(',')
    .map(e => e.trim()).map(e => Number(e));

function runProgram(instructions, input) {
    for (let i = 0; i < instructions.length;) {
        let str = instructions[i].toString().padStart(4, '0');

        const opCode = Number(str.substring(2, 4));
        const modeParam1 = str.substring(1, 2);
        const modeParam2 = str.substring(0, 1);

        let a = modeParam1 === '0'
            ? instructions[instructions[i + 1]]
            : instructions[i + 1]

        let b = modeParam2 === '0'
            ? instructions[instructions[i + 2]]
            : instructions[i + 2]

        switch (opCode) {
            case 1: instructions[instructions[i + 3]] = a + b; i += 4; break;
            case 2: instructions[instructions[i + 3]] = a * b; i += 4; break;
            case 3: instructions[instructions[i + 1]] = input; i += 2; break;
            case 4: console.log(instructions[instructions[i + 1]]); i += 2; break;
            case 5: if (a !== 0) i = b; else i += 3; break;
            case 6: if (a === 0) i = b; else i += 3; break;
            case 7: if (a < b) instructions[instructions[i + 3]] = 1; else { instructions[instructions[i + 3]] = 0; } i += 4; break;
            case 8: if (a === b) instructions[instructions[i + 3]] = 1; else instructions[instructions[i + 3]] = 0; i += 4; break;
            case 99: return;
        }
    }
}

console.log('Part 1')
runProgram([...input], 1);

console.log('Part 2')
runProgram([...input], 5);
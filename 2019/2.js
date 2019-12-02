const fs = require('fs');

const input = fs.readFileSync('2.txt').toString().split(',')
    .map(e => Number(e));

function runProgram(instructions, a, b) {

    instructions[1] = a;
    instructions[2] = b;

    for (let i = 0; i < instructions.length; i += 4) {
        switch (instructions[i]) {
            case 1: instructions[instructions[i + 3]] = instructions[instructions[i + 1]] + instructions[instructions[i + 2]]; break;
            case 2: instructions[instructions[i + 3]] = instructions[instructions[i + 1]] * instructions[instructions[i + 2]]; break;
            case 99: return instructions[0];
        }
    }

    return instructions[0];
}

console.log(`Part1: ${runProgram([...input], 12, 2)}`)

for (let a = 0; a < 100; a++) {
    for (let b = 0; b < 100; b++) {
        if (runProgram([...input], a, b) === 19690720) {
            console.log(`Part2: ${a * 100 + b}`)
            return;
        };
    }
}
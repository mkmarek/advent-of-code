const fs = require('fs');

const input = fs.readFileSync('9.txt').toString().split(',')
    .map(e => Number(e.trim()));

function runProgram(instructions, input) {

    let relativeBase = 0;
    let i = 0;
    let inputCursor = 0;

    function getAddress(idx, mode) {
        if (mode === '0') return instructions[i + idx];
        if (mode === '1') return i + idx;
        if (mode === '2') return instructions[i + idx] + relativeBase;

        throw new Error(`Invalid mode ${mode}`);
    }
    
    function next(additionalInput) {
        input = [...input, additionalInput];
        let output = 0;
        for (; i < instructions.length;) {

            const str = instructions[i].toString().padStart(5, '0');
            const opCode = Number(str.substring(3, 5));
            const addressA = getAddress(1, str[2]);
            const addressB = getAddress(2, str[1]);
            const addressC = getAddress(3, str[0]);

            switch (opCode) {
                case 1: instructions[addressC] = instructions[addressA] + instructions[addressB]; i += 4; break;
                case 2: instructions[addressC] = instructions[addressA] * instructions[addressB]; i += 4; break;
                case 3:
                    if (inputCursor >= input.length) {
                        return [false, output];
                    }
                    instructions[addressA] = input[inputCursor++]; i += 2; break;
                case 4: output = instructions[addressA]; i += 2; break;
                case 5: if (instructions[addressA] !== 0) i = instructions[addressB]; else i += 3; break;
                case 6: if (instructions[addressA] === 0) i = instructions[addressB]; else i += 3; break;
                case 9: relativeBase = relativeBase + instructions[addressA];  i += 2; break;
                case 7: if (instructions[addressA] < instructions[addressB]) instructions[addressC] = 1; else { instructions[addressC] = 0; } i += 4; break;
                case 8: if (instructions[addressA] === instructions[addressB]) instructions[addressC] = 1; else instructions[addressC] = 0; i += 4; break;
                case 99: return [true, output];
                default: throw new Error(`Invalid opcode ${opCode}`);
            }
        }
    }

    return next;
}

console.log(`Part1: ${runProgram(input, [])(1)[1]}`);
console.log(`Part2: ${runProgram(input, [])(2)[1]}`);

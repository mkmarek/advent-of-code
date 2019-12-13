const fs = require('fs');

const input = fs.readFileSync('13.txt').toString().split(',')
.map(e => Number(e.trim()));

function runProgram(instructions, input) {

    let relativeBase = 0;
    let inputCursor = 0;
    let i = 0;

    function getAddress(idx, mode) {
        if (mode === '0') return instructions[i + idx];
        if (mode === '1') return i + idx;
        if (mode === '2') return instructions[i + idx] + relativeBase;

        throw new Error(`Invalid mode ${mode}`);
    }
    
    function next(additionalInput) {
        if (additionalInput != null) {
            input = [...input, additionalInput];
        }
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
                    instructions[addressA] = additionalInput; i += 2; break;
                case 4: output = instructions[addressA]; i += 2; return [false, output]; break;
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


let prog = runProgram([...input], []);

let status = false;

screen = {};

while (!status) {
    const [s, x] = prog(0);
    const [s1, y] = prog(0);
    const [s2, tile] = prog(0);
    
    screen[`${x}_${y}`] = tile;

    status = s2;
}

console.log(`Part1: ${Object.keys(screen).filter(e => screen[e] === 2).length}`);

input[0] = 2;
let score = 0;
let ballx = null;
let paddlex = null;
status = false;
prog = runProgram([...input], []);

while (!status) {
    let input = 0;
    if (ballx != null && paddlex != null) {
        input = ballx < paddlex
            ? -1
            : ballx === paddlex ? 0 : 1
    }

    const [s, x] = prog(input);
    const [s1, y] = prog(input);
    const [s2, tile] = prog(input);
    
    if (x === -1 && y === 0) score = tile; else {
        screen[`${x}_${y}`] = tile;
        if (tile === 3) {
            paddlex = x;
        } else if (tile === 4) {
            ballx = x
        }
    };

    status = s2;
}

console.log(`Part2: ${score}`);

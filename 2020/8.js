const fs = require('fs');

const input = fs.readFileSync('8.txt').toString().split('\n')
    .map(e => ({ opcode: e.split(' ')[0].trim(), value: Number(e.split(' ')[1]) }));

function runProgram(inp) {
    const ran = [];
    let ptr = 0;
    let glb = 0;

    while (ptr < inp.length) {
        ran.push(ptr);
        switch(inp[ptr].opcode) {
            case 'acc': glb += inp[ptr].value; ptr++; break;
            case 'jmp': ptr += inp[ptr].value; break;
            case 'nop': ptr += 1; break;
        }

        if (ran.includes(ptr)) return [false, glb];
    }

    return [true, glb];
}

function part1() {
    return runProgram(input)[1];
}

function part2(bag) {
    let jumpInstructions = input.filter(e => e.opcode === 'jmp');

    for (let jmp of jumpInstructions) {
        const [t, val] = runProgram(input.map(e => e === jmp ? ({ opcode: 'nop', value: e.value }): e))
        if (t) {
            return val;
        }
    }
}

console.log(`Part1: ${part1()}`)
console.log(`Part2: ${part2()}`)
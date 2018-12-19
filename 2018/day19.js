let fs = require('fs');

let input = fs.readFileSync('./inputs/19.txt').toString().split('\n').map(e => e.trim());

const operationSet = {
    addr: (a, b, c, reg) => { reg[c] = reg[a] + reg[b]; },
    addi: (a, b, c, reg) => { reg[c] = reg[a] + b; },
    mulr: (a, b, c, reg) => { reg[c] = reg[a] * reg[b]; },
    muli: (a, b, c, reg) => { reg[c] = reg[a] * b; },
    banr: (a, b, c, reg) => { reg[c] = reg[a] & reg[b]; },
    bani: (a, b, c, reg) => { reg[c] = reg[a] & b; },
    borr: (a, b, c, reg) => { reg[c] = reg[a] | reg[b]; },
    bori: (a, b, c, reg) => { reg[c] = reg[a] | b; },
    setr: (a, b, c, reg) => { reg[c] = reg[a]; },
    seti: (a, b, c, reg) => { reg[c] = a; },
    gtri: (a, b, c, reg) => { reg[c] = reg[a] > b ? 1 : 0; },
    gtir: (a, b, c, reg) => { reg[c] = a > reg[b] ? 1 : 0; },
    gtrr: (a, b, c, reg) => { reg[c] = reg[a] > reg[b] ? 1 : 0; },
    eqir: (a, b, c, reg) => { reg[c] = a == reg[b] ? 1 : 0; },
    eqri: (a, b, c, reg) => { reg[c] = b == reg[a] ? 1 : 0; },
    eqrr: (a, b, c, reg) => { reg[c] = reg[a] == reg[b] ? 1 : 0; }
}

const regs = [0, 0, 0,0,0, 0]
const instructionReg = 4;

const instructions = input.map(e => ({
    instr: e.split(' ')[0],
    a: Number(e.split(' ')[1]),
    b: Number(e.split(' ')[2]),
    c: Number(e.split(' ')[3])
}))

const getDivisors = (num) => {
    let res = [];

    for (let i = 0; i < num; i++) {
        if (num % i == 0) res.push(i);
    }
    return res;
}

while (regs[instructionReg] >= 0 && regs[instructionReg] < input.length) {
    operationSet[instructions[regs[instructionReg]].instr](
        instructions[regs[instructionReg]].a, 
        instructions[regs[instructionReg]].b,
        instructions[regs[instructionReg]].c, regs);

    regs[instructionReg]++;
}

console.log(`Answer1: ${regs[0]}`);

// part two

// const testdata = [
//     [ 0, 10550400, 0, 10551348, 35, 0 ] ,
//     [ 1, 1, 10551348, 10551348, 8, 1 ] ,
//     [ 3, 1, 5275674, 10551348, 8, 2 ] ,
//     [ 6, 1, 3517116, 10551348, 8, 3 ],
//     [ 10, 1, 2637837, 10551348, 8, 4 ],
//     [ 16, 1, 1758558, 10551348, 8, 6 ],
//     [ 25, 1, 1172372, 10551348, 8, 9 ] ,
//     [ 37, 1, 879279, 10551348, 8, 12 ] ,
//     [ 55, 1, 586186, 10551348, 8, 18 ] ,
//     [ 91, 1, 293093, 10551348, 8, 36 ] ,
// ]

let divisors = getDivisors(10551348);
let start = [ 25, 1, 1172372, 10551348, 8, 9 ];

for (let i = divisors.indexOf(start[2]); i > 0; i--) {
    start[2] = divisors[i - 1];
    start[5] = start[3] / start[2];
    start[0] += start[5];
}

console.log(`Answer2: ${start[0]}`);
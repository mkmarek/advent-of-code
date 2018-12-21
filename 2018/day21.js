let fs = require('fs');
let input = fs.readFileSync('./inputs/21.txt').toString().split('\n').map(e => e.trim());

const instructionReg = 4;

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

const instructions = input.map(e => ({
    instr: e.split(' ')[0],
    a: Number(e.split(' ')[1]),
    b: Number(e.split(' ')[2]),
    c: Number(e.split(' ')[3]),
    text: e
}))


//12446070
let regs = [0, 0, 0, 0, 0, 0]
let cntr = 0;

while (cntr++ < 50 && regs[instructionReg] >= 0 && regs[instructionReg] < input.length) {
    let prev = [...regs];
    operationSet[instructions[regs[instructionReg]].instr](
        instructions[regs[instructionReg]].a, 
        instructions[regs[instructionReg]].b,
        instructions[regs[instructionReg]].c, regs);

    console.log(`${prev[instructionReg]} - ${instructions[prev[instructionReg]].text}; ${prev} - ${regs}`);
    regs[instructionReg]++;
}
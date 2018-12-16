let fs = require('fs');

let testProgram = fs.readFileSync('./inputs/16b.txt').toString().split('\n')
    .map(e => e.trim().split(' ').map(x => Number(x)));
let input = fs.readFileSync('./inputs/16a.txt').toString().split('\n').map(e => e.trim());

let examples = [];

for (let i = 0; i < input.length; i += 4) {
    examples.push({
        before: JSON.parse(input[i].split(': ')[1]),
        after: JSON.parse(input[i + 2].split(': ')[1]),
        oper: input[i + 1].split(' ').map(e => Number(e))
    })
}

const addr = (a, b, c, reg) => {
    reg[c] = reg[a] + reg[b];
}

const addi = (a, b, c, reg) => {
    reg[c] = reg[a] + b;
}

const mulr = (a, b, c, reg) => {
    reg[c] = reg[a] * reg[b];
}

const muli = (a, b, c, reg) => {
    reg[c] = reg[a] * b;
}

const banr = (a, b, c, reg) => {
    reg[c] = reg[a] & reg[b];
}

const bani = (a, b, c, reg) => {
    reg[c] = reg[a] & b;
}

const borr = (a, b, c, reg) => {
    reg[c] = reg[a] | reg[b];
}

const bori = (a, b, c, reg) => {
    reg[c] = reg[a] | b;
}

const setr = (a, b, c, reg) => {
    reg[c] = reg[a];
}

const seti = (a, b, c, reg) => {
    reg[c] = a;
}

const gtri = (a, b, c, reg) => {
    reg[c] = reg[a] > b ? 1 : 0;
}

const gtir = (a, b, c, reg) => {
    reg[c] = a > reg[b] ? 1 : 0;
}

const gtrr = (a, b, c, reg) => {
    reg[c] = reg[a] > reg[b] ? 1 : 0;
}

const eqir = (a, b, c, reg) => {
    reg[c] = a == reg[b] ? 1 : 0;
}

const eqri = (a, b, c, reg) => {
    reg[c] = b == reg[a] ? 1 : 0;
}

const eqrr = (a, b, c, reg) => {
    reg[c] = reg[a] == reg[b] ? 1 : 0;
}

let operations = [
    addr, addi, mulr, muli, banr, bani, borr, bori, setr, seti, gtri, gtir, gtrr, eqir, eqri, eqrr
]

const operationsToOpCodes = operations.map(e => ({
    op: e,
    matchingOpCodes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
}))

const evaluateExample = (example) => {
    for (let op of operations) {
        let before = [...example.before];

        op(example.oper[1], example.oper[2], example.oper[3], before);

        let matches = true;
        for (let i = 0; i < before.length; i++) {
            if (before[i] != example.after[i]) {
                matches = false;
                break;
            }
        }

        const opToOpCodes = operationsToOpCodes.find(e => e.op == op);

        if (matches) {
            if (!example.count) {
                example.count = 1;
            } else {
                example.count++;
            }
        }

        if (!matches) {
            opToOpCodes.matchingOpCodes = opToOpCodes.matchingOpCodes.filter(e => e != example.oper[0]);
        }
    }
}

for (let e of examples) {
    evaluateExample(e);
}

let cnt = 0;
for (let e of examples) {
    if (e.count >= 3) cnt++;
}

// If there is a instruction with only single op code, remove it from all others
// and keep doing it until there is nothing to remove
let removing = false;
do {
    removing = false;
    for (let op1 of operationsToOpCodes) {
        if (op1.matchingOpCodes.length == 1) {
            for (let op2 of operationsToOpCodes) {
                if (op2.matchingOpCodes.includes(op1.matchingOpCodes[0]) && op1 != op2) {
                    op2.matchingOpCodes = op2.matchingOpCodes.filter(e => e != op1.matchingOpCodes[0]);
                    removing = true;
                }
            }
        }
    }
} while (removing)

let regs = [0, 0, 0, 0]

for (let line of testProgram) {
    const opToOpCodes = operationsToOpCodes
        .find(e => e.matchingOpCodes.includes(line[0]));

    opToOpCodes.op(line[1], line[2], line[3], regs)
}

console.log(`The number of examples with 3 or more op codes is: ${cnt}`);
console.log(`After running the example program you get: ${regs.join(' ')}`);
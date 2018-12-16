let fs = require('fs');
const exampleInput = fs.readFileSync('./inputs/16a.txt').toString().split('\n').map(e => e.trim());

const testProgram = fs.readFileSync('./inputs/16b.txt').toString().split('\n')
    .map(e => e.trim().split(' ').map(x => Number(x)));

let examples = [];

for (let i = 0; i < exampleInput.length; i += 4) {
    examples.push({
        before: JSON.parse(exampleInput[i].split(': ')[1]),
        after: JSON.parse(exampleInput[i + 2].split(': ')[1]),
        oper: exampleInput[i + 1].split(' ').map(e => Number(e))
    })
}

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

const operations = Object.keys(operationSet).map(e => operationSet[e]);

const operationsToOpCodes = operations.map(e => ({
    op: e,
    matchingOpCodes: Array.from({ length: 16 }, (_, k) => k)
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

console.log(`The number of examples with 3 or more op codes is: ${examples.filter(e => e.count >= 3).length}`);
console.log(`After running the example program you get: ${regs.join(' ')}`);
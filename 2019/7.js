const fs = require('fs');

const input = fs.readFileSync('7.txt').toString().split(',')
    .map(e => e.trim()).map(e => Number(e));

function runProgram(instructions, input) {

    let i = 0;
    let inputCursor = 0;
    
    function next(additionalInput) {
        input = [...input, additionalInput];
        let output = 0;
        for (; i < instructions.length;) {
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
                case 3:
                    if (inputCursor >= input.length) {
                        return [false, output];
                    }
                    instructions[instructions[i + 1]] = input[inputCursor++]; i += 2; break;
                case 4: output = instructions[instructions[i + 1]]; i += 2; break;
                case 5: if (a !== 0) i = b; else i += 3; break;
                case 6: if (a === 0) i = b; else i += 3; break;
                case 7: if (a < b) instructions[instructions[i + 3]] = 1; else { instructions[instructions[i + 3]] = 0; } i += 4; break;
                case 8: if (a === b) instructions[instructions[i + 3]] = 1; else instructions[instructions[i + 3]] = 0; i += 4; break;
                case 99: return [true, output];
            }
        }
    }

    return next;
}

// Taken from https://stackoverflow.com/a/20871714
const permutator = (inputArr) => {
    let result = [];

    const permute = (arr, m = []) => {
        if (arr.length === 0) {
            result.push(m)
        } else {
            for (let i = 0; i < arr.length; i++) {
                let curr = arr.slice();
                let next = curr.splice(i, 1);
                permute(curr.slice(), m.concat(next))
            }
        }
    }

    permute(inputArr)

    return result;
}

function runForSettings(settings) {
    let programs = [...Array(5)].map((_, i) => runProgram([...input], [ settings[i] ]));
    let lastOutput = 0;
    let lastState = false;

    while (!lastState) {
        for (let i = 0; i < 5; i++) {
            const [state, result] = programs[i](lastOutput);

            lastState = state;
            lastOutput = result;
        }
    }

    return lastOutput;
}

function getHighestSignal(settings) {
    let allCombinations = permutator(settings);

    let max = 0;
    for (let combination of allCombinations) {
        const result = runForSettings(combination);

        if (result > max) {
            max = result;
        }
    }

    return max;
}

console.log(`Part1: ${getHighestSignal([0, 1, 2, 3, 4])}`);
console.log(`Part2: ${getHighestSignal([5, 6, 7, 8, 9])}`);

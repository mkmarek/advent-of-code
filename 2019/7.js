const fs = require('fs');

const input = fs.readFileSync('7.txt').toString().split(',')
    .map(e => e.trim()).map(e => Number(e));

function runProgram(startIndex, inputCursor, instructions, input) {
    let outputs = [];
    for (let i = startIndex; i < instructions.length;) {
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
                    return [false, i, inputCursor, input, instructions, outputs]
                }
                instructions[instructions[i + 1]] = input[inputCursor++]; i += 2; break;
            case 4: outputs.push(instructions[instructions[i + 1]]); i += 2; break;
            case 5: if (a !== 0) i = b; else i += 3; break;
            case 6: if (a === 0) i = b; else i += 3; break;
            case 7: if (a < b) instructions[instructions[i + 3]] = 1; else { instructions[instructions[i + 3]] = 0; } i += 4; break;
            case 8: if (a === b) instructions[instructions[i + 3]] = 1; else instructions[instructions[i + 3]] = 0; i += 4; break;
            case 99: return [true, i, inputCursor, input, instructions, outputs]
        }
    }
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
    let machineStates = [...Array(5)].map(() => [false, 0, 0, [], [...input]]);
    let machineIndex = 0;
    let output = 0;

    while (machineStates.filter(e => !e[0]).length > 0) {
        let [_, instructionIndex, inputCursor, inputs, code] = machineStates[machineIndex];

        if (instructionIndex === 0 && machineIndex === 0) inputs = [settings[machineIndex], 0]
        else if (instructionIndex === 0) inputs = [settings[machineIndex], ...inputs]

        machineStates[machineIndex] = runProgram(instructionIndex, inputCursor, code, inputs);

        machineStates[(machineIndex + 1) % 5][3].push(machineStates[machineIndex][5][machineStates[machineIndex][5].length - 1]);
        machineIndex = (machineIndex + 1) % 5;
    }

    output = machineStates[4][5][0]

    return output;
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

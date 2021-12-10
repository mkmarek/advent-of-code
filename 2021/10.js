const fs = require('fs');
const { sum, groupBy, toKeyValue, distinct, intersect, getNeighbors, getNeighborsDiagonal, iterateTwoDimArray } = require('../utils');

const input = fs.readFileSync('10.txt').toString().split('\n').map(e => e.trim());

function isOpen(char) {
    return char === '(' || char === '[' || char === '{' || char === '<'
}

function getOpposite(char) {
    if (char === '(') {
        return ')'
    } else if (char === '[') {
        return ']'
    } else if (char === '{') {
        return '}'
    } else if (char === '<') {
        return '>'
    }
}

function part1() {
    const invalid = [];
    for (let i = 0; i < input.length; i++) {
        let expectedStack = []
        for (let y = 0; y < input[i].length; y++) {
            if (isOpen(input[i][y])) {
                expectedStack.push(getOpposite(input[i][y]))
            } else {
                if (expectedStack.pop() !== input[i][y]) {
                    invalid.push(input[i][y])
                    break;
                }
            }
        }
    }

    return sum(invalid, c => ({ ')': 3, ']': 57, '}': 1197, '>': 25137 }[c]));
}

function part2() {
    const scores = [];

    for (let i = 0; i < input.length; i++) {
        const expectedStack = []
        let isvalid = true;
        for (let y = 0; y < input[i].length; y++) {
            if (isOpen(input[i][y])) {
                expectedStack.push(getOpposite(input[i][y]))
            } else if (expectedStack.length > 0) {
                if (expectedStack.pop() !== input[i][y]) {
                    isvalid = false;
                    break;
                }
            }
        }

        if (isvalid) {
            expectedStack.reverse()
            scores.push(expectedStack.reduce((acc, cur) => acc * 5 + ({ ')': 1, ']': 2, '}': 3, '>': 4 }[cur]), 0));
        }
    }

    return scores.sort((a, b) => a - b)[Math.floor(scores.length /2)];
}

console.log(`Part1: ${part1()}`)
console.log(`Part2: ${part2()}`)
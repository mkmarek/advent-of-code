const fs = require('fs');
const { sum, groupBy, toKeyValue, distinct, intersect, getNeighbors, getNeighborsDiagonal, iterateTwoDimArray } = require('../utils');

const input = fs.readFileSync('10.txt').toString().split('\n').map(e => e.trim());

function isOpen(char) {
    return char === '(' || char === '[' || char === '{' || char === '<'
}

function isClose(char) {
    return char === ')' || char === ']' || char === '}' || char === '>'
}

function part1() {
    const invalid = [];
    for (let i = 0; i < input.length; i++) {
        let expectedStack = []
        for (let y = 0; y < input[i].length; y++) {
            if (isOpen(input[i][y])) {
                if (input[i][y] === '(') {
                    expectedStack.push(')')
                } else if (input[i][y] === '[') {
                    expectedStack.push(']')
                } else if (input[i][y] === '{') {
                    expectedStack.push('}')
                } else if (input[i][y] === '<') {
                    expectedStack.push('>')
                }
            } else {
                let exp = expectedStack.pop()
                if (exp !== input[i][y]) {
                    invalid.push({ char: input[i][y], index: y })
                    break;
                }
            }
        }
    }

    let sum = 0;
    for (let i = 0; i < invalid.length; i++) {
        if (invalid[i].char === ')') {
            sum += 3;
        }
        if (invalid[i].char === ']') {
            sum += 57;
        }
        if (invalid[i].char === '}') {
            sum += 1197;
        }
        if (invalid[i].char === '>') {
            sum += 25137;
        }
    }
    return sum;
}

function part2() {
    var valid = [];
    let scores = [];

    for (let i = 0; i < input.length; i++) {
        let expectedStack = []
        let isvalid = true;
        for (let y = 0; y < input[i].length; y++) {
            if (isOpen(input[i][y])) {
                if (input[i][y] === '(') {
                    expectedStack.push(')')
                } else if (input[i][y] === '[') {
                    expectedStack.push(']')
                } else if (input[i][y] === '{') {
                    expectedStack.push('}')
                } else if (input[i][y] === '<') {
                    expectedStack.push('>')
                }
            } else if (expectedStack.length > 0) {
                let exp = expectedStack.pop()
                if (exp !== input[i][y]) {
                    isvalid = false;
                    break;
                }
            }
        }
        if (isvalid) {
            let score = 0;
            expectedStack.reverse()
            for (let z = 0; z < expectedStack.length; z++) {
                score = score * 5;
                if (expectedStack[z] === ')') {
                    score += 1;
                }
                if (expectedStack[z] === ']') {
                    score += 2;
                }
                if (expectedStack[z] === '}') {
                    score += 3;
                }
                if (expectedStack[z] === '>') {
                    score += 4;
                }
            }
            scores.push(score);
        }
    }

    return scores.sort((a, b) => a - b)[Math.floor(scores.length /2)];
}

console.log(`Part1: ${part1()}`)
console.log(`Part2: ${part2()}`)
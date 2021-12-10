const fs = require('fs');
const input = fs.readFileSync('10.txt').toString().split('\n').map(e => e.trim());

const open = ['(', '[', '{', '<'];
const opposite = { '(': ')', '[': ']', '{': '}', '<': '>' }

function part1() {
    let score = 0;
    for (let i = 0; i < input.length; i++) {
        let stack = []
        for (let y = 0; y < input[i].length; y++) {
            if (open.includes(input[i][y])) {
                stack.push(opposite[input[i][y]])
            } else if (stack.pop() !== input[i][y]) {
                score += { ')': 3, ']': 57, '}': 1197, '>': 25137 }[input[i][y]];
                break;
            }
        }
    }

    return score;
}

function part2() {
    const scores = [];

    for (let i = 0; i < input.length; i++) {
        const stack = []
        for (let y = 0; y < input[i].length; y++) {
            if (open.includes(input[i][y])) {
                stack.push(opposite[input[i][y]])
            } else if (stack.length > 0 && stack.pop() !== input[i][y]) {
                break;
            }
            if (y === input[i].length - 1) {
                scores.push(stack.reverse().reduce((acc, cur) => acc * 5 + ({ ')': 1, ']': 2, '}': 3, '>': 4 }[cur]), 0));
            }
        }
    }

    return scores.sort((a, b) => a - b)[Math.floor(scores.length / 2)];
}

console.log(`Part1: ${part1()}`)
console.log(`Part2: ${part2()}`)
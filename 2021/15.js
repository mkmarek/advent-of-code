const fs = require('fs');
const { deepCopy, getNeighbors } = require('../utils');
const PriorityQueue = require('javascript-priority-queue');

const data = fs.readFileSync('15.txt').toString().split('\n').map(line => line.trim().split('').map(Number));

function findPath(input, start, end) {
    const visited = {};
    const queue = new PriorityQueue.default('min');

    queue.enqueue({ loc: start, risk: 0 }, 0);

    while (queue.size()) {
        const el = queue.dequeue();

        if (el.loc[0] === end[0] && el.loc[1] === end[1]) {
            return el;
        }

        for (const loc of getNeighbors(el.loc, input)) {
            const risk = el.risk + input[loc[0]][loc[1]];
            const locKey = `${loc[0]},${loc[1]}`;

            if (visited[locKey] && visited[locKey] <= risk) {
                continue;
            }
            
            visited[locKey] = risk;
            queue.enqueue({ loc, risk }, risk);
        }
    }

    throw new Error('Path not found')
}

function part1(input) {
    return findPath(input, [0, 0], [input[0].length - 1, input.length - 1]).risk;
}

const wrap = (n) => n > 9 ? n % 10 + 1 : n; 

function part2(input) {
    const expanded = [];
    for (let i = 0; i < input.length * 5; i++) {
        const row = [];
        const index = Math.floor(i / input.length);
        for (let j = 0; j < 5; j++) {
            row.push(...input[i % input.length].map(e => wrap(e + j)));
        }
        expanded.push(row.map(e => wrap(e + index)));
    }
 
    return findPath(expanded, [0, 0], [expanded[0].length - 1, expanded.length - 1]).risk;
}

console.log(`Part1: ${part1(deepCopy(data))}`)
console.log(`Part2: ${part2(deepCopy(data))}`)
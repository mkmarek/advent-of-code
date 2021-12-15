const fs = require('fs');
const { deepCopy, distinct, getNeighbors } = require('../utils');
const PriorityQueue = require('javascript-priority-queue');

const data = fs.readFileSync('15.txt').toString().split('\n').map(line => line.trim().split('').map(Number));

function part1(input) {
    let start = [0, 0];
    const end = [input[0].length - 1, input.length - 1];

    let visited = {};
    const queue = new PriorityQueue.default('min');
    queue.enqueue({ loc: start, risk: 0  }, 0);

    while (queue.size()) {
        const el = queue.dequeue();
        visited[`${el.loc[0]},${el.loc[1]}`] = true;

        if (el.loc[0] === 99 && el.loc[1] === 99) {
            return el.risk;
        }

        const neighbors = getNeighbors(el.loc, input).map(e => ({ loc: e, risk: el.risk + input[e[0]][e[1]] }));
        for (const n of neighbors) {
            if (visited[`${n.loc[0]},${n.loc[1]}`] && visited[`${n.loc[0]},${n.loc[1]}`] <= n.risk) {
                continue;
            }
            queue.enqueue(n, n.risk + Math.abs(end[0] - n.loc[0]) + Math.abs(end[1] - n.loc[1]));
        }
    }
}

const wrap = (n) => n > 9 ? n % 10 + 1 : n; 

function part2(input) {
    let start = [0, 0];
    let visited = {};
    const queue = new PriorityQueue.default('min');
    queue.enqueue({ loc: start, risk: 0  }, 0);

    const nn = [];
    for (let i = 0; i < input.length * 5; i++) {
        const r = [];
        let index = Math.floor(i / input.length);
        for (let j = 0; j < 5; j++) {
            r.push(...input[i % input.length].map(e => wrap(e + j)));
        }
        nn.push(r.map(e => wrap(e + index)));
    }
    input = nn;
    const end = [input.length - 1, input.length - 1];

    while (queue.size()) {
        const el = queue.dequeue();
        visited[`${el.loc[0]},${el.loc[1]}`] = true;

        if (el.loc[0] === end[0] && el.loc[1] === end[0]) {
            return el.risk;
        }

        const neighbors = getNeighbors(el.loc, input).map(e => ({ loc: e, risk: el.risk + input[e[0]][e[1]] }));
        for (const n of neighbors) {
            if (visited[`${n.loc[0]},${n.loc[1]}`] && visited[`${n.loc[0]},${n.loc[1]}`] <= n.risk) {
                continue;
            }
            queue.enqueue(n, n.risk + Math.abs(end[0] - n.loc[0]) + Math.abs(end[1] - n.loc[1]));
        }
    }
}

console.log(`Part1: ${part1(deepCopy(data))}`)
console.log(`Part2: ${part2(deepCopy(data))}`)
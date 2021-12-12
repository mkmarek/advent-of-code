const fs = require('fs');
const { deepCopy, makeGraphBidirectional } = require('../utils');

const data = fs.readFileSync('12.txt').toString().split('\n').map(line => line.trim().split('-'));

function part1(input) {
    const graph = makeGraphBidirectional(input);
    const queue = [{ last: 'start', visits: {} }];
    let pathCount = 0;

    while (queue.length) {
        const current = queue.pop();
        const nextRoutes = graph[current.last] || [];
        for (let n of nextRoutes) {
            if (n === 'start') continue;
            if (n === 'end') {
                pathCount++;
                continue;
            }
            if (n === n.toLowerCase() && current.visits[n]) continue;
            queue.push({ last: n, visits: { ...current.visits, [n]: true } });
        }
    }

    return pathCount;
}

function part2(input) {
    const graph = makeGraphBidirectional(input);
    const queue = [{ last: 'start', visits: {}, twice: false }];
    let pathCount = 0;

    while (queue.length) {
        const current = queue.pop();
        const nextRoutes = graph[current.last] || [];
        for (let n of nextRoutes) {
            if (n === 'start') continue;
            if (n === 'end') {
                pathCount++;
                continue;
            }
            const isSmall = n === n.toLowerCase();

            if (isSmall && current.visits[n] && current.twice) continue;

            if (isSmall) {
                queue.push({ last: n, visits: { ...current.visits, [n]: true }, twice: current.visits[n] || current.twice });
            } else {
                queue.push({ ...current, last: n });
            }
        }
    }

    return pathCount;
}

console.log(`Part1: ${part1(deepCopy(data))}`)
console.log(`Part2: ${part2(deepCopy(data))}`)
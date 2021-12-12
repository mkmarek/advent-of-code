const fs = require('fs');
const { deepCopy } = require('../utils');

const data = fs.readFileSync('12.txt').toString().split('\n').map(line => line.trim().split('-'));

function makeGraph(input) {
    const graph = {};
    for (const [from, to] of input) {
        if (!graph[from]) graph[from] = [];
        if (!graph[to]) graph[to] = [];

        graph[from].push(to);
        graph[to].push(from);
    }
    return graph;
}

function part1(input) {
    const graph = makeGraph(input);
    return (function walk(segment, visits = {}) {
        return graph[segment].reduce((count, next) => {
            if (next === 'start') return count;
            if (next === 'end') return count + 1;
            if (next === next.toLowerCase()) {
                if (visits[next]) return count;
                return count + walk(next, { ...visits, [next]: true });
            }
            return count + walk(next, visits);
        }, 0);
    })('start');
}

function part2(input) {
    const graph = makeGraph(input);
    return (function walk(segment, visits = {}, twice = false) {
        return graph[segment].reduce((count, next) => {
            if (next === 'start') return count;
            if (next === 'end') return count + 1;

            const isSmall = next === next.toLowerCase();
            if (isSmall && visits[next] && twice) return count;
            return count + walk(next, { ...visits, [next]: true }, (isSmall && visits[next]) || twice);
        }, 0);
    })('start');
}

console.log(`Part1: ${part1(deepCopy(data))}`)
console.log(`Part2: ${part2(deepCopy(data))}`)
const fs = require('fs');
const { sum, getNeighbors, iterateTwoDimArray, deepCopy, distinct, groupBy, intersect, toKeyValue, findPermutations } = require('../utils');

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
    const paths = [];
    const queue = [['start']];

    while (queue.length) {
        const current = queue.pop();
        const lastSegment = current[current.length - 1];

        if (lastSegment === 'end') {
            paths.push(current);
            continue;
        }

        const nextRoutes = graph[lastSegment] || [];
        for (let n of nextRoutes) {
            if (n === n.toLowerCase() && current.includes(n)) continue;
            queue.push([...current, n]);
        }
    }

    return paths.length;
}

function part2(input) {
    const graph = makeGraph(input);
    let pathCount = 0;
    const queue = [{ path: ['start'], visitingCaveTwice: false }];

    while (queue.length) {
        const current = queue.pop();
        const lastSegment = current.path[current.path.length - 1];

        if (lastSegment === 'end') {
            pathCount++;
            continue;
        }

        const nextRoutes = graph[lastSegment] || [];
        for (let n of nextRoutes) {
            if (n === 'start') continue;
            if (n === n.toLowerCase()) {
                const alreadyVisited = !!current.path.find(e => e === n);
                if (alreadyVisited && current.visitingCaveTwice) continue;
                queue.push({ path: [...current.path, n], visitingCaveTwice: current.visitingCaveTwice || alreadyVisited });
            } else {
                queue.push({ path: [...current.path, n], visitingCaveTwice: current.visitingCaveTwice });
            }
        }
    }

    return pathCount;
}

console.log(`Part1: ${part1(deepCopy(data))}`)
console.log(`Part2: ${part2(deepCopy(data))}`)
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
            let smallCavesVisited = {};
            for (let g = 0; g < current.length; g++) {
                if (current[g] !== 'start' && current[g].toLowerCase() === current[g]) {
                    smallCavesVisited[current[g]] = (smallCavesVisited[current[g]] || 0) + 1
                }
            }

            const hasSmallCaveVisitedMoreThanOnce = Object.values(smallCavesVisited).filter(v => v > 1).length > 0;

            if (n === 'start' || (n === n.toLowerCase() && (hasSmallCaveVisitedMoreThanOnce && current.filter(e => e === n).length))) continue;
            queue.push([...current, n]);
        }
    }

    return paths.length;
}

console.log(`Part1: ${part1(deepCopy(data))}`)
console.log(`Part2: ${part2(deepCopy(data))}`)
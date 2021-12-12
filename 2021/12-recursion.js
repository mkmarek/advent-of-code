const fs = require('fs');
const { deepCopy, makeGraphBidirectional } = require('../utils');

const data = fs.readFileSync('12.txt').toString().split('\n').map(line => line.trim().split('-'));

function part1(input) {
    function walk(segment, graph, visits = {}) {
        return graph[segment].reduce((count, next) => {
            if (next === 'start') return count;
            if (next === 'end') return count + 1;
            if (next === next.toLowerCase()) {
                if (visits[next]) return count;
                return count + walk(next, graph, { ...visits, [next]: true });
            }
            return count + walk(next, graph, visits);
        }, 0);
    }
    return walk('start', makeGraphBidirectional(input));
}

function part2(input) {
    function walk(segment, graph, visits = {}, twice = false) {
        return graph[segment].reduce((count, next) => {
            if (next === 'start') return count;
            if (next === 'end') return count + 1;
            if (next === next.toLowerCase()) {
                if (visits[next] && twice) return count;
                return count + walk(next, graph, { ...visits, [next]: true }, twice || visits[next]);
            }
            return count + walk(next, graph, visits, twice);
        }, 0);
    }
    return walk('start', makeGraphBidirectional(input));
}

console.log(`Part1: ${part1(deepCopy(data))}`)
console.log(`Part2: ${part2(deepCopy(data))}`)
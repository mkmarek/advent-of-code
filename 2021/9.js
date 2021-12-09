const fs = require('fs');
const { sum, getNeighbors } = require('../utils');

const input = fs.readFileSync('9.txt').toString().split('\n')
    .filter(e => e).map(e => e.split('').map(e => e.trim()).filter(e => e).map(e => parseInt(e)));

function getLowPoints() {
    let lowPoints = []
    for (let i = 0; i < input.length; i++) {
        let row = input[i];
        for (let j = 0; j < row.length; j++) {
            if (isLowestPoint(i, j)) {
                lowPoints.push([i, j]);
            }
        }
    }
    return lowPoints;
}

function isLowestPoint(i, j) {
    return !getNeighbors([i, j], input)
        .find(e => input[e[0]][e[1]] <= input[i][j]);
}

function hasNoPointLowerThanExcept(p, except) {
    const neighbors = getNeighbors(p, input);

    for (let ne of neighbors) {
        if (input[ne[0]][ne[1]] < input[p[0]][p[1]] && !except.find(ex => ne[0] === ex[0] && ne[1] === ex[1])) {
            return false;
        }
    }

    return true;
}

function fill(pos) {
    const pointStack = [pos];
    const result = []

    while (pointStack.length > 0) {
        const current = pointStack.pop();
        result.push(current);

        pointStack.push(...getNeighbors(current, input)
            .filter(e => input[e[0]][e[1]] != 9)
            .filter(e => input[e[0]][e[1]] > input[current[0]][current[1]])
            .filter(e => hasNoPointLowerThanExcept(e, result)));
    }

    return result;
}

function part1() {
    const lowPoints = getLowPoints().map(p => input[p[0]][p[1]]);
    return sum(lowPoints, e => e + 1);
}

function part2() {
    const basins = getLowPoints()
        .map(p => fill(p));

    return basins
        .sort((a, b) => b.length - a.length)
        .slice(0, 3)
        .map(e => e.length)
        .reduce((a, b) => a * b);
}

console.log(`Part1: ${part1()}`)
console.log(`Part2: ${part2()}`)
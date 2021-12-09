const fs = require('fs');
const { sum, groupBy, toKeyValue, distinct, intersect } = require('../utils');

const input = fs.readFileSync('9.txt').toString().split('\n')
    .filter(e => e).map(e => e.split('').map(e => e.trim()).filter(e => e).map(e => parseInt(e)));

function part1() {
    let lowPoints = []
    for (let i = 0; i < input.length; i++) {
        let row = input[i];
        for (let j = 0; j < row.length; j++) {
            if (isLowestPoint(i, j)) {
                lowPoints.push(input[i][j]);
            }
        }
    }

    return sum(lowPoints, e => e + 1);
}

function isLowestPoint(i, j) {
    let row = input[i];
    let cell = input[i][j];
    
    if (i > 0 && input[i - 1][j] <= cell) {
        return false
    }

    if (i < input.length - 1 && input[i + 1][j] <= cell) {
        return false
    }

    if (j > 0 && input[i][j - 1] <= cell) {
        return false
    }

    if (j < row.length - 1 && input[i][j + 1] <= cell) {
        return false
    }

    return true;
}

function hasNoneLowerThan(p, except) {
    let neighbors = [
        [- 1, 0],
        [+ 1, 0],
        [0, - 1],
        [0, + 1]
    ].map(e => ([e[0] + p[0], e[1] + p[1]]));

    neighbors = neighbors.filter(e => e[0] >= 0 && e[0] < input.length && e[1] >= 0 && e[1] < input[e[0]].length)

    for (let ne of neighbors) {
        
        if (input[ne[0]][ne[1]] < input[p[0]][p[1]] && except.filter(ex => ne[0] === ex[0] && ne[1] === ex[1]).length === 0) {
            return false;
        }
    }

    return true;
}

function fill(p, pos) {
    let neighbors = [
        [- 1, 0],
        [+ 1, 0],
        [0, - 1],
        [0, + 1]
    ].map(e => ([e[0] + pos[0], e[1] + pos[1]]));

    neighbors = neighbors.filter(e => e[0] >= 0 && e[0] < input.length && e[1] >= 0 && e[1] < input[e[0]].length)
    
    const higherNeighbors = neighbors.filter(e => input[e[0]][e[1]] > input[pos[0]][pos[1]]);

    for (let n of higherNeighbors) {
        if (input[n[0]][n[1]] != 9 && hasNoneLowerThan(n, [p.pos, ...p.points])) {
            p.points.push(n);
            fill(p, n);
        }
    }
}

function part2() {
    let lowPoints = []
    for (let i = 0; i < input.length; i++) {
        let row = input[i];
        for (let j = 0; j < row.length; j++) {
            if (isLowestPoint(i, j)) {
                lowPoints.push({ pos: [i, j], points: []});
            }
        }
    }

    for (let p of lowPoints) {
        fill(p, p.pos);
        p.points = distinct(p.points)
    }

    return lowPoints.sort((a, b) => b.points.length - a.points.length).slice(0, 3).map(e => e.points.length + 1).reduce((a, b) => a * b);
}

console.log(`Part1: ${part1()}`)
console.log(`Part2: ${part2()}`)
const fs = require('fs');

//409,872 -> 409,963
const input = fs.readFileSync('5.txt').toString().split('\n').map(e => ({
    from: {
        x: parseInt(e.split(' -> ')[0].split(',')[0]),
        y: parseInt(e.split(' -> ')[0].split(',')[1])
    }, to: {
        x: parseInt(e.split(' -> ')[1].split(',')[0]),
        y: parseInt(e.split(' -> ')[1].split(',')[1])
    }
}));

function part1() {
    const horizontalOrVerticalLines = input.filter(e => e.from.x === e.to.x || e.from.y === e.to.y);
    const points = {};

    horizontalOrVerticalLines.forEach(e => {
        for (let i = Math.min(e.from.x, e.to.x); i <= Math.max(e.from.x, e.to.x); i++) {
            for (let j = Math.min(e.from.y, e.to.y); j <= Math.max(e.from.y, e.to.y); j++) {
                points[`${i},${j}`] = (points[`${i},${j}`] || 0) + 1;
            }
        }
    });

    return Object.keys(points).filter(e => points[e] > 1).length;
}

function part2() {
    const lines = input.filter(e => e.from.x === e.to.x || e.from.y === e.to.y || Math.abs(e.from.x - e.to.x) === Math.abs(e.from.y - e.to.y));
    const points = {};
    lines.forEach(e => {
        if (e.from.x === e.to.x || e.from.y === e.to.y) {
            for (let i = Math.min(e.from.x, e.to.x); i <= Math.max(e.from.x, e.to.x); i++) {
                for (let j = Math.min(e.from.y, e.to.y); j <= Math.max(e.from.y, e.to.y); j++) {
                    points[`${i},${j}`] = (points[`${i},${j}`] || 0) + 1;
                }
            }
        }
        else if (Math.abs(e.from.x - e.to.x) === Math.abs(e.from.y - e.to.y)) {
            var xDir = e.from.x < e.to.x ? 1 : -1;
            var yDir = e.from.y < e.to.y ? 1 : -1;
            for (let i = 0; i <= Math.abs(e.from.x - e.to.x); i++) {
                const x = e.from.x + i * xDir;
                const y = e.from.y + i * yDir;
                points[`${x},${y}`] = (points[`${x},${y}`] || 0) + 1;
            }
        }
    });

    return Object.keys(points).filter(e => points[e] > 1).length;
}

console.log(`Part1: ${part1()}`)
console.log(`Part2: ${part2()}`)
const fs = require('fs');
const { deepCopy, distinct } = require('../utils');

const data = fs.readFileSync('13.txt').toString().split('\n').map(line => line.trim());

function fold(points, axis, value) {
    const [width, height] = getSize(points);

    return axis == 'x'
        ? distinct(points.map(p => p[0] > value ? [width - p[0] - 1, p[1]] : p))
        : distinct(points.map(p => p[1] > value ? [p[0], height - p[1] - 1] : p))
}

function getSize(points) {
    let maxX = 0;
    let maxY = 0;
    for (let i = 0; i < points.length; i++) {
        if (maxX < points[i][0]) maxX = points[i][0];
        if (maxY < points[i][1]) maxY = points[i][1];
    }

    return [maxX + 1, maxY + 1];
}

function getPointsAndFolds(input) {
    const points = [];
    const folds = [];
    let i;

    for (i = 0; i < input.length; i++) {
        if (input[i] === '') break;
        points.push(input[i].split(',').map(Number));
    }

    i++;

    for (; i < input.length; i++) {
        folds.push({ axis: input[i].split('=')[0].split(' ')[2], value: Number(input[i].split('=')[1]) });
    }

    return [points, folds];
}

function printPoints(points) {
    const [width, height] = getSize(points);
    let result = '';
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            result += points.find(dot => dot[0] === x && dot[1] === y) ? '#' : ' ';
        }
        result += '\n';
    }
    return result;
}

function part1(input) {
    const [points, folds] = getPointsAndFolds(input);
    return fold(points, folds[0].axis, folds[0].value).length;
}

function part2(input) {
    let [points, folds] = getPointsAndFolds(input);

    for (let f of folds) {
        points = fold(points, f.axis, f.value);
    }

    return `\n${printPoints(points)}`;
}

console.log(`Part1: ${part1(deepCopy(data))}`)
console.log(`Part2: ${part2(deepCopy(data))}`)
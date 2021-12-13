const fs = require('fs');
const { deepCopy, toKeyValue, distinct, groupBy, intersect, iterateTwoDimArray } = require('../utils');

const data = fs.readFileSync('13.txt').toString().split('\n').map(line => line.trim());

function fold(points, width, height, axis, value) {
    const pointsCopy = [];
    if (axis === 'x') {
        for (let x = 0; x <= value; x++) {
            for (let y = 0; y < height; y++) {
                if (points.find(point => point[0] === x && point[1] === y) || points.find(point => point[0] === (width - x - 1) && point[1] === y)) {
                    pointsCopy.push([x, y]);
                }
            }
        }
    } else {
        for (let x = 0; x < width; x++) {
            for (let y = 0; y <= value; y++) {
                if (points.find(point => point[0] === x && point[1] === y) || points.find(point => point[0] === x && point[1] === (height - y - 1))) {
                    pointsCopy.push([x, y]);
                }
            }
        }
    }

    return pointsCopy;
}

function part1(input) {
    const dots = [];
    const folds = [];
    let i;
    for (i = 0; i < input.length; i++) {
        if (input[i] === '') break;
        dots.push(input[i].split(',').map(Number));
    }
    i++;

    for (; i < input.length; i++) {
        folds.push({ axis: input[i].split('=')[0].split(' ')[2], value: Number(input[i].split('=')[1]) });
    }

    let maxX = 0;
    let maxY = 0;
    for (let i = 0; i < dots.length; i++) {
        if (maxX < dots[i][0]) maxX = dots[i][0];
        if (maxY < dots[i][1]) maxY = dots[i][1];
    }

    const newPoitns = fold(dots, maxX + 1, maxY + 1, folds[0].axis, folds[0].value);
    return newPoitns.length;
}

function part2(input) {
    let dots = [];
    const folds = [];
    let i;
    for (i = 0; i < input.length; i++) {
        if (input[i] === '') break;
        dots.push(input[i].split(',').map(Number));
    }
    i++;

    for (; i < input.length; i++) {
        folds.push({ axis: input[i].split('=')[0].split(' ')[2], value: Number(input[i].split('=')[1]) });
    }

    let maxX = 0;
    let maxY = 0;
    for (let i = 0; i < dots.length; i++) {
        if (maxX < dots[i][0]) maxX = dots[i][0];
        if (maxY < dots[i][1]) maxY = dots[i][1];
    }

    for (let f of folds) {
        dots = fold(dots, maxX + 1, maxY + 1, f.axis, f.value);

        maxX = 0;
        maxY = 0;
        for (let i = 0; i < dots.length; i++) {
            if (maxX < dots[i][0]) maxX = dots[i][0];
            if (maxY < dots[i][1]) maxY = dots[i][1];
        }
    }

    let result = '\n';
    for (let y = 0; y <= maxY; y++) {
        let str = ''
        for (let x = 0; x <= maxX; x++) {
            str += dots.find(dot => dot[0] === x && dot[1] === y) ? '#' : '.';
        }
        result += str + '\n';
    }
    return result;
}

console.log(`Part1: ${part1(deepCopy(data))}`)
console.log(`Part2: ${part2(deepCopy(data))}`)
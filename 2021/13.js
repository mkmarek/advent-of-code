const fs = require('fs');
const { deepCopy, toKeyValue, distinct, groupBy, intersect, iterateTwoDimArray } = require('../utils');

const data = fs.readFileSync('13.txt').toString().split('\n').map(line => line.trim());

function part1(input) {

}

function part2(input) {
    
}

console.log(`Part1: ${part1(deepCopy(data))}`)
console.log(`Part2: ${part2(deepCopy(data))}`)
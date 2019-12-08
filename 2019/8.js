const fs = require('fs');
const { setArray } = require('./utils');

const input = fs.readFileSync('8.txt').toString().split('')
    .map(e => Number(e.trim()));

const getLayers = (w, h) => input.reduce((p, c, i) => setArray(p, [
    Math.floor(i / (w * h)),
    Math.floor(i % (w * h) / w),
    i % (w * h) % w], c), []) 

const numberOfDigits = (layer, digit) =>
    layer.reduce((p, n) => p + n.reduce((pl, nl) => pl + (nl === digit ? 1 : 0), 0), 0);

const getResultForPart1 = (layers) => layers
    .map((layer) => ({ layer, n : numberOfDigits(layer, 0)}))
    .sort((a, b) => a.n - b.n)
    .slice(0, 1)
    .map(({layer}) => numberOfDigits(layer, 1) * numberOfDigits(layer, 2))[0];

const getMessageForPart2 = (layers) => layers
    .reduce((p, c) => c.map((row, y) => row.map((col, x) => [1, 0].includes((p[y] || [])[x]) ? p[y][x] : col)),[])
    .map(el => el.map(e => e === 0 ? ' ' : '*').join(''))
    .join('\n');

const layers = getLayers(25, 6);
console.log(`Part1: ${getResultForPart1(layers)}`);
console.log('Part2:')
console.log(getMessageForPart2(layers));
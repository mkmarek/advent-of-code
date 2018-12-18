let fs = require('fs');

let input = fs.readFileSync('./inputs/18.txt').toString().split('\n').map(e => e.trim().split(''));

let size = 50;
let iterations = 10

let ground = '.';
let trees = '|';
let lumberyard = '#';

const getCountAround = (x, y, tile) => {
    return [
        { x: x-1, y: y },
        { x: x+1, y: y },
        { x: x-1, y: y-1 },
        { x: x+1, y: y-1 },
        { x: x-1, y: y+1 },
        { x: x+1, y: y+1 },
        { x: x, y: y-1 },
        { x: x, y: y+1 },
    ].filter(e => getTile(e.x, e.y) === tile).length
}

const getTile = (x, y) => {
    if (input[y] && input[y][x]) {
        return input[y][x];
    }

    return ground;
}

const cellular = (map) => {
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            if (getTile(x, y) == ground && getCountAround(x, y, trees) >= 3) {
                map[y][x] = trees;
            }
            else if (getTile(x, y) == trees && getCountAround(x, y, lumberyard) >= 3) {
                map[y][x] = lumberyard;
            }
            else if (getTile(x, y) == lumberyard ) {
                if (getCountAround(x, y, lumberyard) > 0 && getCountAround(x, y, trees) > 0) {
                    map[y][x] = lumberyard;
                } else {
                    map[y][x] = ground;
                }
            }
        }
    }
}

const count = () => {
    let lumberyardCount = 0;
    let treesCount = 0;
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            if (getTile(x, y) == lumberyard) lumberyardCount++;
            if (getTile(x, y) == trees) treesCount++;
        }
    }

    return [lumberyardCount, treesCount];
}

for (let i = 0; i < iterations; i++) {
    let newMap = JSON.parse(JSON.stringify(input));
    cellular(newMap);
    input = newMap;
}

const cnt = count();
console.log(`Answer1: ${cnt[0] * cnt[1]}`)

input = fs.readFileSync('./inputs/18.txt').toString().split('\n').map(e => e.trim().split(''));
const patterns = [];
let newCount = null;

let idx = 0;
while (true) { 
    const counts = [];

    if (newCount) counts.push(newCount);

    newCount = null;

    do {
        if (newCount) {
            counts.push(newCount);
        }

        let newMap = JSON.parse(JSON.stringify(input));
        cellular(newMap);
        idx++;

        input = newMap;

        newCount = count();
    } while(counts.filter(e => e[0] == newCount[0] && e[1] == newCount[1]).length == 0)

    const firstIndex =  counts.findIndex(e => e[0] == newCount[0] && e[1] == newCount[1]);
    const patternLength = counts.length - firstIndex;

    if (patterns.filter(e => e.found == counts.length &&
        e.firstIndex == firstIndex &&
        e.start[0] == counts[firstIndex][0] &&
        e.start[1] == counts[firstIndex][1]).length) {
            break;
    }
    patterns.push({idx, found: counts.length, firstIndex, patternLength, counts, start: newCount});
}

const lastPattern = patterns[patterns.length-1];
const index = (1000000000 - lastPattern.idx) % lastPattern.patternLength;
const result = lastPattern.counts[index];

console.log(`Answer2: ${result[0] * result[1]}`);
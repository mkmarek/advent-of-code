const fs = require('fs');

const input =  fs.readFileSync('3.txt').toString().split('\n')
    .map(e => e.trim().split(''));



function part1(slope) {
    let pos = { x: 0, y: 0 }

    for (let x = 0; x < input[0].length; x++) {
        if (input[0][x] === '.') {
            pos.x = x;
            break;
        }
    }

    let cnt = 0;
    for (let y = 0; y < input.length - 1; y++) {
        pos.x += slope.x;
        pos.x = pos.x % input[0].length;
        pos.y = pos.y + slope.y;

        if (input[pos.y] && input[pos.y][pos.x] === '#') {
            cnt++;
        }
    }

    return cnt;
}

function part2() {
    const a = part1({x : 1, y: 1})
    const b = part1({x : 3, y: 1})
    const c = part1({x : 7, y: 1})
    const d = part1({x : 5, y: 1})
    const e = part1({x : 1, y: 2})

    return a * b * c * d * e;
}

console.log(`Part1: ${part1({x : 3, y: 1})}`)
console.log(`Part2: ${part2()}`)
const fs = require('fs');

const input = fs.readFileSync('5.txt').toString().split('\n')
    .map(e => e);

function getPart(from, to, lower) {
    const diff = to - from;
    if (lower) {
        return [from, from + Math.floor(diff / 2) ]
    }

    return [from + Math.ceil(diff / 2) , to]
}

function getBoardPass(id) {

    let rowFrom = 0;
    let rowTo = 127;
    for (var i = 0; i < 7; i++) {
        const [f, t] = getPart(rowFrom, rowTo, id[i] === 'F');
        rowFrom = f;
        rowTo = t;
    }

    let seatFrom = 0;
    let seatTo = 7;
    for (var i = 0; i < 3; i++) {
        const [f, t] = getPart(seatFrom, seatTo, id[7 + i] === 'L');
        seatFrom = f;
        seatTo = t;
    }

    return rowFrom * 8 + seatFrom
}

function part1() {
    let max = 0;

    for (const inp of input)
    {
        const id = getBoardPass(inp);
        if (max < id) max = id;
    }

    return max;
}

function part2() {
    let max = 0;
    let seats = []

    for (const inp of input)
    {
        const id = getBoardPass(inp);
        if (max < id) max = id;

        seats.push(id);
    }

    for (let i = 0; i < max; i++) {
        if (seats.includes(i - 1) && seats.includes(i + 1) && !seats.includes(i)) {
            return i;
        }
    }

    return -1;
}

console.log(`Part1: ${part1()}`)
console.log(`Part2: ${part2()}`)
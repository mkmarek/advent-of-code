const fs = require('fs');

const input =  fs.readFileSync('2.txt').toString().split('\n')
    .map(e => ({
        char: e.split(':')[0].split(' ')[1],
        from: Number(e.split(':')[0].split(' ')[0].split('-')[0]),
        to: Number(e.split(':')[0].split(' ')[0].split('-')[1]),
        pwd: e.split(':')[1].trim()
    }));

function part1() {
    let value = 0;

    for (let a of input) {
        let cnt = 0;
        for (let ch of a.pwd) {
            if (ch === a.char) cnt++;
        }

        if (cnt >= a.from && cnt <= a.to) {
            value++;
        }
    }
    return value;
}

function part2() {
    let value = 0;
    for (let a of input) {
        if ((a.char === a.pwd[a.from - 1] || a.char === a.pwd[a.to - 1]) && !(a.char === a.pwd[a.from - 1] && a.char === a.pwd[a.to - 1])) {
            value++;
        }
    }
    return value;
}

console.log(`Part1: ${part1()}`)
console.log(`Part2: ${part2()}`)
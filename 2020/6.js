const fs = require('fs');

const input = fs.readFileSync('6.txt').toString().split('\r\n\r\n')
    .map(e => e.trim().split('\n').map(x => x.trim().split('')));

function distinct(els) {
    let o = {};
    for (var el of els) {
        o[el] = true;
    }

    return Object.keys(o);
}

function part1() {
    let sum = 0;
    for (let g of input) {
        let kk = distinct(g.reduce((p, n) => ([...p, ...n]), []));

        sum+=kk.length;
    }

    return sum;
}

function part2() {
    let all = [];
    for (let g of input) {
        all = g.reduce((p, n) => ([...p, ...n]), [...all])
    }

    all = distinct(all);

    let sum = 0;
    for (let g of input) {
        let answ = [...all];

        for (let ans of g) {
            for (let bb of all) {
                if (!ans.includes(bb)) {
                    answ = answ.filter(e => e !== bb);
                }
            }
        }

        sum += answ.length;
    }

    return sum;
}

console.log(`Part1: ${part1()}`)
console.log(`Part2: ${part2()}`)
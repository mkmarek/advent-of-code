const fs = require('fs');

// Not exactly proud of this. :/

const input = fs.readFileSync('3.txt').toString().split('\n').map(w => w.split(',').map(e => e.trim()))

let wire ={}
let wireIndex = 0;
for (let w of input) {
    let x = 0;
    let y = 0;
    let pos = {};
    let steps = 0;


    for (let i of w) {
        const n = Number(i.substr(1));
        switch (i[0]) {
            case 'L':
                for (let z = x; z >= x - n; z--)  { pos[`${z}_${y}`] = steps; steps++;}
                x -= n;
            break;
            case 'U':
                    for (let z = y; z >= y - n; z--)  { pos[`${x}_${z}`] = steps; steps++ }
                     y -= n; break;
            case 'R':
                for (let z = x; z <= x + n; z++)  { pos[`${z}_${y}`] = steps; steps++ }
                x += n;
            break;
            case 'D':
                    for (let z = y; z <= y + n; z++)  { pos[`${x}_${z}`] = steps; steps++ }
                        y += n; break;
        }
        steps--;
    }

    wire[wireIndex] = pos;
    wireIndex++;
}

const w1 = Object.keys(wire[0]);
const w2 = Object.keys(wire[1]);

const intersections = w1.filter(e => w2.includes(e));

const aa = intersections.map(e => e.split('_')).map(e => ({d: Math.abs(e[0]) + Math.abs(e[1]), d1: wire[0][`${e[0]}_${e[1]}`], d2: wire[1][`${e[0]}_${e[1]}`]}))
    .sort((a, b) => a.d - b.d).map(e => ({ d: e.d, d1: e.d1, d2: e.d2, s : e.d1 + e.d2 })).sort((a, b) => a.s - b.s);

console.log(aa);
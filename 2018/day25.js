let fs = require('fs');

let input = fs.readFileSync('./inputs/25.txt').toString().trim().split('\n').map(e => e.trim()).filter(e => e)
    .map(e => e.split(',').map(x => Number(x)));

let constelations = input.map(e => [e]);

const distance = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]) + Math.abs(a[3] - b[3])

let reduced
do {
    reduced = false;
    for (let i = 0; i < constelations.length; i++) {
        for (let y = 0; y < constelations.length; y++) {
            if (i == y) continue;
            if (constelations[i].filter(e => constelations[y].filter(f =>distance(e, f) <= 3).length > 0).length > 0) {
                constelations[i] = [...constelations[i], ...constelations[y]]
                constelations[y] = [];
                reduced = true;
            }
        }
    }
} while (reduced)


constelations = constelations.filter(e => e.length > 0);

console.log(`The answer is: ${constelations.length}`);
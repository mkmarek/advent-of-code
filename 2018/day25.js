let fs = require('fs');

let input = fs.readFileSync('./inputs/25.txt').toString().trim().split('\n').map(e => e.trim()).filter(e => e)
    .map(e => e.split(',').map(x => Number(x)));

const distance = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]) + Math.abs(a[3] - b[3])

const isInConstelation = (a, b) => {
    for (let i = 0; i < a.length; ++i) {
        for (let y = 0; y < b.length; ++y) {
            if (distance(a[i], b[y]) <= 3) {
                return true;
            }
        }   
    }

    return false;
}

let reduced
var dt = new Date();

let constelations = input
    .sort((a, b) => b[0] - a[0])
    .map(e => [e]);

do {
    reduced = false;
    for (let i = 0; i < constelations.length; ++i) {
        for (let y = 0; y < constelations.length; ++y) {
            if (i == y) continue;
            if (isInConstelation(constelations[i], constelations[y])) {
                constelations[i] = constelations[i].concat(constelations[y]);
                
                constelations.splice(y, 1);

                y--;
                if (i > y) i--;

                reduced = true;
            }
        }
    }
} while (reduced)

console.log(`The answer is: ${constelations.length} found in ${new Date() - dt}`);
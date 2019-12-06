const fs = require('fs');

const input = fs.readFileSync('6.txt').toString().split('\n')
    .map(e => e.trim())
    .map(e => e.split(')'));

function findRoot(el) {
   let x = input.find(e => e[1] === el);

   if (x) {
       return [x[0], ...findRoot(x[0])];
   }

   return [];
}

function findOrbitalJumps(from, to) {
    const pathFromStart = findRoot(from)
    const pathFromEnd = findRoot(to)

    const firstCommonNode = pathFromStart
        .filter(e => pathFromEnd.filter(a => a === e).length > 0)[0];

    let jumps = 0;
    for (let x = 0; x < pathFromStart.length; x++) {
        if (pathFromStart[x] === firstCommonNode) break;
        jumps++;
    }

    for (let x = 0; x < pathFromEnd.length; x++) {
        if (pathFromEnd[x] === firstCommonNode) break;
        jumps++;
    }

    return jumps;
}

let jumpsToRoot = 0;
for (let node of input) {
    jumpsToRoot += findRoot(node[0]).length + 1;
}

console.log(`Part1: ${jumpsToRoot}`);
console.log(`Part2: ${findOrbitalJumps('SAN', 'YOU')}`);
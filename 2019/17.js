const fs = require('fs');
const { Graph, astar } = require('javascript-astar');

const input = fs.readFileSync('17.txt').toString().split(',')
    .map(e => Number(e.trim()));

function runProgram(instructions, relativeBase = 0, i = 0) {

    let inputCursor = 0;
    let input = []

    function getAddress(idx, mode) {
        if (mode === '0') return instructions[i + idx];
        if (mode === '1') return i + idx;
        if (mode === '2') return instructions[i + idx] + relativeBase;

        throw new Error(`Invalid mode ${mode}`);
    }

    function copy() {
        return runProgram([...instructions], relativeBase, i);
    }

    function next(additionalInput) {
        let output = 0;
        input = [...input, ...additionalInput]
        for (; i < instructions.length;) {

            const str = instructions[i].toString().padStart(5, '0');
            const opCode = Number(str.substring(3, 5));
            const addressA = getAddress(1, str[2]);
            const addressB = getAddress(2, str[1]);
            const addressC = getAddress(3, str[0]);

            switch (opCode) {
                case 1: instructions[addressC] = instructions[addressA] + instructions[addressB]; i += 4; break;
                case 2: instructions[addressC] = instructions[addressA] * instructions[addressB]; i += 4; break;
                case 3: 
                    instructions[addressA] = input[inputCursor++]; i += 2; break;
                case 4: output = instructions[addressA]; i += 2; return [false, output]; break;
                case 5: if (instructions[addressA] !== 0) i = instructions[addressB]; else i += 3; break;
                case 6: if (instructions[addressA] === 0) i = instructions[addressB]; else i += 3; break;
                case 9: relativeBase = relativeBase + instructions[addressA]; i += 2; break;
                case 7: if (instructions[addressA] < instructions[addressB]) instructions[addressC] = 1; else { instructions[addressC] = 0; } i += 4; break;
                case 8: if (instructions[addressA] === instructions[addressB]) instructions[addressC] = 1; else instructions[addressC] = 0; i += 4; break;
                case 99: return [true, output];
                default: throw new Error(`Invalid opcode ${opCode}`);
            }
        }
    }

    return {
        next,
        copy
    };
}

let prog = runProgram([...input]);
let status = false;
let map = [];
let x = 0;
let y = 0;
let w = 0;
let direction = 0;
let pos = { x: 0, y: 0 }

while (!status) {
    const [s, o] = prog.next([]);

    if (!map[y]) map[y] = [];
    if (o === 35) map[y][x++] = true;
    else if (o === '^'.charCodeAt(0)) { pos = { x, y}; map[y][x++] = true; direction = 0; }
    else if (o === '>'.charCodeAt(0)) { pos = { x, y};map[y][x++] = true; direction = 1; }
    else if (o === 'v'.charCodeAt(0)) { pos = { x, y};map[y][x++] = true; direction = 2; }
    else if (o === '<'.charCodeAt(0)) { pos = { x, y};map[y][x++] = true; direction = 3; }
    else if (o === 46) map[y][x++] = false;
    else if (o === 10) { y++; if (x > w) w = x; x = 0; };

    status = s;
}

let intersections = [];
for (let xx = 1; xx < w - 1; xx++) {
    for (let yy = 1; yy < y - 1; yy++) {
        if (map[yy][xx] && map[yy + 1][xx] && map[yy - 1][xx] && map[yy][xx + 1] && map[yy][xx - 1]) {
            intersections.push({ x: xx, y: yy })
        }
    }
}

console.log(`Part1: ${intersections.reduce((p, n) => p + n.x * n.y, 0)}`);

//Uncomment to print map
// for (let yy = 0; yy < y + 1; yy++) {
//     let ln = '';
//     for (let xx = 0; xx < w; xx++) {
//         if (xx == pos.x && yy == pos.y) {
//             switch(direction) {
//                 case 0: ln+='^'; break;
//                 case 1: ln+='>'; break;
//                 case 2: ln+='v'; break;
//                 case 3: ln+='<'; break;
//             }
//         } else if(map[yy][xx]) {
//             ln+='#';
//         } else {
//             ln+=' ';
//         }
//     }
//     console.log(ln);
// }

input[0] = 2;
let prog2 = runProgram([...input]);

// A: L12 L12 R12
// B: L8 L8 R12 L8 L8
// C: L10 R8 R12

// A A B C C A B C A B

let arr = 'A,A,B,C,C,A,B,C,A,B\nL,12,L,12,R,12\nL,8,L,8,R,12,L,8,L,8\nL,10,R,8,R,12\ny\n'.split('').map(e => e.charCodeAt(0));

let [stst] = prog2.next(arr)

const outputs = [];
while (!stst) {
    let [s, o] = prog2.next([]);
    stst = s;
    outputs.push(o);
}

console.log(`Part2: ${outputs[outputs.length - 2]}`);
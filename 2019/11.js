const fs = require('fs');

const input = fs.readFileSync('11.txt').toString().split(',')
    .map(e => Number(e.trim()));

    function runProgram(instructions, input) {

        let relativeBase = 0;
        let i = 0;
    
        function getAddress(idx, mode) {
            if (mode === '0') return instructions[i + idx];
            if (mode === '1') return i + idx;
            if (mode === '2') return instructions[i + idx] + relativeBase;
    
            throw new Error(`Invalid mode ${mode}`);
        }
        
        function next(additionalInput) {
            input = [...input, additionalInput];
            let output = 0;
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
                        instructions[addressA] = additionalInput; i += 2; break;
                    case 4: output = instructions[addressA]; i += 2; return [false, output]; break;
                    case 5: if (instructions[addressA] !== 0) i = instructions[addressB]; else i += 3; break;
                    case 6: if (instructions[addressA] === 0) i = instructions[addressB]; else i += 3; break;
                    case 9: relativeBase = relativeBase + instructions[addressA];  i += 2; break;
                    case 7: if (instructions[addressA] < instructions[addressB]) instructions[addressC] = 1; else { instructions[addressC] = 0; } i += 4; break;
                    case 8: if (instructions[addressA] === instructions[addressB]) instructions[addressC] = 1; else instructions[addressC] = 0; i += 4; break;
                    case 99: return [true, output];
                    default: throw new Error(`Invalid opcode ${opCode}`);
                }
            }
        }
    
        return next;
    }

function run(startingColor) {

    let color = true;

    let prog = runProgram(input,[]);
    let status = false;
    let arr = {};
    let pos = {x: 0, y : 0 }
    let lastDir = 0;

    const DIR = [ {x: 0, y: -1}, {x: 1, y: 0}, {x: 0,y: 1}, { x: -1, y: 0} ]

    arr[`${pos.x}_${pos.y}`] = startingColor;

    while (!status) {
        const [s, o] = prog(arr[`${pos.x}_${pos.y}`] ? 1 : 0);

        status = s;
        if (status) break;

        if (color) {
            arr[`${pos.x}_${pos.y}`] = o;
        } else {
            lastDir = (lastDir + (o == 0 ? -1 : 1) + 4) % 4;

            pos.x += DIR[lastDir].x;
            pos.y += DIR[lastDir].y;
        }

        color = !color;
    }

    const keys = Object.keys(arr).map(e => e.split('_').map(e => Number(e)));
    const minx = keys.map(e => e[0]).sort((a, b) => a - b)[0];
    const miny = keys.map(e => e[1]).sort((a, b) => a - b)[0];
    const maxx = keys.map(e => e[0]).sort((a, b) => b - a)[0];
    const maxy = keys.map(e => e[1]).sort((a, b) => b - a)[0];

    let str = '';
    for (let y = miny; y <= maxy; y++) {
        for (let x = minx; x <= maxx; x++) {
            if (arr[`${x}_${y}`] === 1) {
                str += '#'
            } else {
                str += ' '
            }
        }
        str += '\n'
    }

    return [Object.keys(arr).length, str]
}

console.log(`Part1: ${run(0)[0]}`);
console.log(`Part2:\n${run(1)[1]}`);
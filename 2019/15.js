const fs = require('fs');
const { Graph, astar } = require('javascript-astar');

const input = fs.readFileSync('15.txt').toString().split(',')
    .map(e => Number(e.trim()));

function runProgram(instructions, relativeBase = 0, i = 0) {

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

let map = {};

let robots = [{ pos: { x: 0, y : 0 }, prog: runProgram([...input], [])}];
let movements = [1, 2, 3, 4];
let exploredStatuses = [0, 1, 2];

const getPositionFromDirection = (pos, dir) => {
    switch (dir) {
        case 1: return {x: pos.x, y: pos.y - 1};
        case 2: return {x: pos.x, y: pos.y + 1}
        case 3: return {x: pos.x - 1, y: pos.y}
        case 4: return {x: pos.x + 1, y: pos.y}
    }
}

let oxygenLocation = null;
while (robots.length > 0) {
    let { pos, prog } = robots.pop();

    let unexplored = movements.filter(e => {
        switch (e) {
            case 1: return !exploredStatuses.includes(map[`${pos.x}_${pos.y - 1}`]);
            case 2: return !exploredStatuses.includes(map[`${pos.x}_${pos.y + 1}`]);
            case 3: return !exploredStatuses.includes(map[`${pos.x - 1}_${pos.y}`]);
            case 4: return !exploredStatuses.includes(map[`${pos.x + 1}_${pos.y}`]);
        }

        throw new Error();
    });

    for( let dir of unexplored) {
        let newProg = prog.copy();
        const [s, out] = newProg.next(dir);

        if (s) continue;

        const endPosition = getPositionFromDirection(pos, dir);
        
        map[`${endPosition.x}_${endPosition.y}`] = out;

        if (out === 2) oxygenLocation = endPosition;

        if (out !== 0) {
            robots.push({ pos: endPosition, prog: newProg });
        }
    }
}

let coords = Object.keys(map).map(e => e.split('_'));
let maxX = coords.map(e => e[0]).sort((a, b) => b - a)[0];
let maxY = coords.map(e => e[1]).sort((a, b) => b - a)[0];
let minX = coords.map(e => e[0]).sort((a, b) => a - b)[0];
let minY = coords.map(e => e[1]).sort((a, b) => a - b)[0];

function printMap() {
    for (let y = minY; y <= maxY; y++) {
        let line = ''
        for (let x = minX; x <= maxX; x++) {
            if (x === 0 && y == 0)
                line += 'A';
            else {
                switch (map[`${x}_${y}`]) {
                    case 1: line += ' '; break;
                    case 2: line += 'X'; break;
                    case 3: line += '0'; break;
                    default: line += '#'; break;
                }
            }
        }
    
        console.log(line);
    }
}

const flood = [[oxygenLocation]];

let arr = [];
for (let y = minY; y <= maxY; y++) {
    if (!arr[y - minY]) arr[y - minY] = []; 
    for (let x = minX; x <= maxX; x++) {
        arr[y - minY][x - minX] = map[`${x}_${y}`] == 1 || map[`${x}_${y}`] == 2
            ? 1
            : 0;
    }

}

printMap();

let minutes = 0;
const breaking = [0, 3]
while (flood.length > 0) {
    const positions = flood.pop();

    const nextUp = [];
    for (let pos of positions) {
        let unexplored = movements.filter(e => {
            switch (e) {
                case 1: return !breaking.includes(map[`${pos.x}_${pos.y - 1}`]);
                case 2: return !breaking.includes(map[`${pos.x}_${pos.y + 1}`]);
                case 3: return !breaking.includes(map[`${pos.x - 1}_${pos.y}`]);
                case 4: return !breaking.includes(map[`${pos.x + 1}_${pos.y}`]);
            }

            throw new Error();
        });

        for (let dir of unexplored) {
            const endPosition = getPositionFromDirection(pos, dir);
            map[`${endPosition.x}_${endPosition.y}`] = 3;

            nextUp.push(endPosition);
        }
    }

    if (nextUp.length)
        flood.push(nextUp);
    minutes++;
}

var graph = new Graph(arr);
var start = graph.grid[-minY][-minX];
var end = graph.grid[oxygenLocation.y - minY][oxygenLocation.x - minX];
var result = astar.search(graph, start, end);

console.log(`Part1: ${result.length}`);
console.log(`Part2: ${minutes - 1}`);

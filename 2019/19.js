const fs = require('fs');

// const input = fs.readFileSync('19.txt').toString().split(',')
//     .map(e => Number(e.trim()));

// function runProgram(instructions, relativeBase = 0, i = 0) {

//     let input = [];
//     let inputptr = 0;

//     function getAddress(idx, mode) {
//         if (mode === '0') return instructions[i + idx];
//         if (mode === '1') return i + idx;
//         if (mode === '2') return instructions[i + idx] + relativeBase;

//         throw new Error(`Invalid mode ${mode}`);
//     }

//     function copy() {
//         return runProgram([...instructions], relativeBase, i);
//     }

//     function next(additionalInput) {
//         input = [...input, ...additionalInput];
//         let output = 0;
//         for (; i < instructions.length;) {

//             const str = instructions[i].toString().padStart(5, '0');
//             const opCode = Number(str.substring(3, 5));
//             const addressA = getAddress(1, str[2]);
//             const addressB = getAddress(2, str[1]);
//             const addressC = getAddress(3, str[0]);

//             switch (opCode) {
//                 case 1: instructions[addressC] = instructions[addressA] + instructions[addressB]; i += 4; break;
//                 case 2: instructions[addressC] = instructions[addressA] * instructions[addressB]; i += 4; break;
//                 case 3:
//                     if (inputptr >= input.length) return ['requires-input', output];
//                     instructions[addressA] = input[inputptr++]; i += 2; break;
//                 case 4: output = instructions[addressA]; i += 2; return ['output', output]; break;
//                 case 5: if (instructions[addressA] !== 0) i = instructions[addressB]; else i += 3; break;
//                 case 6: if (instructions[addressA] === 0) i = instructions[addressB]; else i += 3; break;
//                 case 9: relativeBase = relativeBase + instructions[addressA]; i += 2; break;
//                 case 7: if (instructions[addressA] < instructions[addressB]) instructions[addressC] = 1; else { instructions[addressC] = 0; } i += 4; break;
//                 case 8: if (instructions[addressA] === instructions[addressB]) instructions[addressC] = 1; else instructions[addressC] = 0; i += 4; break;
//                 case 99: return [true, output];
//                 default: throw new Error(`Invalid opcode ${opCode}`);
//             }
//         }
//     }

//     return {
//         next,
//         copy
//      };
// }

// let prog = runProgram([...input])

// let cntr =0;

// console.log(prog.next([]))
// let map = [];

// // for (let y = 0; y < 100; y++) {
// //     if (!map[y]) map[y] = [];
// //     for (let x = 0; x < 100; x++) {
// //         let [status, o] = prog.next([x, y])
// //         if (o != 0) {
// //             cntr++;
// //             map[y][x] = true;
// //         } else {
// //             map[y][x] = false;
// //         }

// //         prog = runProgram([...input]);
// //     }
// // }


// for (let x = 0; x < 2000; x++) {
//     let cntr = 0;
//     let startingPoint = { x }
//     let width = 0;
//     if (!map[x]) map[x] = [];
//     for (let y = 0; y < 2000; y++) {
//         let [status, o] = prog.next([x, y])
//         prog = runProgram([...input]);
//         if (o != 0) {
//             if (!startingPoint.y) startingPoint.y = y;
//             cntr++;

//             let horizontal = false;
//             let vertical = false;
//             let cntr2 = 0;
//             // for (let x2 = 0; x2 <= 100; x2++) {
//             //     let [status, o] = prog.next([x2 + x, y]);
//             //     prog = runProgram([...input]);
    
//             //     if (o != 0) {
//             //         cntr2++;
//             //     } else if (cntr2 > 0) {
//             //         break;
//             //     }
    
//             //     // console.log(`Cntr2 ${cntr2}`)
//             //     if (cntr2 > 100) {
//             //         horizontal = true;
//             //         break;
//             //     }
//             // }

//             // for (let y2 = 0; y2 <= 100; y2++) {
//             //     let [status, o] = prog.next([x, y + y2]);
//             //     prog = runProgram([...input]);
    
//             //     if (o != 0) {
//             //         cntr2++;
//             //     } else if (cntr2 > 0) {
//             //         break;
//             //     }
    
//             //     // console.log(`Cntr2 ${cntr2}`)
//             //     if (cntr2 > 100) {
//             //         vertical = true;
//             //         break;
//             //     }
//             // }

//             if (horizontal && vertical) {
//                 console.log(x, y);
//                 console.log(x * 1000 + y);
//                 return;
//             }

//         } else if (cntr > 0) {
//             break;
//         }

//         map[x][y] = o != 0;

//         width = y;
//     }

//     // console.log(cntr)
//     // if (cntr > 100) {
//     //     let cntr2 = 0;
//     //     for (let x2 = 0; x2 < 100; x2++) {
//     //         let [status, o] = prog.next([x2 + x, startingPoint.y]);
//     //         prog = runProgram([...input]);

//     //         if (o != 0) {
//     //             cntr2++;
//     //         } else if (cntr2 > 0) {
//     //             break;
//     //         }

//     //         // console.log(`Cntr2 ${cntr2}`)
//     //         if (cntr2 > 100) {
//     //             console.log(startingPoint);
//     //             console.log(startingPoint.x * 1000 + startingPoint.y);
//     //             return;
//     //         }
//     //     }
//     // }
// }

// let lines = '';
// for (let y = 0; y < 2000; y++) {
//     let len = '';
//     for (let x = 0; x < 2000; x++) {
//         len += map[x][y] ? '#' : ' ';
//     }
//     lines += len + '\n';
// }

// fs.writeFileSync('out.txt', lines);

// console.log(cntr);

const input = fs.readFileSync('out.txt').toString().split('\n')
    .map(e => e.split(''));

const hasHorizontal100 = (x, y) => {
    for (let xx = x; xx < x + 100; xx++) {
        if (input[y][xx] !== '#') return false;
    }

    return true;
}

const hasVertical100 = (x, y) => {
    for (let yy = y; yy < y + 100; yy++) {
        if (input[yy][x] !== '#') return false;
    }

    return true;
}

for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
        
        if (input[y][x] === '#' && hasHorizontal100(x, y) && hasVertical100(x, y)) {
            console.log(x, y);
            console.log(x * 10000 + y);
            return;
        }
    }
}
const fs = require('fs');

const input = fs.readFileSync('4.txt').toString().split('\n');
const draws = input[0].split(',').map(e => e.trim()).filter(e => e).map(e => parseInt(e));
const boardData = input.slice(1).map(e => e.trim()).filter(e => e.length > 0).map(e => e.split(' ').filter(e => e).map(e => parseInt(e.trim())));

function part1() {
    const boards = boardData.length / 5;

    let numbers = [];
    let i = 0;

    do {
        numbers.push(draws[i++]);
        for (let b = 0; b < boards; b++) {
            if (checkBoard(b, numbers)) {
                return calculateUnmatched(b, numbers) * numbers[numbers.length - 1];
            }
        }
    } while (true);
}

function calculateUnmatched(board, numbers) {
    let sum = 0;
    for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
            if (!numbers.includes(boardData[board * 5 + x][y])) {
                sum += boardData[board * 5 + x][y];
            }
        }
    }
    return sum
}

function checkBoard(i, numbers) {
    for (let x = 0; x < 5; x++) {
        let contains = true;
        for (let y = 0; y < 5; y++) {
            if (!numbers.includes(boardData[i * 5 + x][y])) {
                contains = false;
                break;
            }
        }

        if (contains) {
            return true;
        }
    }

    for (let y = 0; y < 5; y++) {
        let contains = true;
        for (let x = 0; x < 5; x++) {
            if (!numbers.includes(boardData[i * 5 + x][y])) {
                contains = false;
                break;
            }
        }

        if (contains) {
            return true;
        }
    }
}


function part2() {
    const boards = boardData.length / 5;
    let boardsWin = [];

    let numbers = [];
    let i = 0;

    do {
        numbers.push(draws[i++]);
        for (let b = 0; b < boards; b++) {
            if (checkBoard(b, numbers)) {
                if (boardsWin.includes(b)) {
                    continue;
                }

                boardsWin.push(b);

                if (boardsWin.length === boards) {
                    return calculateUnmatched(b, numbers) * numbers[numbers.length - 1];
                }
            }
        }
    } while (true);
}

console.log(`Part1: ${part1()}`)
console.log(`Part2: ${part2()}`)
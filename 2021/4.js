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
            if (isBingo(b, numbers)) {
                return calculateScore(b, numbers);
            }
        }
    } while (true);
}

function calculateScore(board, numbers) {
    let sum = 0;
    for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
            if (!numbers.includes(boardData[board * 5 + x][y])) {
                sum += boardData[board * 5 + x][y];
            }
        }
    }
    return sum * numbers[numbers.length - 1];
}

function isBingo(i, numbers) {
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
    let boardsInGame = new Array(boardData.length / 5).fill(0).map((_, i) => i);

    let numbers = [];
    let i = 0;

    do {
        numbers.push(draws[i++]);
        for (let x = 0; x < boardsInGame.length; x++) {
            const b = boardsInGame[x];
            if (isBingo(b, numbers)) {
                boardsInGame.splice(x, 1);

                if (boardsInGame.length === 0) {
                    return calculateScore(b, numbers);
                }

                x--;
            }
        }
    } while (true);
}

console.log(`Part1: ${part1()}`)
console.log(`Part2: ${part2()}`)
let fs = require('fs');

//let input = '^^ENWWW(NEEE|SSE(EE|N))$$';
let input = fs.readFileSync('./inputs/20.txt').toString();
input = input.substr(1, input.length - 2);

let x = 0;
let y = 0;
let choices = [];
let counter = 0;
let visited = [];

for (let i = 0; i < input.length; i++) {
    switch (input[i]) {
        case 'N': y--; counter++; break;
        case 'S': y++; counter++; break;
        case 'E': x++; counter++; break;
        case 'W': x--; counter++; break;
        case '(': choices.push({ x, y, counter }); break;
        case ')': choices.pop(); break;
        case '|': {
            let choice = choices[choices.length - 1];
            x = choice.x;
            y = choice.y;
            counter = choice.counter;
        } break;
    }

    if ('NSEW'.includes(input[i]) && visited.filter(e => e.x == x && e.y == y).length == 0) {
        visited.push({x, y, counter})
    }
}

console.log(`Answer1: ${visited.sort((a, b) => b.counter - a.counter)[0].counter}`)
console.log(`Answer2: ${visited
    .filter(e => e.counter >= 1000).length}`)

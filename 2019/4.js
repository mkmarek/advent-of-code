const fs = require('fs');

const [from, to] = fs.readFileSync('4.txt').toString().split('-').map(e => Number(e));

const meetsCriteriaPart1 = (num) => {
    let str = num.toString();    

    let adjacent = 0;
    let increasing = true;
    for (let x = 0; x < str.length - 1; x++) {
        if (str[x] === str[x+1]) adjacent++;
        if (Number(str[x]) > Number(str[x+1])) increasing = false;
    }

    if (adjacent === 0 || !increasing) return false;

    return true;
}

const meetsCriteriaPart2 = (num) => {
    let str = num.toString();    
    let adjacentArr = [];
    let adjacent = 0;
    let increasing = true;

    for (let x = 0; x < str.length - 1; x++) {
        if (str[x] === str[x+1]) { adjacent++; } else { adjacentArr.push(adjacent);adjacent = 0;  }
        if (Number(str[x]) > Number(str[x+1])) increasing = false;
    }
    adjacentArr.push(adjacent);

    if (adjacentArr.filter(e => e === 1).length === 0 || !increasing) return false;

    return true;
}

let part1 = 0;
let part2 = 0;

for (let i = from; i < to; i++) {
    if (meetsCriteriaPart1(i))
        part1++;
    if (meetsCriteriaPart2(i))
        part2++;
}

console.log(`Part1: ${part1}`);
console.log(`Part2: ${part2}`);
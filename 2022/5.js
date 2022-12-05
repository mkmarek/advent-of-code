const fs = require('fs');
const { sum, groupBy, toKeyValue, intersect, distinct, iterateTwoDimArray} = require('../utils');

const input = fs.readFileSync('5.txt').toString()
  .split('\n')

function part1() {
  let stacks = [];

  let i = 0;
  for (; i < input.length; i++) {
    if (input[i].trim() === '') {
      break;
    }

    let c = input[i].split(' ');
    
    let stackIndex = 0;
    for (let m = 0; m < c.length; m++) {
      if (c[m].trim() === '') {
        m += 3;
        stackIndex++;
        continue;
      }

      if (c[m][0] === '[') {
        stacks[stackIndex] = stacks[stackIndex] || [];
        stacks[stackIndex].push(c[m].substring(1, 2));
        stackIndex++;
      }
    }
  }

  for (let m = 0; m < stacks.length; m++) {
    stacks[m] = stacks[m].reverse();
  }

  for (; i < input.length; i++) {
    let g = input[i].split(' ');
    let num = parseInt(g[1]);
    let from = parseInt(g[3]);
    let to = parseInt(g[5]);

    let fromStack = stacks[from-1];
    let toStack = stacks[to - 1];
    
    for (let b = 0; b < num; b++) {
      toStack.push(fromStack.pop());
    }
  }

  return stacks.map(e => e[e.length-1]).join('');
}

function part2() {
  let stacks = [];

  let i = 0;
  for (; i < input.length; i++) {
    if (input[i].trim() === '') {
      break;
    }

    let c = input[i].split(' ');
    
    let stackIndex = 0;
    for (let m = 0; m < c.length; m++) {
      if (c[m].trim() === '') {
        m += 3;
        stackIndex++;
        continue;
      }

      if (c[m][0] === '[') {
        stacks[stackIndex] = stacks[stackIndex] || [];
        stacks[stackIndex].push(c[m].substring(1, 2));
        stackIndex++;
      }
    }
  }

  for (let m = 0; m < stacks.length; m++) {
    stacks[m] = stacks[m].reverse();
  }

  for (; i < input.length; i++) {
    let g = input[i].split(' '); 
    let num = parseInt(g[1]);
    let from = parseInt(g[3]);
    let to = parseInt(g[5]);

    let fromStack = stacks[from-1];
    let toStack = stacks[to - 1];
    
    let tmp = [];
    for (let b = 0; b < num; b++) {
      tmp.push(fromStack.pop());
    }

    for (let b = 0; b < num; b++) {
      toStack.push(tmp.pop());
    }
  }

  return stacks.map(e => e[e.length-1]).join('');
}

console.log(`Part1: ${part1()}`)
console.log(`Part2: ${part2()}`)
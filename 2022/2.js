const fs = require('fs');
const { sum, groupBy, toKeyValue, intersect, distinct, iterateTwoDimArray} = require('../utils');

const input = fs.readFileSync('2.txt').toString()
  .trim()
  .split('\n')
  .map(e => e.split(' ').map(e => e.trim()));

const left = {
  'A': 'rock',
  'B': 'paper',
  'C': 'scissors'
}

const right = {
  'X': 'rock',
  'Y': 'paper',
  'Z': 'scissors'
}


const scores = {
  'rock': 1,
  'paper': 2,
  'scissors': 3
}

const winning = {
  'rock': 'paper',
  'paper': 'scissors',
  'scissors': 'rock'
}

const losing = {
  'rock': 'scissors',
  'paper': 'rock',
  'scissors': 'paper'
}

function part1() {
  let score = 0;
  for (let i = 0; i < input.length; i++) {
    if (!input[i]) {
      continue;
    }

    let a = left[input[i][0]];
    let b = right[input[i][1]];

    score += scores[b];

    if (a === 'rock') {
      if (b === 'rock') {
        score += 3;
      }
      if (b === 'paper') {
        score += 6;
      }
      if (b === 'scissors') {
        // nothing
      }
    }

    if (a === 'paper') {
      if (b === 'rock') {
        // nothing
      }
      if (b === 'paper') {
        score += 3;
      }
      if (b === 'scissors') {
        score += 6;
      }
    }

    if (a === 'scissors') {
      if (b === 'rock') {
        score += 6;
      }
      if (b === 'paper') {
        // nothing
      }
      if (b === 'scissors') {
        score += 3;
      }
    }
  }

  return score
}

function part2() {
  let score = 0;
  for (let i = 0; i < input.length; i++) {
    if (!input[i]) {
      continue;
    }

    let a = left[input[i][0]];
    let b = null;

    if (input[i][1] === 'X') {
      b = losing[a];
    }

    if (input[i][1] === 'Y') {
      b = a;
    }

    if (input[i][1] === 'Z') {
      b = winning[a];
    }

    score += scores[b];

    if (a === 'rock') {
      if (b === 'rock') {
        score += 3;
      }
      if (b === 'paper') {
        score += 6;
      }
      if (b === 'scissors') {
        // nothing
      }
    }

    if (a === 'paper') {
      if (b === 'rock') {
        // nothing
      }
      if (b === 'paper') {
        score += 3;
      }
      if (b === 'scissors') {
        score += 6;
      }
    }

    if (a === 'scissors') {
      if (b === 'rock') {
        score += 6;
      }
      if (b === 'paper') {
        // nothing
      }
      if (b === 'scissors') {
        score += 3;
      }
    }
  }

  return score
}

console.log(`Part1: ${part1()}`)
console.log(`Part2: ${part2()}`)
const fs = require("fs");
const { deepCopy, getNeighbors, distinct, sum } = require("../utils");

const data = fs
  .readFileSync("18.txt")
  .toString()
  .trim()
  .split("\n")
  .map(e => JSON.parse(e.trim()));

function add(a, b) {
  return [a, b];
}

function isArray(x) {
  return x instanceof Array;
}

function toPairs(input, parent = null) {
  if (isArray(input)) {
    const val = {}
    val.left = toPairs(input[0], val);
    val.right = toPairs(input[1], val);
    val.parent = parent;
    return val;
  }
  
  return input;
}

function isNumber(x) {
  return typeof x === "number";
}

function findFirstLeftNumber(pair) {
  let parent = pair.parent;
  let p = pair;
  while (parent && parent.left === p) {
    p = parent;
    parent = parent.parent;
  }

  if (!parent) return null;

  if (isNumber(parent.left)) {
    return [parent, 'left'];
  }

  parent = parent.left;

  while (parent && !isNumber(parent.right)) {
    parent = parent.right;
  }

  if (!parent) return null;

  return [parent, 'right'];
}

function findFirstRightNumber(pair) {
  let parent = pair.parent;
  let p = pair;
  while (parent && parent.right === p) {
    p = parent;
    parent = parent.parent;
  }

  if (!parent) return null;

  if (isNumber(parent.right)) {
    return [parent, 'right'];
  }

  parent = parent.right;

  while (parent && !isNumber(parent.left)) {
    parent = parent.left;
  }

  if (!parent) return null;

  return [parent, 'left'];
}

function explode(pair) {
  let noAtLeft = findFirstLeftNumber(pair);
  let noAtRight = findFirstRightNumber(pair);

  if (noAtLeft !== null && noAtLeft[1] == 'right') {
    noAtLeft[0].right += pair.left;
  } else if (noAtLeft !== null && noAtLeft[1] == 'left') {
    noAtLeft[0].left += pair.left;
  }

  if (noAtRight !== null && noAtRight[1] == 'right') {
    noAtRight[0].right += pair.right;
  } else if (noAtRight !== null && noAtRight[1] == 'left') {
    noAtRight[0].left += pair.right;
  }
  
  if (pair === pair.parent.left) {
    pair.parent.left = 0;
  } else if (pair === pair.parent.right) {
    pair.parent.right = 0;
  } else {
    throw 'not found';
  }
}

function split(pair, left) {
  // console.log('SPLIT: ', JSON.stringify(backToArr(pair)), left);
  const value = left ? pair.left : pair.right;
  const leftVal = Math.floor(value / 2);
  const rightVal = Math.ceil(value / 2);
  const val = { left: leftVal, right: rightVal, parent: pair };

  if (left) {
    pair.left = val;
  } else {
    pair.right = val;
  }
}

function backToArr(p) {
  if (isNumber(p)) {
    return p;
  }

  return [backToArr(p.left), backToArr(p.right)];
}

function reduce(input) {
  const pairs = toPairs(input);
  while (true) {
    // console.log('PRE: ', JSON.stringify(backToArr(pairs)));
    if (findToExplode(pairs)) {
      // console.log('EXPLODE: ', JSON.stringify(backToArr(pairs)));
      continue;
    }

    if (findToSplit(pairs)) {
      // console.log('SPLIT: ', JSON.stringify(backToArr(pairs)));
      continue;
    }

    break;
  }
  return backToArr(pairs);
}

function sumMag(arr) {
  if (isNumber(arr)) {
    return arr;
  }

  return 3 * sumMag(arr[0]) + 2 * sumMag(arr[1]);
}

// [[[[7,7],[7,8]],[[9,5],[8,7]]],[[[6,8],[0,8]],[[9,9],[9,0]]]]
function part1(input) {
  let sum = input[0];
  for (let i = 1; i < input.length; i++) {
    sum = reduce(add(sum, input[i]))
  }
  
  return sumMag(sum);
}

function findToSplit(input) {
  if (isNumber(input.left) && input.left >= 10) {
    split(input, true);
    return true;
  }

  if (!isNumber(input.left) && findToSplit(input.left)) {
    return true;
  }

  if (isNumber(input.right) && input.right >= 10) {
    split(input, false);
    return true;
  }

  if (!isNumber(input.right) && findToSplit(input.right)) {
    return true;
  }

  return false;
}

function findToExplode(input, level = 0) {
  if (isNumber(input.left) && isNumber(input.right) && level >= 4) {
    // console.log('Exploding: ', JSON.stringify(backToArr(input)));
    explode(input);
    return true;
  }

  if (!isNumber(input.left) && findToExplode(input.left, level + 1)) {
    return true;
  }

  if (!isNumber(input.right) && findToExplode(input.right, level + 1)) {
    return true;
  }

  return false;
}

function part2(input) {
  let maxMag = 0;
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input.length; j++) {
      if (i === j) continue;
      const mag = sumMag(reduce(add(input[i], input[j])))
      if (maxMag < mag) {
        maxMag = mag;
      }
    }
  }
  
  return maxMag;
}

console.log(`Part1: ${part1(deepCopy(data))}`);
console.log(`Part2: ${part2(deepCopy(data))}`);

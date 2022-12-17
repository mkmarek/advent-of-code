const fs = require("fs");
const PriorityQueue = require("javascript-priority-queue");
const {QuadTree, Box} = require('js-quadtree');
const {
  sum,
  groupBy,
  toKeyValue,
  intersect,
  distinct,
  iterateTwoDimArray,
  deepCopy,
  getNeighbors,
  makeGraph,
  cache,
} = require("../utils");

const input = fs.readFileSync("17.txt").toString().trim().split("");

const shapes = `####

.#.
###
.#.

..#
..#
###

#
#
#
#

##
##`
  .split("\n\n")
  .map((e) =>
    e
      .trim()
      .split("\n")
      .filter((e) => e.length)
      .map((x) => x.split("").filter((x) => x.length))
);
  
function shapeBoundsWithoutPosition(shape) {
  let bounds = { x1: null, y1: null, x2: null, y2: null };

  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x] === "#") {
        if (
          bounds.x1 === null ||
          bounds.y1 === null ||
          bounds.x2 === null ||
          bounds.y2 === null
        ) {
          bounds.x1 = x;
          bounds.y1 = y;
          bounds.x2 = x;
          bounds.y2 = y;
        } else {
          bounds.x1 = Math.min(bounds.x1, x);
          bounds.y1 = Math.min(bounds.y1, y);
          bounds.x2 = Math.max(bounds.x2, x);
          bounds.y2 = Math.max(bounds.y2, y);
        }
      }
    }
  }

  return bounds;
}

const boundsForShapes = shapes.map(e => shapeBoundsWithoutPosition(e));

function shapeBounds(shapeIndex, position) {
  const bounds = boundsForShapes[shapeIndex]

  return {
    x1: bounds.x1 + position.x,
    x2: bounds.x2 + position.x + 1,
    y1: bounds.y1 + position.y,
    y2: bounds.y2 + position.y + 1,
  };
}

function isPointInShape(point, shap) {
  const shape = shapes[shap.shape];
  const relative = {
    x: point.x - shap.position.x,
    y: point.y - shap.position.y,
  };

  if (shape[relative.y] && shape[relative.y][relative.x] === "#") {
    return true;
  }

  return false;
}

function boundsOverlap(a, b) {
  return a.y1 <= b.y2 && b.x1 <= a.x2 && a.x1 <= b.x2 && b.y1 <= a.y2;
}

function shapesOverlap(a, b) {
  const boundsA = shapeBounds(a.shape, a.position);
  const boundsB = shapeBounds(b.shape, b.position);

  if (!boundsOverlap(boundsA, boundsB)) {
    return false;
  }

  const shape = shapes[a.shape];
  for (let y = boundsA.y1; y < boundsA.y2; y++) {
    for (let x = boundsA.x1; x < boundsA.x2; x++) {
      if (shape[y - boundsA.y1][x - boundsA.x1] === "#") {
        if (isPointInShape({ x, y }, b)) {
          return true;
        }
      }
    }
  }

  return false;
}

function part1(interval) {
  const chamber = [];
  let fallingShape = null;
  let shapeIndex = 0;
  let yLimit = -3;
  let i = 0;
  let previous = 0;
  let iter = 0;
  let prevIter = 0;
  const diffs = [];

  while (true) {
    if (iter !== prevIter) {
      const diff = Math.abs(yLimit + 3) - previous;
      previous = Math.abs(yLimit + 3);
      prevIter = iter;
      diffs.push(diff)
    }
    if (iter === interval) {
      return [Math.abs(yLimit + 3), diffs];
    }

    if (fallingShape == null) {
      const bounds = shapeBounds(shapeIndex, { x: 0, y: 0 });
      fallingShape = {
        shape: shapeIndex,
        position: { x: 2, y: -bounds.y2 + yLimit },
      };
      shapeIndex = (shapeIndex + 1) % shapes.length;
    }

    let bounds = shapeBounds(fallingShape.shape, fallingShape.position);

    if (input[i] === ">") {
      let wouldOverlap = false;

      if (bounds.x2 < 7) {
        for (let s of chamber) {
          if (
            shapesOverlap(s, {
              shape: fallingShape.shape,
              position: {
                x: fallingShape.position.x + 1,
                y: fallingShape.position.y,
              },
            })
          ) {
            wouldOverlap = true;
            break;
          }
        }

        if (!wouldOverlap) {
          fallingShape.position.x++;
        }
      }
    }

    if (input[i] === "<") {
      if (bounds.x1 > 0) {
        let wouldOverlap = false;
        for (let s of chamber) {
          if (
            shapesOverlap(s, {
              shape: fallingShape.shape,
              position: {
                x: fallingShape.position.x - 1,
                y: fallingShape.position.y,
              },
            })
          ) {
            wouldOverlap = true;
            break;
          }
        }

        if (!wouldOverlap) {
          fallingShape.position.x--;
        }
      }
    }

    bounds = shapeBounds(fallingShape.shape, fallingShape.position);
    if (bounds.y2 === 0) {
      chamber.push(fallingShape);
      iter++;
      if (fallingShape.position.y - 3 < yLimit) {
        yLimit = fallingShape.position.y - 3
      }
      fallingShape = null;
      i = (i + 1) % input.length;
      continue;
    }

    for (let s of chamber) {
      if (
        shapesOverlap(s, {
          shape: fallingShape.shape,
          position: {
            x: fallingShape.position.x,
            y: fallingShape.position.y + 1,
          },
        })
      ) {
        chamber.push(fallingShape);
        iter++;
        if (fallingShape.position.y - 3 < yLimit) {
          yLimit = fallingShape.position.y - 3
        }
        fallingShape = null;
        break;
      }
    }

    if (fallingShape != null) {
      fallingShape.position.y++;
    }

    i = (i + 1) % input.length;
  }
}

function findRepeatedSubstrings(str, length) {
  let largest = '';
  let largestIndex = 0;

  for (let i = 0; i < str.length; i++) {
    for (let j = i + largest.length; j < str.length + 1; j++) {
      const substring = str.slice(i, j);
      if (str.indexOf(substring, j) !== -1) {
        if (largest.length < substring.length) {
          largest = substring;
          largestIndex = i;
        }
      }
    }
  }

  return [largest, largestIndex];
}

function part2() {
  const iters = 1000000000000;
  const [, diffs] = part1(Math.floor(input.length * 1.5))
 
  const diffsStr = diffs.join('');
  const [largestRepeatedSubstring, startIndex] = findRepeatedSubstrings(diffsStr);
  const beginning = diffs.slice(0, startIndex);
  const repetition = diffsStr.substring(startIndex, diffsStr.indexOf(largestRepeatedSubstring, startIndex + 1)).split('').map(Number)

  const repetitionSum = sum(repetition)
  const numReps = repetition.length;

  const itersWithoutStart = (iters - beginning.length);
  const numberOfCompleteRepetitions = Math.floor((itersWithoutStart - beginning.length) / numReps);
  const remainder = itersWithoutStart - numberOfCompleteRepetitions * numReps

  let value = sum(beginning) + numberOfCompleteRepetitions * repetitionSum;

  for (let i = 0; i < remainder; i++) {
    value += repetition[i];
  }

  return value;
}

console.log(`Part1: ${part1(2022)[0]}`);
console.log(`Part2: ${part2()}`);

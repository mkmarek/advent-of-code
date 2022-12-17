const fs = require("fs");
const PriorityQueue = require("javascript-priority-queue");
const { QuadTree, Box } = require("js-quadtree");
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

const boundsForShapes = shapes.map((e) => shapeBoundsWithoutPosition(e));

function shapeBounds(shapeIndex, position) {
  const bounds = boundsForShapes[shapeIndex];

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

function imprintShape(map, shape) {
  const bounds = shapeBounds(shape.shape, shape.position);

  for (let y = bounds.y1; y <= bounds.y2; y++) {
    for (let x = bounds.x1; x <= bounds.x2; x++) {
      if (isPointInShape({ x, y }, shape)) {
        map[`${x},${y}`] = true;
      }
    }
  }
}

function isShapeOnMap(map, shape) {
  const bounds = shapeBounds(shape.shape, shape.position);

  for (let y = bounds.y1; y <= bounds.y2; y++) {
    for (let x = bounds.x1; x <= bounds.x2; x++) {
      if (isPointInShape({ x, y }, shape)) {
        if (map[`${x},${y}`]) {
          return true;
        }
      }
    }
  }

  return false;
}

function part1(interval) {
  const map = {};
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
      diffs.push(diff);
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
      if (bounds.x2 < 7) {
        if (
          !isShapeOnMap(map, {
            shape: fallingShape.shape,
            position: {
              x: fallingShape.position.x + 1,
              y: fallingShape.position.y,
            },
          })
        ) {
          fallingShape.position.x++;
        }
      }
    }

    if (input[i] === "<") {
      if (bounds.x1 > 0) {
        if (
          !isShapeOnMap(map, {
            shape: fallingShape.shape,
            position: {
              x: fallingShape.position.x - 1,
              y: fallingShape.position.y,
            },
          })
        ) {
          fallingShape.position.x--;
        }
      }
    }

    bounds = shapeBounds(fallingShape.shape, fallingShape.position);
    if (bounds.y2 === 0) {
      imprintShape(map, fallingShape);
      iter++;
      if (fallingShape.position.y - 3 < yLimit) {
        yLimit = fallingShape.position.y - 3;
      }
      fallingShape = null;
      i = (i + 1) % input.length;
      continue;
    }

    if (
      isShapeOnMap(map, {
        shape: fallingShape.shape,
        position: {
          x: fallingShape.position.x,
          y: fallingShape.position.y + 1,
        },
      })
    ) {
      imprintShape(map, fallingShape);
      iter++;
      if (fallingShape.position.y - 3 < yLimit) {
        yLimit = fallingShape.position.y - 3;
      }
      fallingShape = null;
    }

    if (fallingShape != null) {
      fallingShape.position.y++;
    }

    i = (i + 1) % input.length;
  }
}

function findRepeatedSubstrings(str) {
  let largest = "";
  let largestIndex = 0;

  for (let i = 0; i < str.length; i++) {
    for (let j = i + largest.length; j < str.length + 1; j++) {
      const substring = str.slice(i, j);
      if (str.indexOf(substring, j) !== -1) {
        if (largest.length < substring.length) {
          largest = substring;
          largestIndex = i;
        }
      } else {
        break;
      }
    }
  }

  return [largest, largestIndex];
}

function part2() {
  const iters = 1000000000000;
  const [, diffs] = part1(Math.floor(input.length * 2));

  const diffsStr = diffs.join("");
  const [largestRepeatedSubstring, startIndex] =
    findRepeatedSubstrings(diffsStr);
  const beginning = diffs.slice(0, startIndex);
  const repetition = diffsStr
    .substring(
      startIndex,
      diffsStr.indexOf(largestRepeatedSubstring, startIndex + 1)
    )
    .split("")
    .map(Number);

  const repetitionSum = sum(repetition);
  const numReps = repetition.length;

  const itersWithoutStart = iters - beginning.length;
  const numberOfCompleteRepetitions = Math.floor(
    (itersWithoutStart - beginning.length) / numReps
  );
  const remainder = itersWithoutStart - numberOfCompleteRepetitions * numReps;

  let value = sum(beginning) + numberOfCompleteRepetitions * repetitionSum;

  for (let i = 0; i < remainder; i++) {
    value += repetition[i];
  }

  return value;
}

console.log(`Part1: ${part1(2022)[0]}`);
console.log(`Part2: ${part2()}`);

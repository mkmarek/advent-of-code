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

const input = fs.readFileSync("22.txt").toString().split("\r\n\r\n");

const map = input[0].split("\n").map((x) => x.trimEnd().split(""));
const path = input[1];

function turnDirectionClockwise(direction) {
  if (direction.x === 1) {
    return { x: 0, y: 1 };
  }

  if (direction.x === -1) {
    return { x: 0, y: -1 };
  }

  if (direction.y === 1) {
    return { x: -1, y: 0 };
  }

  if (direction.y === -1) {
    return { x: 1, y: 0 };
  }

  throw new Error("fsfsdfd");
}

function turnDirectionCounterClockwise(direction) {
  if (direction.x === 1) {
    return { x: 0, y: -1 };
  }

  if (direction.x === -1) {
    return { x: 0, y: 1 };
  }

  if (direction.y === 1) {
    return { x: 1, y: 0 };
  }

  if (direction.y === -1) {
    return { x: -1, y: 0 };
  }

  throw new Error("fsfsdfd");
}

function rowBounds(row) {
  if (!row) {
    return null;
  }

  let min = row.length;
  let max = 0;

  for (let i = 0; i < row.length; i++) {
    if (row[i] === "#" || row[i] === ".") {
      min = Math.min(i, min);
      max = Math.max(i, max);
    }
  }

  return { min, max };
}

function columnBounds(map, i) {
  const column = map.map((x) => x[i] || "");

  return rowBounds(column);
}

let cubeSize = 50;
const cubes = [];

function moveFromCubeBound(position, direction) {
  const cubeIndex = cubes.findIndex((c) =>
    isPointInCube(position.x, position.y, c)
  );

  if (cubeIndex === -1) {
    throw new Error("fsfsdf");
  }

  const currentCube = cubes[cubeIndex];

  ////////// cube 0
  if (direction.x === -1 && cubeIndex === 0) {
    const c = cubes[3];
    return [
      { x: c.x1, y: c.y2 - (position.y - currentCube.y1) },
      { x: 1, y: 0 }
    ];
  }

  if (direction.y === -1 && cubeIndex === 0) {
    const c = cubes[5];
    return [
      { x: c.x1, y: c.y1 + (position.x - currentCube.x1) },
      { x: 1, y:0 }
    ]
  }

  ////// Cube 1
  if (direction.y === -1 && cubeIndex === 1) {
    const c = cubes[5];
    return [
      { x: c.x1 + (position.x - currentCube.x1), y: c.y2 },
      { x: 0, y: -1 }
    ]
  }

  if (direction.x === 1 && cubeIndex === 1) {
    const c = cubes[4];
    return [
      { x: c.x2, y: c.y2 - (position.y - currentCube.y1) },
      { x: -1, y: 0 }
    ]
  }

  if (direction.y === 1 && cubeIndex === 1) {
    const c = cubes[2];
    return [
      { x: c.x2, y: c.y1 + (position.x - currentCube.x1) },
      { x: -1, y: 0 }
    ]
  }

  /// Cube 2
  if (direction.x === -1 && cubeIndex === 2) {
    const c = cubes[3];
    return [
      { x: c.x1 + (position.y - currentCube.y1), y: c.y1 },
      { x: 0, y: 1 }
    ]
  }

  if (direction.x === 1 && cubeIndex === 2) {
    const c = cubes[1];
    return [
      { x: c.x1 + (position.y - currentCube.y1), y: c.y2 },
      { x: 0, y: -1 }
    ]
  }

  // Cube 3
  if (direction.y === -1 && cubeIndex === 3) {
    const c = cubes[2];
    return [
      { x: c.x1, y: c.y1 + (position.x - currentCube.x1) },
      { x: 1, y: 0 }
    ]
  }

  if (direction.x === -1 && cubeIndex === 3) {
    const c = cubes[0];
    return [
      { x: c.x1, y: c.y2 - (position.y - currentCube.y1) },
      { x: 1, y: 0 }
    ]
  }

  // Cube 4
  if (direction.x === 1 && cubeIndex === 4) {
    const c = cubes[1];
    return [
      { x: c.x2, y: c.y2 - (position.y - currentCube.y1) },
      { x: -1, y: 0 }
    ]
  }

  if (direction.y === 1 && cubeIndex === 4) {
    const c = cubes[5];
    return [
      { x: c.x2, y: c.y1 + (position.x - currentCube.x1) },
      { x: -1, y: 0 }
    ]
  }

  // Cube 5
  if (direction.x === -1 && cubeIndex === 5) {
    const c = cubes[0];
    return [
      { x: c.x1 + (position.y - currentCube.y1), y: c.y1 },
      { x: 0, y: 1 }
    ]
  }

  if (direction.x === 1 && cubeIndex === 5) {
    const c = cubes[4];
    return [
      { x: c.x1 + (position.y - currentCube.y1), y: c.y2 },
      { x: 0, y: -1 }
    ]
  }

  if (direction.y === 1 && cubeIndex === 5) {
    const c = cubes[1];
    return [
      { x: c.x1 + (position.x - currentCube.x1), y: c.y1 },
      { x: 0, y: 1 }
    ]
  }

  console.log(cubeIndex, direction);

  throw new Error("!!!!!!!!!!!");
}

function isPointInCube(x, y, cube) {
  return x >= cube.x1 && x <= cube.x2 && y >= cube.y1 && y <= cube.y2;
}

for (let y = 0; y < map.length; y++) {
  for (let x = 0; x < map[y].length; x++) {
    if (
      (map[y][x] === "#" || map[y][x] === ".") &&
      !cubes.some((c) => isPointInCube(x, y, c))
    ) {
      cubes.push({ x1: x, y1: y, x2: x + cubeSize - 1, y2: y + cubeSize - 1 });
    }
  }
}

// for (let y = 0; y < map.length; y++) {
//   let line = "";
//   for (let x = 0; x < map[y].length; x++) {
//     let idx = cubes.findIndex((c) => isPointInCube(x, y, c));
//     if (idx === -1) {
//       line += " ";
//     } else {
//       line += idx;
//     }
//   }
//   console.log(line);
// }


function part1() {
  const stepsTaken = {};
  const steps = [];
  let n = "";
  for (let i = 0; i < path.length; i++) {
    if (["L", "R"].includes(path[i])) {
      steps.push([Number(n), path[i]]);
      n = "";
      continue;
    }

    n += path[i];
  }
  steps.push([Number(n), ""]);

  let currentDirection = { x: 1, y: 0 };
  let currentPosition = { x: map[0].indexOf("."), y: 0 };
  for (let i = 0; i < steps.length; i++) {
    const [n, direction] = steps[i];

    for (let x = 0; x < n; x++) {
      let oldPosition = deepCopy(currentPosition);
      let oldDirection = deepCopy(currentDirection);
      currentPosition.x += currentDirection.x;
      currentPosition.y += currentDirection.y;

      let wrap = false;
      if (currentDirection.x != 0) {
        let bounds = rowBounds(map[currentPosition.y]);
        if (currentPosition.x < bounds.min) {
          currentPosition.x = bounds.max;
        }
        if (currentPosition.x > bounds.max) {
          currentPosition.x = bounds.min;
        }
      }

      if (currentDirection.y != 0) {
        let bounds = columnBounds(map, currentPosition.x);
        if (currentPosition.y < bounds.min) {
          currentPosition.y = bounds.max;
        }
        if (currentPosition.y > bounds.max) {
          currentPosition.y = bounds.min;
        }
      }

      if (map[currentPosition.y][currentPosition.x] === "#") {
        currentPosition = oldPosition;
        currentDirection = oldDirection;
        break;
      }

      if (currentDirection.x === 1) {
        stepsTaken[`${currentPosition.x},${currentPosition.y}`] = ">";
      } else if (currentDirection.x === -1) {
        stepsTaken[`${currentPosition.x},${currentPosition.y}`] = "<";
      } else if (currentDirection.y === -1) {
        stepsTaken[`${currentPosition.x},${currentPosition.y}`] = "^";
      } else if (currentDirection.y === 1) {
        stepsTaken[`${currentPosition.x},${currentPosition.y}`] = "v";
      }
    }

    if (direction === "L") {
      currentDirection = turnDirectionCounterClockwise(currentDirection);
    } else if (direction === "R") {
      currentDirection = turnDirectionClockwise(currentDirection);
    } else {
      // throw new Error("fsfsdf");
    }
  }

  let facingValue = 0;
  if (currentDirection.x == 1 && currentDirection.y == 0) {
    facingValue = 0;
  } else if (currentDirection.x == 0 && currentDirection.y == 1) {
    facingValue = 1;
  } else if (currentDirection.x == -1 && currentDirection.y == 0) {
    facingValue = 2;
  } else if (currentDirection.x == 0 && currentDirection.y == -1) {
    facingValue = 3;
  }


  return (
    1000 * (currentPosition.y + 1) + 4 * (currentPosition.x + 1) + facingValue
  );
}

function part2() {
  const stepsTaken = {};
  const steps = [];
  let n = "";
  for (let i = 0; i < path.length; i++) {
    if (["L", "R"].includes(path[i])) {
      steps.push([Number(n), path[i]]);
      n = "";
      continue;
    }

    n += path[i];
  }
  steps.push([Number(n), ""]);

  let currentDirection = { x: 1, y: 0 };
  let currentPosition = { x: map[0].indexOf("."), y: 0 };
  for (let i = 0; i < steps.length; i++) {
    const [n, direction] = steps[i];

    for (let x = 0; x < n; x++) {
      let oldPosition = deepCopy(currentPosition);
      let oldDirection = deepCopy(currentDirection);
      currentPosition.x += currentDirection.x;
      currentPosition.y += currentDirection.y;

      let wrap = false;
      if (currentDirection.x != 0) {
        let bounds = rowBounds(map[currentPosition.y]);
        if (currentPosition.x < bounds.min) {
          // currentPosition.x = bounds.max;
          wrap = true;
        }
        if (currentPosition.x > bounds.max) {
          // currentPosition.x = bounds.min;
          wrap = true;
        }
      }

      if (currentDirection.y != 0) {
        let bounds = columnBounds(map, currentPosition.x);
        if (currentPosition.y < bounds.min) {
          // currentPosition.y = bounds.max;
          wrap = true;
        }
        if (currentPosition.y > bounds.max) {
          // currentPosition.y = bounds.min;
          wrap = true;
        }
      }

      if (wrap) {
        let [pos, dir] = moveFromCubeBound(oldPosition, currentDirection);
        
        currentPosition = pos;
        currentDirection = dir;
      }

      if (map[currentPosition.y][currentPosition.x] === "#") {
        currentPosition = oldPosition;
        currentDirection = oldDirection;
        break;
      }

      if (currentDirection.x === 1) {
        stepsTaken[`${currentPosition.x},${currentPosition.y}`] = ">";
      } else if (currentDirection.x === -1) {
        stepsTaken[`${currentPosition.x},${currentPosition.y}`] = "<";
      } else if (currentDirection.y === -1) {
        stepsTaken[`${currentPosition.x},${currentPosition.y}`] = "^";
      } else if (currentDirection.y === 1) {
        stepsTaken[`${currentPosition.x},${currentPosition.y}`] = "v";
      }
    }

    if (direction === "L") {
      currentDirection = turnDirectionCounterClockwise(currentDirection);
    } else if (direction === "R") {
      currentDirection = turnDirectionClockwise(currentDirection);
    } else {
      // throw new Error("fsfsdf");
    }
  }

  let facingValue = 0;
  if (currentDirection.x == 1 && currentDirection.y == 0) {
    facingValue = 0;
  } else if (currentDirection.x == 0 && currentDirection.y == 1) {
    facingValue = 1;
  } else if (currentDirection.x == -1 && currentDirection.y == 0) {
    facingValue = 2;
  } else if (currentDirection.x == 0 && currentDirection.y == -1) {
    facingValue = 3;
  }


  return (
    1000 * (currentPosition.y + 1) + 4 * (currentPosition.x + 1) + facingValue
  );
}


console.log(`Part1: ${part1()}`);
console.log(`Part2: ${part2()}`);

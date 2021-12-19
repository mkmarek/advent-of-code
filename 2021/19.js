const fs = require("fs");
const path = require("path");
const { deepCopy, getNeighbors, distinct, sum, findPermutations } = require("../utils");

function parseInput() {
  const data = fs
  .readFileSync("19.txt")
  .toString()
  .trim()
  .split("\n")
  .map(e => e.trim())
  .slice(1);
  
  const scanners = [];
  let points = [];
  for (let line of data) {
    if (line === '') continue;

    if (line.startsWith('--- scanner')) {
      scanners.push(points);
      points= [];
      continue;
    }

    points.push({ x: parseInt(line.split(',')[0]), y: parseInt(line.split(',')[1]),  z: parseInt(line.split(',')[2]) });
  }

  scanners.push(points);

  return scanners;
}

function rotate90Degrees(points, axis) {
  return points.map(e => {
    if (axis === 'x') {
      return { x: e.x, y: -e.z, z: e.y };
    } else if (axis === 'y') {
      return { x: e.z, y: e.y, z: -e.x };
    } else {
      return { x: -e.y, y: e.x, z: e.z };
    }
  });
}

function matchingPointsPosition(scannerA, scannerB) {
  let result = [];
  let allPoints = [];
  let d = null;

  for (let i = 0; i < scannerA.length; i++) {
    for (let j = 0; j < scannerB.length; j++) {
      const delta = { x: scannerA[i].x - scannerB[j].x, y: scannerA[i].y - scannerB[j].y, z: scannerA[i].z - scannerB[j].z };

      const withDelta = scannerB.map(p => ({ x: p.x + delta.x, y: p.y + delta.y, z: p.z + delta.z }));
      const points = withDelta.filter(e => scannerA.find(g => e.x === g.x && e.y === g.y && e.z === g.z));

      if (points.length >= 12) {
        result = points;
        allPoints = withDelta;
        d = delta;
        return [result, allPoints, d];
      }
    }
  }
  return [result, allPoints, d];
}

function matchingPointsPositionRotation(scannerA, scannerB) {
  let result = [];
  let allPoints = [];
  let dd = null;
  let rotation = null

  let rotatedX = scannerB;
  for (let rx = 0; rx < 4; rx++) {
    let rotatedY = rotatedX;
    for (let ry = 0; ry < 4; ry++) {
      let rotatedZ = rotatedY;
      for (let rz = 0; rz < 4; rz++) {
        const [points, all, delta] = matchingPointsPosition(scannerA, rotatedZ);
    
        if (points.length >= 12) {
          result = points;
          dd = delta;
          allPoints = all;
          rotation = { x: rx, y: ry, z: rz };
          return [result, allPoints, dd, rotation];
        }
    
        rotatedZ = rotate90Degrees(rotatedZ, 'z');
      }
  
      rotatedY = rotate90Degrees(rotatedY, 'y');
    }

    rotatedX = rotate90Degrees(rotatedX, 'x');
  }

  return [result, allPoints, dd, rotation];
}

function match(reference, input, visited = {}) {
  let allP = [...reference.points];
  for (let i = 0; i < input.length; i++) {
    if (input[i].index === reference.index) continue;
    if (visited[`${input[i].index}-${reference.index}`]) continue;

    visited[`${input[i].index}-${reference.index}`] = true;

    const [points, allPoints, delta, rotation] = matchingPointsPositionRotation(reference.points, input[i].points);

    if (points.length >= 12) {
      console.log(i, delta, rotation)
      allP.push(...match({ index: input[i].index, points: allPoints }, input.filter((e, k) => k !== i), visited));
    }
  }

  return distinct(allP);
}

function part1(input) {
  // input = input.map((e, i) => ({ index: i, points: e }));
  // const points = match(input[0], input.slice(1));

  // console.log(points.length);

  const points = [{ x: 1382, y: -30, z: -20 } ,
    { x: 1280, y: -1226, z: -40 },
    { x: 1258, y: -1243, z: 1158 },
    { x: 1254, y: -1265, z: 2471 } ,
    { x: 1212, y: -1236, z: 3556 },
    { x: 1252, y: -1184, z: 4724 },
    { x: 1276, y: 54, z: 3592 } ,
    { x: 1253, y: 14, z: 2421 },
    { x: 1267, y: 42, z: 1112 } ,
    { x: 2450, y: 92, z: 1130 } ,
    { x: 3785, y: 48, z: 1211 },
    { x: 2477, y: -47, z: 2 } ,
    { x: 2490, y: -5, z: -1182 },
    { x: 2480, y: -3, z: -2458 } ,
    { x: 2537, y: 1246, z: -2376 } ,
    { x: 2565, y: 1122, z: -1218 },
    { x: 2530, y: 2402, z: -1217 } ,
    { x: 1205, y: 1142, z: -1150 },
    { x: 1273, y: 1108, z: 78 } ,
    { x: 1321, y: 2335, z: 49 } ,
    { x: 3752, y: 1215, z: -1257 },
    { x: 3624, y: 61, z: -1278 } ,
    { x: 3687, y: -1240, z: -1176 } ,
    { x: 4847, y: -15, z: -1282 },
    { x: 4832, y: 80, z: -84 } ,
    { x: 6041, y: 14, z: -1191 } ,
    { x: 6132, y: -1177, z: -1173 },
    { x: 7324, y: -63, z: -1168 } ,
    { x: 8571, y: -45, z: -1296 } ,
    { x: 2566, y: -1130, z: -2367 } ,
    { x: 3624, y: 61, z: -1278 },
    { x: 3752, y: 1215, z: -1257 } ,
    { x: 2565, y: 1122, z: -1218 },
    { x: 2537, y: 1246, z: -2376 },
    { x: 2480, y: -3, z: -2458 } ,
    { x: 2565, y: 1122, z: -1218 } ,
    { x: 124, y: -1141, z: 2453 } ,
    { x: 1280, y: -2409, z: 2479 } ,
    { x: 2557, y: -1262, z: 2305 },
    { x: 1253, y: 14, z: 2421 } ,
    { x: 1276, y: 54, z: 3592 },
    { x: 1212, y: -1236, z: 3556 } ,
    { x: 1267, y: 42, z: 1112 },
    { x: 1253, y: 14, z: 2421 } ,
    { x: 1254, y: -1265, z: 2471 },
    { x: 1367, y: -2453, z: -57 },
    { x: 2468, y: -2482, z: 55 },
    { x: 3607, y: -2449, z: -97 } ,
    { x: 1370, y: -2400, z: -1165 },
    { x: 2477, y: -47, z: 2 },
    { x: 1267, y: 42, z: 1112 },
    { x: 1258, y: -1243, z: 1158 },
    { x: 1280, y: -1226, z: -40 },
    { x: 1267, y: 42, z: 1112 },
    { x: 1273, y: 1108, z: 78 } ,
    { x: 1205, y: 1142, z: -1150 } ,
    { x: 2565, y: 1122, z: -1218 },
    { x: 2490, y: -5, z: -1182 },
    { x: 2477, y: -47, z: 2 },
    { x: 172, y: 2, z: -1300 } ,
    { x: 150, y: 60, z: -2414 }];

  let maxDist = 0;
  for (let i = 0; i < points.length; i++) {
    for (let y = 0; y < points.length; y++) {
      if (i === y) continue;

      const dist = Math.abs(points[i].x - points[y].x) + Math.abs(points[i].y - points[y].y) + Math.abs(points[i].z - points[y].z);

      if (dist > maxDist) maxDist = dist;
    }
  }

  console.log(maxDist);
}

function part2(input) {
  
}

console.log(`Part1: ${part1(deepCopy(parseInput()))}`);
console.log(`Part2: ${part2(deepCopy(parseInput()))}`);

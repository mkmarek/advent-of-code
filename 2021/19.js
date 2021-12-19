const fs = require("fs");
const {
  distinct,
} = require("../utils");

function parseInput() {
  const data = fs
    .readFileSync("19.txt")
    .toString()
    .trim()
    .split("\n")
    .map((e) => e.trim())
    .slice(1);

  const scanners = [];
  let points = [];
  for (let line of data) {
    if (line === "") continue;

    if (line.startsWith("--- scanner")) {
      scanners.push(points);
      points = [];
      continue;
    }

    points.push({
      x: parseInt(line.split(",")[0]),
      y: parseInt(line.split(",")[1]),
      z: parseInt(line.split(",")[2]),
    });
  }

  scanners.push(points);

  return scanners;
}

function rotate90Degrees(points, axis) {
  return points.map((e) => {
    if (axis === "x") {
      return { x: e.x, y: -e.z, z: e.y };
    } else if (axis === "y") {
      return { x: e.z, y: e.y, z: -e.x };
    } else {
      return { x: -e.y, y: e.x, z: e.z };
    }
  });
}

function rotate(points, axis, times) {
  for (let i = 0; i < times; i++) {
    points = rotate90Degrees(points, axis);
  }

  return points;
}

const uniqueRotationIndexes = [
  { rx: 0, ry: 0, rz: 0 }, { rx: 0, ry: 0, rz: 1 },
  { rx: 0, ry: 0, rz: 2 }, { rx: 0, ry: 0, rz: 3 },
  { rx: 0, ry: 1, rz: 0 }, { rx: 0, ry: 1, rz: 1 },
  { rx: 0, ry: 1, rz: 2 }, { rx: 0, ry: 1, rz: 3 },
  { rx: 0, ry: 2, rz: 0 }, { rx: 0, ry: 2, rz: 1 },
  { rx: 0, ry: 2, rz: 2 }, { rx: 0, ry: 2, rz: 3 },
  { rx: 0, ry: 3, rz: 0 }, { rx: 0, ry: 3, rz: 1 },
  { rx: 0, ry: 3, rz: 2 }, { rx: 0, ry: 3, rz: 3 },
  { rx: 1, ry: 0, rz: 0 }, { rx: 1, ry: 0, rz: 1 },
  { rx: 1, ry: 0, rz: 2 }, { rx: 1, ry: 0, rz: 3 },
  { rx: 1, ry: 2, rz: 0 }, { rx: 1, ry: 2, rz: 1 },
  { rx: 1, ry: 2, rz: 2 }, { rx: 1, ry: 2, rz: 3 }
];

function matchingPointsPosition(scannerA, scannerB) {
  let result = [];
  let allPoints = [];
  let d = null;

  for (let i = 0; i < scannerA.length; i++) {
    for (let j = 0; j < scannerB.length; j++) {
      const delta = {
        x: scannerA[i].x - scannerB[j].x,
        y: scannerA[i].y - scannerB[j].y,
        z: scannerA[i].z - scannerB[j].z,
      };

      const withDelta = scannerB.map((p) => ({
        x: p.x + delta.x,
        y: p.y + delta.y,
        z: p.z + delta.z,
      }));
      const points = withDelta.filter((e) =>
        scannerA.find((g) => e.x === g.x && e.y === g.y && e.z === g.z)
      );

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
  let rotation = null;

  for (let rot of uniqueRotationIndexes) {
    const rotated = rotate(rotate(rotate(scannerB, "z", rot.rz), "y", rot.ry), "x", rot.rx);
    const [points, all, delta] = matchingPointsPosition(scannerA, rotated);

    if (points.length >= 12) {
      result = points;
      dd = delta;
      allPoints = all;
      rotation = rot;
      return [result, allPoints, dd, rotation];
    }
  }  

  return [result, allPoints, dd, rotation];
}

function match(reference, input, visited = {}) {
  let allP = [...reference.points];
  let allSensors = [];

  for (let i = 0; i < input.length; i++) {
    if (input[i].index === reference.index) continue;
    if (visited[`${input[i].index}-${reference.index}`]) continue;

    visited[`${input[i].index}-${reference.index}`] = true;

    const [points, allPoints, delta, _] = matchingPointsPositionRotation(
      reference.points,
      input[i].points
    );

    if (points.length >= 12) {
      console.log(
        `Found matching points for ${reference.index} => ${input[i].index}`
      );
      allSensors.push(delta);
      const [pp, ss] = match(
        { index: input[i].index, points: allPoints },
        input.filter((e, k) => k !== i),
        visited
      );
      allP.push(...pp);
      allSensors.push(...ss);
    }
  }

  return [allP, allSensors];
}

function solve(input) {
  input = input.map((e, i) => ({ index: i, points: e }));
  const [points, sensors] = match(input[0], input.slice(1));

  const distinctPoints = distinct(points);
  const distinctSensors = distinct(sensors);

  console.log(`Part1: ${distinctPoints.length}`);

  let maxDist = 0;
  for (let i = 0; i < distinctSensors.length; i++) {
    for (let y = 0; y < distinctSensors.length; y++) {
      if (i === y) continue;
      const dist =
        Math.abs(distinctSensors[i].x - distinctSensors[y].x) +
        Math.abs(distinctSensors[i].y - distinctSensors[y].y) +
        Math.abs(distinctSensors[i].z - distinctSensors[y].z);
      if (dist > maxDist) maxDist = dist;
    }
  }

  console.log(`Part2: ${maxDist}`);
}

solve(parseInput());

const fs = require("fs");

function parseInput() {
  const data = fs
    .readFileSync("22.txt")
    .toString()
    .trim()
    .split("\n")
    .map((e) => e.trim())
    .filter((e) => e);

  const result = [];

  for (let line of data) {
    const parts = line.split(" ");
    const status = parts[0];

    const item = { status };
    const elms = parts[1].split(",");
    for (let elm of elms) {
      const [name, value] = elm.split("=");
      const [from, to] = value.split("..").map(Number);
      item[name] = { from: Math.min(from, to), to: Math.max(from, to) };
    }

    result.push(item);
  }

  return result;
}

function part1(input) {
  const cube = [];
  for (let i = 0; i < input.length; i++) {
    const item = input[i];
    for (
      let x = Math.max(-50, Math.min(item.x.from, item.x.to));
      x <= Math.min(50, Math.max(item.x.from, item.x.to));
      x++
    ) {
      if (!cube[x]) cube[x] = [];
      for (
        let y = Math.max(-50, Math.min(item.y.from, item.y.to));
        y <= Math.min(50, Math.max(item.y.from, item.y.to));
        y++
      ) {
        if (!cube[x][y]) cube[x][y] = [];
        for (
          let z = Math.max(-50, Math.min(item.z.from, item.z.to));
          z <= Math.min(50, Math.max(item.z.from, item.z.to));
          z++
        ) {
          cube[x][y][z] = item.status;
        }
      }
    }
  }

  let cnt = 0;
  for (let x = -50; x <= 50; x++) {
    if (!cube[x]) continue;
    for (let y = -50; y <= 50; y++) {
      if (!cube[x][y]) continue;
      for (let z = -50; z <= 50; z++) {
        if (cube[x][y][z] === "on") cnt++;
      }
    }
  }

  return cnt;
}

function isTheSame(a, b) {
  return (
    a.x.from === b.x.from &&
    a.x.to === b.x.to &&
    a.y.from === b.y.from &&
    a.y.to === b.y.to &&
    a.z.from === b.z.from &&
    a.z.to === b.z.to
  );
}

function overlaps(a, b) {
  return !(
    b.x.from > a.x.to ||
    b.x.to < a.x.from ||
    b.y.from > a.y.to ||
    b.y.to < a.y.from ||
    b.z.from > a.z.to ||
    b.z.to < a.z.from
  );
}

function getOverlappingVolume(a, b) {
  const fromX = Math.max(a.x.from, b.x.from);
  const fromY = Math.max(a.y.from, b.y.from);
  const fromZ = Math.max(a.z.from, b.z.from);

  const toX = Math.min(a.x.to, b.x.to);
  const toY = Math.min(a.y.to, b.y.to);
  const toZ = Math.min(a.z.to, b.z.to);

  return {
    x: { from: fromX, to: toX },
    y: { from: fromY, to: toY },
    z: { from: fromZ, to: toZ },
  };
}

function splitCubeByAxis(a, axis, locations) {
  const result = [];

  if (axis === "x") {
    let last = a.x.from;
    for (let loc of locations) {
      result.push({
        x: { from: last, to: loc },
        y: { from: a.y.from, to: a.y.to },
        z: { from: a.z.from, to: a.z.to },
      });
      last = loc;
    }

    result.push({
      x: { from: last, to: a.x.to },
      y: { from: a.y.from, to: a.y.to },
      z: { from: a.z.from, to: a.z.to },
    });
  }

  if (axis === "y") {
    let last = a.y.from;
    for (let loc of locations) {
      result.push({
        x: { from: a.x.from, to: a.x.to },
        y: { from: last, to: loc },
        z: { from: a.z.from, to: a.z.to },
      });
      last = loc;
    }
    result.push({
      x: { from: a.x.from, to: a.x.to },
      y: { from: last, to: a.y.to },
      z: { from: a.z.from, to: a.z.to },
    });
  }

  if (axis === "z") {
    let last = a.z.from;
    for (let loc of locations) {
      result.push({
        x: { from: a.x.from, to: a.x.to },
        y: { from: a.y.from, to: a.y.to },
        z: { from: last, to: loc },
      });
      last = loc;
    }

    result.push({
      x: { from: a.x.from, to: a.x.to },
      y: { from: a.y.from, to: a.y.to },
      z: { from: last, to: a.z.to },
    });
  }

  return result;
}

function splitCubeByOtherCube(a, b) {
  if (isTheSame(a, b)) return [];

  const overlapping = getOverlappingVolume(a, b);

  const xAxis = [];
  const yAxis = [];
  const zAxis = [];

  if (overlapping.x.from != a.x.from && overlapping.x.from != a.x.to) xAxis.push(overlapping.x.from);
  if (overlapping.x.to != a.x.from && overlapping.x.to != a.x.to) xAxis.push(overlapping.x.to);

  if (overlapping.y.from != a.y.from && overlapping.y.from != a.y.to) yAxis.push(overlapping.y.from);
  if (overlapping.y.to != a.y.from && overlapping.y.to != a.y.to) yAxis.push(overlapping.y.to);

  if (overlapping.z.from != a.z.from && overlapping.z.from != a.z.to) zAxis.push(overlapping.z.from);
  if (overlapping.z.to != a.z.from && overlapping.z.to != a.z.to) zAxis.push(overlapping.z.to);

  const xSplits = [...splitCubeByAxis(a, "x", xAxis)];
  const ySplits = xSplits.reduce((acc, cur) => ([...acc, ...splitCubeByAxis(cur, "y", yAxis)]), []);
  const zSplits = ySplits.reduce((acc, cur) => ([...acc, ...splitCubeByAxis(cur, "z", zAxis)]), []);

  return zSplits.filter(
    (e) => e.x.from <= e.x.to && e.y.from <= e.y.to && e.z.from <= e.z.to
  );
}

function grow(a) {
  const x = a.x.from;
  const y = a.y.from;
  const z = a.z.from;

  return {
    ...a,
    x: { from: x, to: a.x.to + 1 },
    y: { from: y, to: a.y.to + 1 },
    z: { from: z, to: a.z.to + 1 },
  };
}

function getVolume(a) {
  return (
    (a.x.to - a.x.from) * (a.y.to - a.y.from) * (a.z.to - a.z.from)
  );
}

function part2(input) {
  let active = [];

  for (let i = 0; i < input.length; i++) {
    let newActive = [];
    let cube = grow(input[i])

    for (let j = 0; j < active.length; j++) {
      if (overlaps(cube, active[j])) {
        const overlapping = getOverlappingVolume(active[j], cube);
        newActive.push(...splitCubeByOtherCube(active[j], cube).filter(e => !isTheSame(overlapping, e)));
      } else {
        newActive.push(active[j]);
      }
    }

    if (cube.status === "on") {
      newActive.push(cube);
    }

    active = newActive;
  }

  return active.reduce((acc, cur) => acc + getVolume(cur), 0);
}

console.log(`Part1: ${part1(parseInput())}`);
console.log(`Part2: ${part2(parseInput())}`);

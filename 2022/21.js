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

const input = fs
  .readFileSync("21.txt")
  .toString()
  .trim()
  .split("\n")
  .map((e) => ({
    monkey: e.split(":")[0],
    waits: e
      .split(":")[1]
      .split(" ")
      .map((e) => e.trim())
      .filter((e) => e),
  }))
  .map((e) => {
    if (e.waits.length === 1) {
      return {
        monkey: e.monkey,
        waits: Number(e.waits[0]),
      };
    }
    return e;
  })
  .reduce(
    (acc, e) => ({
      ...acc,
      [e.monkey]: e.waits,
    }),
    {}
  );

function part1() {
  const clone = deepCopy(input);

  let substituted = false;
  do {
    substituted = false;
    for (const [key, value] of Object.entries(clone)) {
      if (typeof value === "number") {
        continue;
      }
      const newWaits = value.map((e) => {
        if (typeof clone[e] === "number") {
          substituted = true;
          return clone[e];
        }
        return e;
      });

      if (
        newWaits.length === 3 &&
        typeof newWaits[0] === "number" &&
        typeof newWaits[2] === "number"
      ) {
        if (newWaits[1] === "+") {
          clone[key] = newWaits[0] + newWaits[2];
        }
        if (newWaits[1] === "*") {
          clone[key] = newWaits[0] * newWaits[2];
        }
        if (newWaits[1] === "/") {
          clone[key] = newWaits[0] / newWaits[2];
        }
        if (newWaits[1] === "-") {
          clone[key] = newWaits[0] - newWaits[2];
        }
        substituted = true;
      } else {
        clone[key] = newWaits;
      }
    }
  } while (substituted);

  return clone.root;
}

function part2() {
  const clone = deepCopy(input);
  clone["humn"] = ["?"];

  let substituted = false;
  do {
    substituted = false;
    for (const [key, value] of Object.entries(clone)) {
      if (typeof value === "number") {
        continue;
      }
      const newWaits = value.map((e) => {
        if (typeof clone[e] === "number") {
          substituted = true;
          return clone[e];
        }
        return e;
      });

      if (
        newWaits.length === 3 &&
        typeof newWaits[0] === "number" &&
        typeof newWaits[2] === "number"
      ) {
        if (newWaits[1] === "+") {
          clone[key] = newWaits[0] + newWaits[2];
        }
        if (newWaits[1] === "*") {
          clone[key] = newWaits[0] * newWaits[2];
        }
        if (newWaits[1] === "/") {
          clone[key] = newWaits[0] / newWaits[2];
        }
        if (newWaits[1] === "-") {
          clone[key] = newWaits[0] - newWaits[2];
        }
        substituted = true;
      } else {
        clone[key] = newWaits;
      }
    }
  } while (substituted);

  const eq = clone["root"];
  const queue = [eq];

  while (queue.length) {
    const current = queue.shift();
    if (typeof current === "number") {
      continue;
    }
    if (Array.isArray(current)) {
      if (current[0] === "?") {
        continue
      }

      const a = typeof current[0] === "number" ? current[0] : clone[current[0]];
      const b = typeof current[2] === "number" ? current[2] : clone[current[2]];
      current[0] = a;
      current[2] = b;

      queue.push(a, b);
    }    
  }
  
  let equation = clone.root[0];
  let expected = clone.root[2];

  while (equation.length !== 1) {
    if (typeof equation[0] === "number") {
      if (equation[1] === '+') {
        expected = expected - equation[0];
      }
      if (equation[1] === '*') {
        expected = expected / equation[0];
      }
      if (equation[1] === '/') {
        let tmp = expected;
        expected = equation[0];
        equation = [tmp, '*', equation[2]]
        continue;
      }
      if (equation[1] === '-') {
        expected = expected - equation[0];
        expected = expected * -1;
      }

      equation = equation[2];
    } else if (typeof equation[2] === "number") {
      if (equation[1] === '+') {
        expected = expected - equation[2];
      }
      if (equation[1] === '*') {
        expected = expected / equation[2];
      }
      if (equation[1] === '/') {
        expected = expected * equation[2];
      }
      if (equation[1] === '-') {
        expected = expected + equation[2];
      }

      equation = equation[0];
    }
  }

  return expected;
}

console.log(`Part1: ${part1()}`);
console.log(`Part2: ${part2()}`);

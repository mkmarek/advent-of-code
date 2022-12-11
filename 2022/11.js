const fs = require("fs");
const {
  sum,
  groupBy,
  toKeyValue,
  intersect,
  distinct,
  iterateTwoDimArray,
  deepCopy,
} = require("../utils");

const input = fs
  .readFileSync("11.txt")
  .toString()
  .trim()
  .split("\r\n\r\n")
  .map((x) => ({
    monkey: Number(x.split("\r\n")[0].split(" ")[1].slice(0, -1)),
    items: x.split("\r\n")[1].split(": ")[1].split(",").map(Number),
    operation: x.split("\r\n")[2].split(": ")[1].trim(),
    test: Number(x.split("\r\n")[3].split(": ")[1].trim().split(" ")[2]),
    ifTrue: Number(x.split("\r\n")[4].split(": ")[1].trim().split(" ")[3]),
    ifFalse: Number(x.split("\r\n")[5].split(": ")[1].trim().split(" ")[3]),
  }));

function evalExpression(expr, old) {
  if (expr.startsWith("new =")) {
    let parts = expr.split(" ");

    let a = 0;
    if (parts[2] == "old") {
      a = old;
    } else {
      a = Number(parts[2]);
    }

    let b = 0;
    if (parts[4] == "old") {
      b = old;
    } else {
      b = Number(parts[4]);
    }

    if (parts[3] == "+") {
      return a + b;
    }

    if (parts[3] == "*") {
      return a * b;
    }

    if (parts[3] == "-") {
      return a - b;
    }
  }

  throw new Error("Unexpected expression: " + expr);
}

function runRound(monkeys, inspects, worryModifier) {
  for (let i = 0; i < monkeys.length; i++) {
    for (let j = 0; j < monkeys[i].items.length; j++) {
      inspects[i] = (inspects[i] || 0) + 1;
      let worryLevel = worryModifier(
        evalExpression(monkeys[i].operation, monkeys[i].items[j])
      );

      if (worryLevel % monkeys[i].test == 0) {
        monkeys[monkeys[i].ifTrue].items.push(worryLevel);
        monkeys[i].items = monkeys[i].items
          .slice(0, j)
          .concat(monkeys[i].items.slice(j + 1));
        j--;
      } else {
        monkeys[monkeys[i].ifFalse].items.push(worryLevel);
        monkeys[i].items = monkeys[i].items
          .slice(0, j)
          .concat(monkeys[i].items.slice(j + 1));
        j--;
      }
    }
  }
}

function part1() {
  let monkeys = deepCopy(input);

  let inspects = [];
  for (let round = 0; round < 20; round++) {
    runRound(monkeys, inspects, (x) => Math.floor(x / 3));
  }

  return inspects
    .sort((a, b) => b - a)
    .slice(0, 2)
    .reduce((a, b) => a * b, 1);
}

function part2() {
  let monkeys = deepCopy(input);

  let productOfWorries = 1;
  for (let i = 0; i < input.length; i++) {
    productOfWorries *= input[i].test;
  }

  let inspects = [];
  for (let round = 0; round < 10000; round++) {
    runRound(monkeys, inspects, (x) => x % productOfWorries);
  }

  return inspects
    .sort((a, b) => b - a)
    .slice(0, 2)
    .reduce((a, b) => a * b, 1);
}

console.log(`Part1: ${part1()}`);
console.log(`Part2: ${part2()}`);

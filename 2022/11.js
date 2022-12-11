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
    test: x.split("\r\n")[3].split(": ")[1].trim(),
    ifTrue: x.split("\r\n")[4].split(": ")[1].trim(),
    ifFalse: x.split("\r\n")[5].split(": ")[1].trim(),
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

  throw new Error("!= new =");
}

function part1() {
  let monkeys = deepCopy(input);

  let inspects = [];
  for (let round = 0; round < 20; round++) {
    for (let i = 0; i < monkeys.length; i++) {
      for (let j = 0; j < monkeys[i].items.length; j++) {
        inspects[i] = (inspects[i] || 0) + 1;
        let worryLevel = Math.floor(
          evalExpression(monkeys[i].operation, monkeys[i].items[j]) / 3
        );

        if (monkeys[i].test.startsWith("divisible by ")) {
          let n = Number(monkeys[i].test.split(" ")[2]);
          if (worryLevel % n == 0) {
            if (monkeys[i].ifTrue.startsWith("throw to monkey ")) {
              let m = Number(monkeys[i].ifTrue.split(" ")[3]);
              monkeys[m].items.push(worryLevel);
              monkeys[i].items = monkeys[i].items
                .slice(0, j)
                .concat(monkeys[i].items.slice(j + 1));
              j--;
            } else {
              throw new Error("!= throw to monkey");
            }
          } else {
            if (monkeys[i].ifFalse.startsWith("throw to monkey ")) {
              let m = Number(monkeys[i].ifFalse.split(" ")[3]);
              monkeys[m].items.push(worryLevel);
              monkeys[i].items = monkeys[i].items
                .slice(0, j)
                .concat(monkeys[i].items.slice(j + 1));
              j--;
            } else {
              throw new Error("!= throw to monkey");
            }
          }
        } else {
          throw new Error("!= divisible by");
        }
      }
    }
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
    productOfWorries *= input[i].test.split(" ")[2];
  }

  let inspects = [];
  for (let round = 0; round < 10000; round++) {
    for (let i = 0; i < monkeys.length; i++) {
      for (let j = 0; j < monkeys[i].items.length; j++) {
        inspects[i] = (inspects[i] || 0) + 1;
        let worryLevel =
          evalExpression(monkeys[i].operation, monkeys[i].items[j]) %
          productOfWorries;

        if (monkeys[i].test.startsWith("divisible by ")) {
          let n = Number(monkeys[i].test.split(" ")[2]);
          if (worryLevel % n == 0) {
            if (monkeys[i].ifTrue.startsWith("throw to monkey ")) {
              let m = Number(monkeys[i].ifTrue.split(" ")[3]);
              monkeys[m].items.push(worryLevel);
              monkeys[i].items = monkeys[i].items
                .slice(0, j)
                .concat(monkeys[i].items.slice(j + 1));
              j--;
            } else {
              throw new Error("!= throw to monkey");
            }
          } else {
            if (monkeys[i].ifFalse.startsWith("throw to monkey ")) {
              let m = Number(monkeys[i].ifFalse.split(" ")[3]);
              monkeys[m].items.push(worryLevel);
              monkeys[i].items = monkeys[i].items
                .slice(0, j)
                .concat(monkeys[i].items.slice(j + 1));
              j--;
            } else {
              throw new Error("!= throw to monkey");
            }
          }
        } else {
          throw new Error("!= divisible by");
        }
      }
    }
  }

  return inspects
    .sort((a, b) => b - a)
    .slice(0, 2)
    .reduce((a, b) => a * b, 1);
}

console.log(`Part1: ${part1()}`);
console.log(`Part2: ${part2()}`);

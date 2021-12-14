const fs = require("fs");
const {
  deepCopy,
} = require("../utils");

const data = fs
  .readFileSync("14.txt")
  .toString()
  .split("\n")
  .map((line) => line.trim());

const template = data[0].split("");
const rules = data
  .slice(2)
  .filter((e) => e)
  .map((e) => e.split(" -> "));

function part1(template, rules) {
  for (let step = 0; step < 10; step++) {
    for (let i = 0; i < template.length - 1; i++) {
      const rule = rules.find(
        (e) => e[0][0] === template[i] && e[0][1] === template[i + 1]
      );
      if (rule) {
        template.splice(i + 1, 0, rule[1]);
        i++;
      }
    }
  }

  const occurences = {};
  for (let i = 0; i < template.length; i++) {
    if (occurences[template[i]]) {
      occurences[template[i]]++;
    } else {
      occurences[template[i]] = 1;
    }
  }

  return (
    Math.max(...Object.values(occurences)) -
    Math.min(...Object.values(occurences))
  );
}

function part2(template, rules) {
  let pairs = {};
  for (let i = 0; i < template.length - 1; i++) {
    if (!pairs[template[i] + template[i + 1]])
      pairs[template[i] + template[i + 1]] = 0;
    pairs[template[i] + template[i + 1]]++;
  }

  const occurences = {};
  for (let i = 0; i < template.length; i++) {
    if (!occurences[template[i]]) occurences[template[i]] = 0;
    occurences[template[i]]++;
  }

  for (let step = 0; step < 40; step++) {
    const keys = Object.keys(pairs);
    const newPairs = { ...pairs };
    for (let i = 0; i < keys.length; i++) {
      if (!pairs[keys[i]]) continue;
      const rule = rules.find((e) => e[0] === keys[i]);
      if (rule) {
        const onePair = `${keys[i][0]}${rule[1]}`;
        const secondPair = `${rule[1]}${keys[i][1]}`;

        if (!newPairs[onePair]) newPairs[onePair] = 0;
        if (!newPairs[secondPair]) newPairs[secondPair] = 0;

        const val = pairs[keys[i]];

        newPairs[keys[i]] -= val;
        newPairs[onePair] += val;
        newPairs[secondPair] += val;

        if (!occurences[rule[1]]) occurences[rule[1]] = 0;
        occurences[rule[1]] += val;
      }
    }
    pairs = newPairs;
  }

  return Math.ceil(
    Math.max(...Object.values(occurences)) -
      Math.min(...Object.values(occurences))
  );
}

console.log(`Part1: ${part1(deepCopy(template), rules)}`);
console.log(`Part2: ${part2(deepCopy(template), rules)}`);

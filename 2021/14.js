const fs = require("fs");

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

function run(template, rules, steps) {
  let pairs = template.slice(1).reduce((acc, e, i) => ({ ...acc, [`${template[i]}${e}`]: (acc[`${template[i]}${e}`] || 0) + 1 }), {});
  const occurences = template.reduce((acc, e, i) => ({ ...acc, [e]: (acc[e] || 0) + 1 }), {});

  for (let step = 0; step < steps; step++) {
    const newPairs = { ...pairs };
    for (const key of Object.keys(pairs)) {
      if (!pairs[key]) continue;     
      const rule = rules.find((e) => e[0] === key);
      if (rule) {
        const first = `${key[0]}${rule[1]}`;
        const second = `${rule[1]}${key[1]}`;

        newPairs[key] -= pairs[key];
        newPairs[first] = (newPairs[first] || 0) + pairs[key];
        newPairs[second] = (newPairs[second] || 0) + pairs[key];
        occurences[rule[1]] = (occurences[rule[1]] || 0) + pairs[key];
      }
    }
    pairs = newPairs;
  }

  return Math.ceil(
    Math.max(...Object.values(occurences)) -
      Math.min(...Object.values(occurences))
  );
}

function part1(template, rules) {
  return run(template, rules, 10);
}

function part2(template, rules) {
  return run(template, rules, 40);
}

console.log(`Part1: ${part1(template, rules)}`);
console.log(`Part2: ${part2(template, rules)}`);

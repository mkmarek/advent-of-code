const fs = require("fs");
const PriorityQueue = require("javascript-priority-queue");
const {
  sum,
  groupBy,
  toKeyValue,
  intersect,
  distinct,
  iterateTwoDimArray,
  deepCopy,
  getNeighbors,
} = require("../utils");

const input = fs
  .readFileSync("16.txt")
  .toString()
  .trim()
  .split("\n")
  .map((e) => ({
    valve: e.split(" ")[1],
    flowRate: parseInt(e.split(" ")[4].split("=")[1]),
    valves: e
      .replace(/, /g, ",")
      .split(" ")[9]
      .split(",")
      .map((e) => e.trim()),
  }));

function score(opened, minutes) {
  let count = 0;
  for (let k in opened) {
    const ff = input.find(e => e.valve === k);
    if (!ff) continue;
    count += (minutes - opened[k]) * ff.flowRate;
  }
  return count;
}

function makeGraph() {
  const graph = {};

  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].valves.length; j++) {
      const valve = input[i].valve;
      graph[valve] = graph[valve] || [];
      graph[valve].push({ valve: input[i].valves[j], cost: 1 });
    }
  }

  for (let i = 0; i < input.length; i++) {
    if (input[i].flowRate === 0 && input[i].valve !== 'AA') {
      for (let k in graph) {
        const distances = graph[k]
          .map((e) => e.valve === input[i].valve ? graph[e.valve].map(x => ({ valve: x.valve, cost: e.cost + x.cost })) : [e])
          .flat()
          .reduce((p, c) => ({ ...p, [c.valve]: Math.min(c.cost, (p[c.valve] || {}).cost || 9999999)}), {});

        graph[k] = Object.keys(distances).map((e) => ({ valve: e, cost: distances[e] })).filter(e => e.valve !== k);
      }
      delete graph[input[i].valve];
    }
  }

  for (let gg in graph) {
    graph[gg] = [...graph[gg].map(e => ({ valve: `${e.valve}`, cost: e.cost + 1 })), ...graph[gg].map(e => ({ valve: `M_${e.valve}`, cost: e.cost }))]
  }

  return graph;
}

function makeKey(el) {
  return JSON.stringify({ visited: el.ownVisited.sort(), valve: el.valve, cost: el.cost });
}

function part1(minutes, visitedState) {
  const graph = makeGraph();

  const queue = new PriorityQueue.default('max');
  const close = {};

  queue.enqueue({ valve: 'AA', visited: visitedState, cost: 0, ownVisited: [] }, 0);

  let max = 0;
  let maxVisited = null;

  while (queue.size()) {
    const el = queue.dequeue();
    const s = score(el.visited, minutes);

    close[makeKey(el)] = s;

    if (s > max) {
      max = s;
      maxVisited = el.visited;

      console.log(max)
    }
    
    const neighbors = graph[el.valve] || [];
    for (let i = 0; i < neighbors.length; i++) {
      const neighbor = neighbors[i];

      if (el.cost + neighbor.cost > minutes) continue;

      const newVisited = { ...el.visited, [neighbor.valve]: Math.min(el.visited[neighbor.valve] || 9999999, el.cost + neighbor.cost)};
      const newScore = score(newVisited, minutes);

      let valve = neighbor.valve;
      if (valve.startsWith('M_')) {
        valve = valve.replace('M_', '');
      }

      const newEl = { valve, visited: newVisited, cost: el.cost + neighbor.cost, ownVisited: distinct([...el.ownVisited, neighbor.valve])};
      
      if (close[makeKey(newEl)] >= newScore) continue;

      queue.enqueue(newEl, newScore);
    }
  }

  return [max, maxVisited];
}

function part2() {
  const [max, maxVisited] = part1(26, {});
  const [max2, maxVisited2] = part1(26, maxVisited);

  console.log(max, max2, maxVisited, maxVisited2)

  return max2;
}

// console.log(`Part1: ${part1(30, {})[0]}`);
console.log(`Part2: ${part2()}`);

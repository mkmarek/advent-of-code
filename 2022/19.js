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

function removeDot(str) {
  return str.replace(/\./g, "");
}

const input = fs
  .readFileSync("19.txt")
  .toString()
  .trim()
  .split("\n")
  .map((x) => x.split(": ")[1])
  //Each ore robot costs 4 ore
  // Each obsidian robot costs 3 ore and 14 clay
  .map((x) =>
    x.split(". ").map((v) => ({
      material: v.split(" ")[1],
      cost: v
        .substring(v.indexOf("costs") + "costs".length + 1)
        .split("and")
        .map((h) => ({
          amount: Number(h.trim().split(" ")[0]),
          material: removeDot(h.trim().split(" ")[1]),
        })),
    }))
  );

function notBuiltRobots(state, recipe) {
  return recipe.filter((x) => !state.robots[x.material]);
}

function possibleActions(state, recipe) {
  if (state.minute >= 32) {
    return [];
  }

  const maxNeededMaterials = recipe.reduce((acc, x) => {
    for (let y of x.cost) {
      acc[y.material] = Math.max(acc[y.material] || 0,  y.amount);
    }
    return acc;
  }, {});

  maxNeededMaterials['geode'] = 999999;

  const possibleRobots = recipe.filter((x) =>
    x.cost.every((y) => state.materials[y.material] >= y.amount)
  ).filter(x => !state.robots[x.material] || state.robots[x.material] < maxNeededMaterials[x.material]);

  const neededRobots = recipe.filter(x => !state.robots[x.material] || state.robots[x.material] < maxNeededMaterials[x.material]);

  const actions = possibleRobots.map((x) => ({
    type: "build",
    robot: x.material,
  }));

  // const notbuilt = notBuiltRobots(state, recipe);

  // const newActions = actions.filter(x => notbuilt.some(y => y.material === x.robot));
  // if (newActions.length) {
  //   return newActions;
  // }

  if (actions.length === 0 || neededRobots.length > 0) {
    actions.push({
      type: "wait",
    });
  }

  // console.log(actions);

  return distinct(actions);
}

const priority = {
  'ore': 1,
  'clay': 10,
  'obsidian': 100,
  'geode': 1000,
}

function score(state, recipe) {
  return state.minute * (notBuiltRobots(state,recipe).length + 1);
}

function getCloseKey(state) {
  return JSON.stringify({ minutes: state.minutes, materials: state.materials, robots: state.robots });
}

function part1() {
  let values = [];
  for (let h = 2; h < Math.min(input.length, 3); h++) {
    let max = 0;
    const maxInMinutes = {};

    const state = {
      minute: 0,
      robots: {
        ore: 1,
      },
      materials: {
        ore: 0,
      },
    };

    const recipe = input[h];
    console.log("iter", h);
    const open = new PriorityQueue.default("min");
    const close = {};
    const actionCache = {};
    open.enqueue(state, 0);

    while (open.size()) {
      const current = open.dequeue();

      const key = getCloseKey(current);
      // if (close[key] < score(current, recipe)) {
      //   continue;
      // }
      // close[key] = score(current, recipe);
      // // console.log(current);

      let hasMoreInPreviousMinutes = false;
      for (let i = 0; i <= current.minute; i++) {
        if (maxInMinutes[i] && maxInMinutes[i]["geode"] >= (current.robots["geode"] || 0) &&
          maxInMinutes[i]["ore"] >= (current.robots["ore"] || 0) &&
          maxInMinutes[i]["clay"] >= (current.robots["clay"] || 0) &&
          maxInMinutes[i]["obsidian"] >= (current.robots["obsidian"] || 0)) {
          hasMoreInPreviousMinutes = true;
          break;
        }
      }

      if (hasMoreInPreviousMinutes) {
        continue;
      }

      // console.log(current);
      // console.log(maxInMinutes, current.minute, current.materials['geode'] || 0, maxInMinutes[current.minute] || 0)
      maxInMinutes[current.minute] = {
        ... current.robots
      }

      if ((current.materials["geode"] || 0) > max) {
        max = current.materials["geode"] || 0;
        console.log("max:", max, current, open.size());
      }

      // console.log(key)
       {
        const newStates = [];
        const actions = possibleActions(current, recipe);

        for (let action of actions) {
          if (action.type === "wait") {
            const newMaterials = {
              ...current.materials,
            };

            for (let robot of Object.keys(current.robots)) {
              newMaterials[robot] =
                (newMaterials[robot] || 0) + current.robots[robot];
            }

            const newState = {
              ...current,
              materials: newMaterials,
              minute: current.minute + 1,
            };

            newStates.push(newState);
            // open.enqueue(newState, score(newState, recipe));
            continue;
          }

          if (action.type === "build") {
            const newMaterials = {
              ...current.materials,
            };

            for (let robot of Object.keys(current.robots)) {
              newMaterials[robot] =
                (newMaterials[robot] || 0) + current.robots[robot];
            }

            for (let cost of recipe.find((x) => x.material === action.robot)
              .cost) {
              newMaterials[cost.material] -= cost.amount;
            }

            const newState = {
              ...current,
              robots: {
                ...current.robots,
                [action.robot]: (current.robots[action.robot] || 0) + 1,
              },
              minute: current.minute + 1,
              materials: newMaterials,
            };

            newStates.push(newState);
            // open.enqueue(newState, score(newState, recipe));
            continue;
          }
        }

        actionCache[key] = newStates;

        const keys = [];
        for (let newState of newStates) {
          const k = getCloseKey(newState);
          if (!actionCache[k]) {
            open.enqueue(newState, score(newState, recipe));
            keys.push(k);
          }
        }

        for (let k of keys) {
          actionCache[k] = true;
        }
      }
    }

    values.push(max);
  }

  console.log(values);
  return values.reduce((p, c) => p * c, 1);
  // return values.reduce((a, b, i) => a + b * (i + 1), 0);
  // return max * maxIndex;
}

// function part2() {
//   for (let i = 0; i < input.length; i++) {
//     const recipe = input[i];
//     let geodesAtMinutes = [];
//     let state = {
//       minute: 0,
//       robots: {
//         ore: 1,
//       },
//       materials: {},
//       actions: [],
//     };

//     while (true) {
//       state = findFastestRouteToGeode(state, recipe);

//       if (!state) {
//         break;
//       }

//       console.log(state);
//       if (state.minute > 32) {
//         break;
//       }

//       geodesAtMinutes.push({
//         minute: state.minute,
//         geodes: state.robots["geode"],
//       });
//       state.robots["geode"] = 0;
//     }

//     console.log(geodesAtMinutes);
//     console.log(geodesAtMinutes.reduce((a, b) => a + (32 - b.minute), 0));
//   }
// }

console.log(`Part1: ${part1()}`);
// console.log(`Part2: ${part2()}`);

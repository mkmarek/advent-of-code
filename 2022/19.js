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

function hasEnoughMaterialsFor(robot, state, recipe) {
  const neededMaterials = recipe.find((x) => x.material === robot).cost;
  return neededMaterials.every((x) => state.materials[x.material] >= x.amount);
}

function maximumNeededMaterialsPerTurn(state, recipe) {
  return recipe.reduce((acc, x) => {
    for (let y of x.cost) {
      acc[y.material] = Math.max(acc[y.material] || 0, y.amount);
    }
    return acc;
  }, {});
}

function possibleActions(state, recipe, maxMinutes) {
  if (state.minute >= maxMinutes) {
    return [];
  }

  const maxNeededMaterials = maximumNeededMaterialsPerTurn(state, recipe);

  if (hasEnoughMaterialsFor("geode", state, recipe)) {
    return [
      {
        type: "build",
        robot: "geode",
      },
    ];
  }

  const actions = [];
  for (let mat of ["ore", "clay", "obsidian"]) {
    if (
      state.robots[mat] < maxNeededMaterials[mat] &&
      hasEnoughMaterialsFor(mat, state, recipe)
    ) {
      actions.push({
        type: "build",
        robot: mat,
      });
    }

    const neededMaterials = distinct(
      recipe
        .filter(
          (e) => state.robots[e.material] < maxNeededMaterials[e.material]
        )
        .map((e) => e.cost)
        .flat()
        .filter((e) => e.material === mat)
        .map((e) => e.amount)
    );

    if (state.robots[mat] > 0) {
      let minNeeded = maxNeededMaterials[mat];
      for (let neededMaterial of neededMaterials) {
        if (
          neededMaterial < minNeeded &&
          state.materials[mat] < neededMaterial
        ) {
          minNeeded = neededMaterial;
        }
      }
      actions.push({
        type: "wait",
        material: mat,
        until: minNeeded,
      });
    }
  }

  return actions;
}

function score(state, recipe) {
  return state.minute; // / (recipe.filter(e => !state.robots[e.material]).length + 1)
}

function part1(minutes, length) {
  let values = [];
  for (let h = 0; h < length; h++) {
    let max = null;
    const recipe = input[h];
    const open = new PriorityQueue.default("min");
    const maxGeodesPerMinute = {};

    open.enqueue(
      {
        minute: 0,
        robots: {
          ore: 1,
          clay: 0,
          obsidian: 0,
          geode: 0,
        },
        materials: {
          ore: 0,
          clay: 0,
          obsidian: 0,
          geode: 0,
        },
      },
      0
    );

    const cache = {};

    while (open.size()) {
      const current = open.dequeue();
      const key = `materials:${Object.values(current.materials).join(
        ","
      )}:robots:${Object.values(current.robots).join(",")}`;

      if (cache[key]) {
        continue;
      }

      cache[key] = true;

      if (
        maxGeodesPerMinute[current.minute - 2] &&
        maxGeodesPerMinute[current.minute - 2] >
          (current.materials["geode"] || 0)
      ) {
        continue;
      }

      if (
        !max ||
        (current.materials["geode"] || 0) > (max.materials["geode"] || 0)
      ) {
        max = current;
        maxGeodesPerMinute[current.minute] = current.materials["geode"] || 0;
        console.log(
          "Blueprint:",
          h + 1,
          "geodes:",
          max.materials["geode"],
          "minute:",
          max.minute,
          "queue size:",
          open.size()
        );
      }

      const actions = possibleActions(current, recipe, minutes);

      for (let action of actions) {
        if (action.type === "wait") {
          const newMaterials = {
            ...current.materials,
          };

          let mm = current.minute;
          while (mm < minutes && newMaterials[action.material] < action.until) {
            for (let robot of Object.keys(current.robots)) {
              newMaterials[robot] =
                (newMaterials[robot] || 0) + current.robots[robot];
            }
            mm++;
          }

          const newState = {
            ...current,
            materials: newMaterials,
            minute: mm,
          };

          open.enqueue(newState, score(newState, recipe));
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

          open.enqueue(newState, score(newState, recipe));
        }
      }
    }

    values.push(max.materials["geode"]);
  }

  return values;
}

console.log(
  `Part1: ${part1(24, input.length).reduce((a, b, i) => a + b * (i + 1), 0)}`
);
console.log(
  `Part2: ${part1(32, Math.min(input.length, 3)).reduce((a, b) => a * b, 1)}`
);

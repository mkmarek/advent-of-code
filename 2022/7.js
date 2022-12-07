const fs = require("fs");
const {
  sum,
  groupBy,
  toKeyValue,
  intersect,
  distinct,
  iterateTwoDimArray,
} = require("../utils");

const input = fs
  .readFileSync("7.txt")
  .toString()
  .trim()
  .split("\n")
  .map((x) => x.trim().split(" "));

function updateSizes(root) {
  let size = 0;

  for (let i = 0; i < root.files.length; i++) {
    if (root.files[i].type === "dir") {
      size += updateSizes(root.files[i]);
    } else {
      size += root.files[i].size;
    }
  }

  root.size = size;

  return size;
}

function processInput() {
  let root = { type: "dir", name: "/", files: [], parent: null };
  let currentDir = root;

  for (let i = 0; i < input.length; i++) {
    if (input[i][0] === "$") {
      if (input[i][1] === "cd") {
        if (input[i][2] === "..") {
          currentDir = currentDir.parent;
          continue;
        } else if (input[i][2] === ".") {
          continue;
        } else if (input[i][2] === "/") {
          currentDir = root;
          continue;
        } else {
          let cdTo = currentDir.files.find((x) => x.name === input[i][2]);

          if (cdTo) {
            currentDir = cdTo;
            continue;
          }

          cdTo = {
            type: "dir",
            name: input[i][2],
            files: [],
            parent: currentDir,
          };
          currentDir.files.push(cdTo);

          currentDir = cdTo;
        }
      } else if (input[i][1] === "ls") {
        continue;
      }
    } else if (input[i][0] === "dir") {
      let cdTo = currentDir.files.find((x) => x.name === input[i][1]);

      if (!cdTo) {
        cdTo = {
          type: "dir",
          name: input[i][1],
          files: [],
          parent: currentDir,
        };
        currentDir.files.push(cdTo);
      }
    } else {
      let size = parseInt(input[i][0]);
      let cdTo = currentDir.files.find((x) => x.name === input[i][1]);

      if (!cdTo) {
        cdTo = { type: "file", name: input[i][1], size, parent: currentDir };
        currentDir.files.push(cdTo);
      }
    }
  }

  updateSizes(root);

  return root;
}

function part1() {
  const root = processInput();

  function getDirsWithMaxSize(root, maxSize) {
    let dirs = [];

    for (let i = 0; i < root.files.length; i++) {
      if (root.files[i].type === "dir") {
        if (root.files[i].size < maxSize) {
          dirs.push(root.files[i]);
        }

        dirs = dirs.concat(getDirsWithMaxSize(root.files[i], maxSize));
      }
    }

    return dirs;
  }

  return getDirsWithMaxSize(root, 100000).reduce((a, b) => a + b.size, 0);
}

function part2() {
  const root = processInput();

  let used = root.size;
  let total = 70000000;
  let free = total - used;
  let required = 30000000;

  function getDirsToFreeUpSpace(root) {
    let dirs = [];

    for (let i = 0; i < root.files.length; i++) {
      if (root.files[i].type === "dir") {
        if (free + root.files[i].size >= required) {
          dirs.push(root.files[i]);
        }

        dirs = dirs.concat(getDirsToFreeUpSpace(root.files[i]));
      }
    }

    return dirs;
  }

  return getDirsToFreeUpSpace(root).sort((a, b) => a.size - b.size)[0].size;
}

console.log(`Part1: ${part1()}`);
console.log(`Part2: ${part2()}`);

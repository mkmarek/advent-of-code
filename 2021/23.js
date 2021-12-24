const fs = require("fs");

function parseInput() {
  const data = fs
    .readFileSync("23.txt")
    .toString()
    .trim()
    .split("\r\n")
    .filter((e) => e)
    .map((e) => e.split(""));
  return data;
}

const rooms = { A: 3, B: 5, C: 7, D: 9 };

function getAmphipods(input) {
  const result = [];
  for (let x = 0; x < input.length; x++) {
    for (let y = 0; y < input[x].length; y++) {
      if (input[x][y] === "A") {
        result.push({
          type: "A",
          energyPerStep: 1,
          loc: [x, y],
          energy: 0,
          isAtTarget: y === rooms["A"] && x === input.length - 2,
        });
      }
      if (input[x][y] === "B") {
        result.push({
          type: "B",
          energyPerStep: 10,
          loc: [x, y],
          energy: 0,
          isAtTarget: y === rooms["B"] && x === input.length - 2,
        });
      }
      if (input[x][y] === "C") {
        result.push({
          type: "C",
          energyPerStep: 100,
          loc: [x, y],
          energy: 0,
          isAtTarget: y === rooms["C"] && x === input.length - 2,
        });
      }
      if (input[x][y] === "D") {
        result.push({
          type: "D",
          energyPerStep: 1000,
          loc: [x, y],
          energy: 0,
          isAtTarget: y === rooms["D"] && x === input.length - 2,
        });
      }
    }
  }
  return result;
}

function findPath(start, end, chars) {
  const gr = {};
  for (let ch of chars) {
    gr[`${ch.loc[0]},${ch.loc[1]}`] = true;
  }

  gr[`${start[0]},${start[1]}`] = false;

  if (start[0] === 1) {
    let delta = end[1] - start[1] > 0 ? 1 : -1;
    for (let i = start[1]; ; i += delta) {
      if (gr[`1,${i}`]) {
        return null;
      }
      if (i == end[1]) break;
    }

    return Math.abs(start[0] - end[0]) + Math.abs(start[1] - end[1]);
  } else {
    let delta = 1 - start[0] > 0 ? 1 : -1;
    for (let i = start[0]; ; i += delta) {
      if (gr[`${i},${start[1]}`]) {
        return null;
      }

      if (i == 1) break;
    }

    if (end[1] - start[1] !== 0) {
      delta = end[1] - start[1] > 0 ? 1 : -1;
      for (let i = start[1]; ; i += delta) {
        if (gr[`${1},${i}`]) {
          return null;
        }

        if (i == end[1]) break;
      }
    }

    return (
      Math.abs(start[0] - 1) +
      Math.abs(1 - end[0]) +
      Math.abs(start[1] - end[1])
    );
  }
}

function score(state) {
  const { chars } = state;
  let atTarget = 0;

  for (let c of chars) {
    if (c.isAtTarget) {
      atTarget++;
    }
  }

  return totalEnergy(state);
}

function performMove(state, destination) {
  state.chars = [...state.chars];

  state.chars[destination.charIndex] = {
    ...state.chars[destination.charIndex],
    loc: destination.to,
  };

  state.chars[destination.charIndex].energy +=
    destination.path * state.chars[destination.charIndex].energyPerStep;

  state.chars[destination.charIndex].isMoving = true;
  state.chars[destination.charIndex].isAtTarget = destination.moveToTarget;
}

function getPossibleTurns(state) {
  const { chars, map } = state;

  const result = [];
  const roomVertical = map.length == 5 ? 2 : 4;

  for (let i = 0; i < chars.length; i++) {
    const character = chars[i];
    const ownRoom = rooms[character.type];

    if (!character.isAtTarget && !character.isMoving) {
      for (let hallwayY of [1, 2, 4, 6, 8, 10, 11]) {
        let hallway = [1, hallwayY];
        let path = findPath(character.loc, hallway, chars, map);
        if (path) {
          result.push({ charIndex: i, from: chars[i].loc, to: hallway, path });
        }
      }
    }

    if (!character.isAtTarget) {
      let isOccupiedByOther = false;
      let lastEmpty = 2 + roomVertical - 1;
      for (let y = 2 + roomVertical - 1; y >= 2; y--) {
        const c = chars.find((e) => e.loc[0] === y && e.loc[1] === ownRoom);
        if (c) {
          lastEmpty = y - 1;
          if (c.type !== character.type) {
            isOccupiedByOther = true;
            break;
          }
        }
      }

      if (!isOccupiedByOther) {
        const pathToRoom = findPath(
          character.loc,
          [lastEmpty, ownRoom],
          chars,
          map
        );
        if (pathToRoom) {
          result.push({
            charIndex: i,
            from: chars[i].loc,
            to: [lastEmpty, ownRoom],
            path: pathToRoom,
            moveToTarget: true,
          });
        }
      }
    }
  }

  return result;
}

function totalEnergy(state) {
  return state.chars.reduce((acc, e) => acc + e.energy, 0);
}

function isFinal(state) {
  const { chars } = state;

  for (let c of chars) {
    if (!c.isAtTarget) return false;
  }

  return true;
}

function printState(state) {
  for (let x = 0; x < state.map.length; x++) {
    let row = "";
    for (let y = 0; y < state.map[x].length; y++) {
      const char = state.chars.find((e) => e.loc[0] === x && e.loc[1] === y);
      if (char) {
        row += char.type;
      } else {
        row += state.map[x][y] === '#' ? '#' : '.';
      }
    }
    console.log(row);
  }
}

let maxTurns = 0;
let lastEnergy = 333333333333;
function calc(state) {
  const energy = totalEnergy(state);

  if (lastEnergy < energy) return;

  if (maxTurns < state.turns) {
    console.log(state.turns);
    maxTurns = state.turns;

    // if (maxTurns > 8) {
    //   let cursor = state;
    //   while (cursor) {
    //     printState(cursor);
    //     cursor = cursor.parent;
    //   }
    //   return;
    // }
  }

  if (isFinal(state)) {
    if (energy < lastEnergy) {
      console.log("-----------NEW STATE-------------------");
      let cursor = state;
      while (cursor) {
        printState(cursor);
        cursor = cursor.parent;
      }
      console.log(energy);
      lastEnergy = energy;
      // return;
    }
  }

  const possible = getPossibleTurns(state);

  let states = [];
  for (let poss of possible) {
    const copy = { ...state, parent: state };

    performMove(copy, poss);
    copy.turns++;

    states.push(copy);
  }

  states = states.sort((a, b) => score(a) - score(b));

  for (let st of states) {
    calc(st);
  }
}

function part1(input) {
  calc({ chars: getAmphipods(input), map: input, turns: 0 });
}

function part2(input) {}

console.log(`Part1: ${part1(parseInput())}`);
console.log(`Part2: ${part2(parseInput())}`);

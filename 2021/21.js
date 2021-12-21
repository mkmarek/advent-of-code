const fs = require("fs");

function parseInput() {
  const data = fs
    .readFileSync("21.txt")
    .toString()
    .trim()
    .split("\n")
    .map((e) => e.trim().split(" "))
    .map((e) => ({
      player: e[1],
      position: parseInt(e[4]),
      points: 0,
    }));

  return data;
}

function part1(input) {
  let diceIndex = 1;
  let numberOfRolls = 0;

  while (true) {
    let isOver = false;
    for (let i = 0; i < input.length; i++) {
      const roll1 = diceIndex++;
      if (diceIndex > 100) diceIndex = 1;

      const roll2 = diceIndex++;
      if (diceIndex > 100) diceIndex = 1;

      const roll3 = diceIndex++;
      if (diceIndex > 100) diceIndex = 1;

      numberOfRolls += 3;

      const roll = roll1 + roll2 + roll3;
      let newPos = input[i].position + roll;

      while (newPos > 10) {
        newPos -= 10;
      }

      input[i].position = newPos;
      input[i].points += newPos;

      if (input[i].points >= 1000) {
        isOver = true;
        break;
      }
    }

    if (isOver) {
      const result = input.sort((a, b) => a.points - b.points);
      return result[0].points * numberOfRolls;
    }
  }
}

function getoutcomes() {
  return [
    [1, 1, 1],
    [1, 1, 2],
    [1, 1, 3],
    [1, 2, 1],
    [1, 2, 2],
    [1, 2, 3],
    [1, 3, 1],
    [1, 3, 2],
    [1, 3, 3],
    [2, 1, 1],
    [2, 1, 2],
    [2, 1, 3],
    [2, 2, 1],
    [2, 2, 2],
    [2, 2, 3],
    [2, 3, 1],
    [2, 3, 2],
    [2, 3, 3],
    [3, 1, 1],
    [3, 1, 2],
    [3, 1, 3],
    [3, 2, 1],
    [3, 2, 2],
    [3, 2, 3],
    [3, 3, 1],
    [3, 3, 2],
    [3, 3, 3],
  ].map((e) => e[0] + e[1] + e[2]);
}

function getCacheKey(player1, player2, isplayer1) {
  return JSON.stringify({
    player1,
    player2,
    isplayer1
  });
}

const stateCache = {};
function play(player1, player2, isplayer1) {
  const cacheKey = getCacheKey(player1, player2, isplayer1);

  if (stateCache[cacheKey]) {
    return stateCache[cacheKey];
  }

  let p1wins = 0;
  let p2wins = 0;

  for (let outcome of getoutcomes()) {
    const tmp = { ...(isplayer1 ? player1 : player2) };

    let newPos = tmp.position + Number(outcome);
    while (newPos > 10) {
      newPos -= 10;
    }

    tmp.position = newPos;
    tmp.points += newPos;

    if (tmp.points >= 21) {
      if (isplayer1) {
        p1wins++;
      }
      if (!isplayer1) {
        p2wins++;
      }
    } else {
      const [a, b] = isplayer1
        ? play(tmp, player2, !isplayer1)
        : play(player1, tmp, !isplayer1);

      p1wins += a;
      p2wins += b;
    }
  }

  stateCache[cacheKey] = [p1wins, p2wins];

  return [p1wins, p2wins];
}

function part2(input) {
  const [p1, p2] = play(input[0], input[1], true);

  return Math.max(p1, p2);
}

console.log(`Part1: ${part1(parseInput())}`);
console.log(`Part2: ${part2(parseInput())}`);

const fs = require("fs");
const { cache, groupBy } = require("../utils");

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

const cachedPlay = cache("play", play);
const diceOutcomes = { 3: 1, 4: 3, 5: 6, 6: 7, 7: 6, 8: 3, 9: 1 };
function play(player1, player2, isplayer1) {
  let p1wins = 0;
  let p2wins = 0;

  for (let outcome of Object.keys(diceOutcomes)) {
    const tmp = { ...(isplayer1 ? player1 : player2) };

    let newPos = tmp.position + Number(outcome);
    while (newPos > 10) {
      newPos -= 10;
    }

    tmp.position = newPos;
    tmp.points += newPos;

    if (tmp.points >= 21) {
      if (isplayer1) {
        p1wins += diceOutcomes[outcome];
      } else {
        p2wins += diceOutcomes[outcome];
      }
    } else {
      const [a, b] = isplayer1
        ? cachedPlay(tmp, player2, !isplayer1)
        : cachedPlay(player1, tmp, !isplayer1);

      p1wins += a * diceOutcomes[outcome];
      p2wins += b * diceOutcomes[outcome];
    }
  }

  return [p1wins, p2wins];
}

function part2(input) {
  return Math.max(...cachedPlay(input[0], input[1], true));
}

console.log(`Part1: ${part1(parseInput())}`);
console.log(`Part2: ${part2(parseInput())}`);

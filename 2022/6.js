const fs = require("fs");

const input = fs.readFileSync("6.txt").toString().trim();

function scan(uniqueCharacterSize) {
  for (let i = uniqueCharacterSize; i < input.length; i++) {
    if (
      new Set(input.substring(i - uniqueCharacterSize, i)).size ===
      uniqueCharacterSize
    ) {
      return i;
    }
  }
}

console.log(`Part1: ${scan(4)}`);
console.log(`Part2: ${scan(14)}`);

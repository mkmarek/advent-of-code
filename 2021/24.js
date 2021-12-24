const fs = require("fs");

function parseInput() {
  const data = fs
    .readFileSync("24.txt")
    .toString()
    .trim()
    .split("\n")
    .map((e) => e.trim())
    .filter((e) => e);

  const result = [];

  for (let line of data) {
    const ln = line.split(" ");
    result.push({ op: ln[0], a: ln[1], b: ln[2] });
  }

  return result;
}

function isNumber(x) {
  return !isNaN(x);
}

function evaluate(instr, input, variables) {
  switch (instr.op) {
    case "inp":
      variables[instr.a] = Number(input[variables.inpIndex++]);
      break;
    case "add":
      variables[instr.a] += isNumber(instr.b)
        ? Number(instr.b)
        : variables[instr.b];
      break;
    case "mul":
      variables[instr.a] *= isNumber(instr.b)
        ? Number(instr.b)
        : variables[instr.b];
      break;
    case "div":
      variables[instr.a] = Math.floor(
        variables[instr.a] /
          (isNumber(instr.b) ? Number(instr.b) : variables[instr.b])
      );
      break;
    case "mod":
      variables[instr.a] %= isNumber(instr.b)
        ? Number(instr.b)
        : variables[instr.b];
      break;
    case "eql":
      variables[instr.a] =
        (isNumber(instr.b) ? Number(instr.b) : variables[instr.b]) ===
        variables[instr.a]
          ? 1
          : 0;
      break;
    default:
      throw new Error(`Unknown op: ${instr.op}`);
      break;
  }
}

function makeCode(code, input, output) {
  for (let i = input.length - 1; i >= 0; i--) {
    const instr = input[i];
    switch (instr.op) {
      case "inp":
        output.push(code);
        code = "z";
        break;
      case "add":
        code = code.replace(
          new RegExp(instr.a, "g"),
          `(${instr.a} + ${instr.b})`
        );
        break;
      case "mul":
        if (instr.b === "0") {
          code = code.replace(new RegExp(instr.a, "g"), `0`);
        } else {
          code = code.replace(
            new RegExp(instr.a, "g"),
            `(${instr.a} * ${instr.b})`
          );
        }
        break;
      case "div":
        code = code.replace(
          new RegExp(instr.a, "g"),
          `Math.floor(${instr.a} / ${instr.b})`
        );
        break;
      case "mod":
        code = code.replace(
          new RegExp(instr.a, "g"),
          `(${instr.a} % ${instr.b})`
        );
        break;
      case "eql":
        code = code.replace(
          new RegExp(instr.a, "g"),
          `(${instr.a} === ${instr.b} ? 1 : 0)`
        );
        break;
      default:
        throw new Error(`Unknown op: ${instr.op}`);
        break;
    }
  }

  output.push(code);
}

function getFirstHalfMinMax(code) {
  let min = 0;
  let max = 0;
  const result = [];

  for (let i = 0; i < 8; i++) {
    let nmin = 999999999999999;
    let nmax = -999999999999999;

    for (let n = min; n <= max; n++) {
      for (let w = 1; w < 10; w++) {
        let val = code[i](n, w);
        nmin = Math.min(nmin, val);
        nmax = Math.max(nmax, val);
      }
    }

    min = nmin;
    max = nmax;

    result.push([min, max]);
  }

  return result;
}

function getSecondHalfMinMax(code) {
  let expectedValueMin = 0;
  let expectedValueMax = 0;
  const result = [[0, 0]];

  for (let i = 13; i >= 7; i--) {
    let nmin = 999999999999999;
    let nmax = -999999999999999;

    for (let zMult = 1; zMult < 100000; zMult++) {
      for (let z = 0; z <= 26; z++) {
        for (let w = 1; w < 10; w++) {
          let val = code[i](z * zMult, w);

          if (val >= expectedValueMin && val <= expectedValueMax) {
            nmin = Math.min(nmin, z * zMult);
            nmax = Math.max(nmax, z * zMult);
          }
        }
      }
    }

    result.push([nmin, nmax]);
    expectedValueMin = nmin;
    expectedValueMax = nmax;
  }

  return result;
}

function run(input) {
  let code = [];
  makeCode("z", input, code);
  code = code
    .filter((e) => e !== "z")
    .map((c) => eval(`(z, w) => ${c}`))
    .reverse();

  const first = getFirstHalfMinMax(code);
  const second = getSecondHalfMinMax(code);

  const limits = [];
  for (let i = 0; i < 14; i++) {
    const from = i < first.length ? first[i][0] : second[13 - i][0];
    const to = 13 - i < second.length ? second[13 - i][1] : first[i][1];
    limits[i] = [from, to];
  }

  let min = 09999999999999999999999999999;
  let max = 0;
  function calcNumber(z = 0, digits = "", index = 0) {
    for (let n = 1; n <= 9; n++) {
      const nz = code[index](z, n);

      if (nz >= limits[index][0] && nz <= limits[index][1]) {
        if (index === 13) {
          min = Math.min(min, parseInt(`${digits}${n}`));
          max = Math.max(max, parseInt(`${digits}${n}`));
          return;
        }

        calcNumber(nz, `${digits}${n}`, index + 1);
      }
    }
  }

  calcNumber();

  console.log(`Part1: ${max}`);
  console.log(`Part2: ${min}`);
}

run(parseInput());

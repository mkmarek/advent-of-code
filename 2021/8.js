const fs = require('fs');

const input = fs.readFileSync('8.txt').toString().split('\n')
    .map(e => ({ left: e.split(' | ')[0].split(' '), right: e.split(' | ')[1].split(' ').map(x => x.trim()) }));

const numbers = {
    0: '012456',
    1: '25',
    2: '02346',
    3: '02356',
    4: '1235',
    5: '01356',
    6: '013456',
    7: '025',
    8: '0123456',
    9: '012356'
}

function getDigit(digit, pattern) {
    const keys = Object.keys(numbers);

    for (let key of keys) {
        let value = numbers[key];
        let valueFromPattern = value.split('').map(x => pattern[Number(x)]);

        if (value.length !== digit.length) {
            continue;
        }

        let found = true;
        for (let i = 0; i < value.length; i++)
        {
            if (!valueFromPattern.includes(digit[i])) {
                found = false;
                break;
            }
        }

        if (found) {
            return key;
        }
    }

    return null;
}

function findPermutations (string) {
    if (string.length < 2) {
        return string
    }

    let permutationsArray = []

    for (let i = 0; i < string.length; i++) {
        let char = string[i]

        if (string.indexOf(char) != i)
            continue

        let remainingChars = string.slice(0, i) + string.slice(i + 1, string.length)

        for (let permutation of findPermutations(remainingChars)) {
            permutationsArray.push(char + permutation)
        }
    }
    return permutationsArray
}

function part1() {
    let cnt = 0;
    const keys = Object.keys(numbers);

    for (var i = 0; i < input.length; i++) {
        for (var y = 0; y < input[i].right.length; y++) {
            for (let key of keys) {
                if (numbers[key].length === input[i].right[y].length) {
                    if ([1, 4, 7, 8].includes(Number(key))) {
                        cnt++;
                        break;
                    }
                }
            }
        }
    }

    return cnt;
}

function part2() {
    const perm = findPermutations('abcdefg')
    let patterns = [];

    for (var i = 0; i < input.length; i++) {
        for (let pattern of perm) {
            let matches = true;
            for (var y = 0; y < input[i].left.length; y++) {
                if (getDigit(input[i].left[y], pattern) === null) {
                    matches = false;
                    break;
                }
            }

            if (!matches) continue;

            for (var y = 0; y < input[i].right.length; y++) {
                if (getDigit(input[i].right[y], pattern) === null) {
                    matches = false;
                    break;
                }
            }

            if (matches) {
                patterns.push(pattern);
                break;
            }
        }
    }

    let sum = 0;
    for (var i = 0; i < input.length; i++) {
        let pattern = patterns[i];

        let digits = '';
        for (let y = 0; y < input[i].right.length; y++) {
            digits += `${getDigit(input[i].right[y], pattern)}`;
        }

        sum += Number(digits);
    }

    return sum;
}

console.log(`Part1: ${part1()}`)
console.log(`Part2: ${part2()}`)
function sum(arr, foo = (a) => a) {
    return arr.reduce((a, b) => a + foo(b), 0);
}

function groupBy(arr, key = (a) => a) {
    return arr.reduce((a, b) => {
        let k = JSON.stringify(key(b));
        if (!a[k]) {
            a[k] = [];
        }
        a[k].push(b);
        return a;
    }, {});
}

function toKeyValue(obj) {
    return Object.keys(obj).map((k) => [k, obj[k]]);
}

function greatestCommonDivisor(x, y) {
    x = Math.abs(x);
    y = Math.abs(y);
    while (y) {
        var t = y;
        y = x % y;
        x = t;
    }
    return x;
}

function leastCommonMultiple(x, y) {
    return Math.floor(x / greatestCommonDivisor(x, y) * y)
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

function distinct(arr) {
    let keyMap = {};
    return arr.reduce((a, b) => {
        if (!keyMap[JSON.stringify(b)]) {
            a.push(b);
            keyMap[JSON.stringify(b)] = true;
        }
        return a;
    }, [])
}

function intersect(a, b) {
    const x = [...a];
    const y = [...b];
    const t = [];

    for (let i = 0; i < x.length; i++) {
        for (let j = 0; j < y.length; j++) {
            if (JSON.stringify(x[i]) === JSON.stringify(y[j])) {
                t.push(x[i]);
                x.splice(i, 1);
                y.splice(j, 1);
                i--;
                break;
            }
        }
    }

    return t;
}

function getNeighbors(pos, input) {
    let neighbors = [
        [- 1, 0],
        [+ 1, 0],
        [0, - 1],
        [0, + 1]
    ].map(e => ([e[0] + pos[0], e[1] + pos[1]]));

    return neighbors.filter(e => e[0] >= 0 && e[0] < input.length && e[1] >= 0 && e[1] < input[e[0]].length)
}

module.exports = {
    sum,
    groupBy,
    toKeyValue,
    greatestCommonDivisor,
    leastCommonMultiple,
    findPermutations,
    distinct,
    intersect,
    getNeighbors
};
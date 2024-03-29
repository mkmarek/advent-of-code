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

function findPermutations(string) {
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

const cacheStorage = {};
function cache(name, func) {
    return (...args) => {
        const key = `${name}-${JSON.stringify(args)}`;
        if (!cacheStorage[key]) {
            cacheStorage[key] = func(...args);
        }
        return cacheStorage[key];
    }   
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

function getNeighborsDiagonal(pos, input) {
    let neighbors = [
        [-1, 0],
        [+1, 0],
        [0, -1],
        [0, +1],
        [-1, +1],
        [+1, -1],
        [-1, -1],
        [+1, +1],
    ].map(e => ([e[0] + pos[0], e[1] + pos[1]]));

    return neighbors.filter(e => e[0] >= 0 && e[0] < input.length && e[1] >= 0 && e[1] < input[e[0]].length)
}

function iterateTwoDimArray(input, func) {
    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[i].length; j++) {
            const result = func(input[i][j], i, j);
            if (result !== undefined) {
                return result;
            }
        }
    }
}

function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function makeGraphBidirectional(input) {
    const graph = {};
    for (const [from, to] of input) {
        if (!graph[from]) graph[from] = [];
        if (!graph[to]) graph[to] = [];

        graph[from].push(to);
        graph[to].push(from);
    }
    return graph;
}

function makeGraph(input) {
    const graph = {};
    for (const [from, to] of input) {
        if (!graph[from]) graph[from] = [];

        graph[from].push(to);
    }
    return graph;
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
    getNeighbors,
    getNeighborsDiagonal,
    iterateTwoDimArray,
    deepCopy,
    makeGraph,
    makeGraphBidirectional,
    cache
};
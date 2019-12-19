const fs = require('fs');

const inputFile = fs.readFileSync('18.txt').toString().split('\n')
    .map(e => e.trim().split(''));

const deployRobots = (transform = (input, start) => input) => {

    const getStarts = (inp) => {
        let starts = [];
        for (let y = 0; y < inp.length; y++) {
            for (let x = 0; x < inp[y].length; x++) {
                if (inp[y][x] === '@') {
                    starts.push({ x, y })
                }
            }
        }
        return starts;
    }

    const input = transform(inputFile, getStarts(inputFile)[0]);

    const getNeighbours = (point) => [
        { x: point.x + 1, y: point.y },
        { x: point.x - 1, y: point.y },
        { x: point.x, y: point.y + 1 },
        { x: point.x, y: point.y - 1 },
    ].filter(e => input[e.y][e.x] != '#');

    const keyCache = {}
    const getReachableKeys = (start, keys) => {
        const open = [start];
        const close = { [`${start.x}_${start.y}`]: 0 };
        const foundKeys = {};
        const cacheKey = `${start.x}_${start.y}/${keys.sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0)).join('')}`;

        if (keyCache[cacheKey]) return keyCache[cacheKey];

        while (open.length > 0) {
            const point = open.shift();

            for (let n of getNeighbours(point)) {
                if (close[`${n.x}_${n.y}`]){
                    continue;
                }

                close[`${n.x}_${n.y}`] = close[`${point.x}_${point.y}`] + 1;

                if (input[n.y][n.x] >= 'A' && input[n.y][n.x] <= 'Z' && !keys.includes(input[n.y][n.x].toLowerCase())) {
                    continue;
                }
                if (input[n.y][n.x] >= 'a' && input[n.y][n.x] <= 'z' && !keys.includes(input[n.y][n.x])) {
                    foundKeys[input[n.y][n.x]] = [close[`${n.x}_${n.y}`], n];
                }
                else {
                    open.push(n);
                }
            }
        }

        keyCache[cacheKey] = foundKeys;
        return foundKeys;
    }

    const getKeysForMultipleRobots = (positions, keys) => {
        const result = [];

        for (let pos of positions) {
            result.push(getReachableKeys(pos, keys));
        }

        return result;
    }

    const cache = {}
    const findPath = (positions, keys = []) => {
        const keyString = keys.sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0)).join('');
        const positionString = positions.map(e => `${e.x}_${e.y}`).join('|');
        const key = `${positionString}/${keyString}`;

        if (cache[key]) return cache[key];

        const reachableKeys = getKeysForMultipleRobots(positions, keys);
        if (reachableKeys.filter(e => Object.keys(e).length > 0).length == 0) {
            return 0;
        }

        const possiblePaths = [];
        for (let robotId = 0; robotId < reachableKeys.length; robotId++) {
            const keyNames = Object.keys(reachableKeys[robotId]);
            for (let i = 0; i < keyNames.length; i++) {
                const [distance, position] = reachableKeys[robotId][keyNames[i]];
                const nextPositions = [...positions];
                nextPositions[robotId] = position;
                possiblePaths.push(distance + findPath(nextPositions, [...keys, keyNames[i]]));
            }
        }

        const minDistance = possiblePaths.sort((a, b) => a - b)[0];
        cache[key] = minDistance;

        return minDistance;
    }

    return findPath(getStarts(input))
}

console.log(`Part1: ${deployRobots()}`);
console.log(`Part2: ${deployRobots((input, start) => {
    input[start.y][start.x] = '#';
    input[start.y - 1][start.x] = '#';
    input[start.y + 1][start.x] = '#';
    input[start.y][start.x + 1] = '#';
    input[start.y][start.x - 1] = '#';

    input[start.y - 1][start.x - 1] = '@';
    input[start.y + 1][start.x - 1] = '@';
    input[start.y - 1][start.x + 1] = '@';
    input[start.y + 1][start.x + 1] = '@';

    return input;
})}`);
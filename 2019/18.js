const fs = require('fs');
const { Graph, astar } = require('javascript-astar');

const input = fs.readFileSync('18.txt').toString().split('\n')
    .map(e => e.trim().split(''));

const makeArr = () => {
    let doorPositions = {};
    let lockPositions = {};
    let startPosition = {};
    let arr = [];
    for (let y = 0; y < input.length; y++) {
        if (!arr[y]) arr[y] = [];
        for (let x = 0; x < input[y].length; x++) {
            if (input[y][x] === '#') {
                arr[y][x] = 0;
            } else if (input[y][x].charCodeAt(0) >= 'A'.charCodeAt(0) &&
                input[y][x].charCodeAt(0) <= 'Z'.charCodeAt(0)) {
                arr[y][x] = 1;
                doorPositions[input[y][x]] = { x, y }
            } else {
                arr[y][x] = 1;
            }

            if (input[y][x].charCodeAt(0) >= 'a'.charCodeAt(0) &&
                input[y][x].charCodeAt(0) <= 'z'.charCodeAt(0)) {
                    lockPositions[input[y][x]] = { x, y }
            }

            if (input[y][x] === '@') {
                startPosition = { x, y };
            }

        }
    }

    return { arr, doorPositions, lockPositions, startPosition }
}

const vvv = makeArr();
const data = makeArr();

let pathCache = {};

const doPath = (perm) => {
    let arr = JSON.parse(JSON.stringify(data.arr));
    let pos = data.startPosition;
    let steps = 0;
    let tmp = '';
    
    let isFromCache = false;
    for (let key of perm) {
        tmp += key;
        if (pathCache[tmp]) {
            steps = pathCache[tmp].steps;
            arr = pathCache[tmp].arr
            pos = pathCache[tmp].pos;
            isFromCache = true;
            continue;
        }

        if (isFromCache) {
            // console.log(tmp);
            arr = JSON.parse(JSON.stringify(arr));
            isFromCache = false;
        }
        
        var graph = new Graph(arr);
        var start = graph.grid[pos.y][pos.x];
        var end = graph.grid[data.lockPositions[key].y][data.lockPositions[key].x];
        var result = astar.search(graph, start, end);

        if (!result.length)  {
            steps = 0;
            break;
        };

        pos = data.lockPositions[key];
        steps += result.length;
        if (data.doorPositions[key.toUpperCase()]) {
            arr[data.doorPositions[key.toUpperCase()].y][data.doorPositions[key.toUpperCase()].x] = 1;
        }

        pathCache[tmp] = { steps, arr: JSON.parse(JSON.stringify(arr)), pos: {...pos} };
    }

    return [steps, tmp];
}

const banList = {};
let totalSteps = [];
let lastBest = 9999999999999999999999;
// Taken from https://stackoverflow.com/a/20871714
const permutator = (inputArr) => {
    let result = [];

    const permute = (arr, m = [], len) => {
        if (arr.length === 0) {
            
            // console.log(m.join(''));
            // totalSteps.push(len);
            // console.log(len);
            if (len < lastBest) {
                lastBest = len;
                console.log(lastBest);
            }
            
        } else {

            let paths = [];
            for (let i = 0; i < arr.length; i++) {
                let curr = arr.slice();
                let next = curr.splice(i, 1);
                let vv = m.concat(next);

                let isOk = true;
                let p = vv.join('');
                for (let i = 0; i < p.length; i++) {
                    let xx = p.substr(0, i);
                    if (banList[xx]) {
                        isOk = false;
                        break;
                    }
                }

                let [len, pth] = doPath(vv);
                if (isOk && len > 0) {
                    paths.push({ vv, len, curr: curr })
                } else {
                    banList[vv.join()] = true;
                    banList[pth] = true;
                }
            }

            paths = paths.sort((a, b) => a.len - b.len);
            for (let p of paths) {
                permute(p.curr, p.vv, p.len)
            }
        }
    }

    permute(inputArr)

    return result;
}


const ditances = {};

console.log(data.doorPositions)
for (let l1 of Object.keys(data.lockPositions)) {
    for (let l2 of Object.keys(data.lockPositions)) {
        if (l1 != l2) {
            var graph = new Graph(data.arr);
            var start = graph.grid[data.lockPositions[l1].y][data.lockPositions[l1].x];
            var end = graph.grid[data.lockPositions[l2].y][data.lockPositions[l2].x];
            var result = astar.search(graph, start, end);

            if (result.length > 0) {
                ditances[`${l1}_${l2}`] = {
                    len: result.length,
                    path: result.map(e => `${e.x}_${e.y}`),
                    requires: Object.keys(data.doorPositions)
                        .filter(e => result
                            .filter(v => v.x == data.doorPositions[e].y && v.y == data.doorPositions[e].x).length > 0)
                        .map(e => e.toLowerCase())
                };
            }
        }
    }
}

for (let key of Object.keys(data.lockPositions)) {
    var graph = new Graph(data.arr);
    var start = graph.grid[data.startPosition.y][data.startPosition.x];
    var end = graph.grid[data.lockPositions[key].y][data.lockPositions[key].x];
    var result = astar.search(graph, start, end);

    if (result.length > 0) {
        ditances[`start_${key}`] = {
            len: result.length,
            requires: Object.keys(data.doorPositions)
                .filter(e => result.filter(v => v.y == data.doorPositions[e].x && v.x == data.doorPositions[e].y).length)
                .map(e => e.toLowerCase())
        };
    } else {
        console.log(key);
    }
}
let visited = 0;
const permutator2 = (inputArr) => {
    let result = [];

    const permute = (arr, m = [], len = 0) => {
        if (arr.length === 0) {
            visited++;
            if (visited % 1000000 == 0) {
                console.log(visited);
            }
            if (len < lastBest) {
                lastBest = len;
                console.log(m.join(''), lastBest);
            }
            
        } else {
            let paths = [];
            for (let i = 0; i < arr.length; i++) {
                let curr = arr.slice();
                let next = curr.splice(i, 1);
                let vv = m.concat(next);

                if (vv.length === 1) {
                    const pair = ditances[`start_${vv[0]}`]

                    if (pair.requires.length == 0) {
                        paths.push([curr, vv, len + pair.len])
                    }
                } else {
                    const pair = ditances[`${vv[vv.length-2]}_${vv[vv.length-1]}`]

                    const notMatchingRequires = pair.requires.filter(
                        e => !m.includes(e)
                    );

                    if (notMatchingRequires.length == 0) {
                        paths.push([curr, vv, len + pair.len])
                    }

                }
            }

            paths = paths.sort((a, b) => a[2] - b[2]);
            for (let path of paths) {
                permute(...path)

                if (len >= lastBest) return;
            }
        }
    }

    permute(inputArr)

    return result;
}
// console.log(Object.keys(data.lockPositions).length)
permutator2(Object.keys(data.lockPositions))
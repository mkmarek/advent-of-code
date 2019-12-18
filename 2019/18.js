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
        var result = astar.search(graph, start, end, { heuristic: (a, b) => 1  });

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
            var result = astar.search(graph, start, end, { heuristic: (a, b) => 1  });

            if (result.length > 0) {
                ditances[`${l1}_${l2}`] = {
                    len: result.length,
                    // path: result.map(e => `${e.x}_${e.y}`),
                    keys: Object.keys(data.lockPositions)
                        .filter(e => result
                            .filter(v => v.x == data.lockPositions[e].y && v.y == data.lockPositions[e].x).length > 0)
                        .map(e => e.toLowerCase())
                        .filter(e => e != l1)
                        .filter(e => e != l2),
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
    var result = astar.search(graph, start, end, { heuristic: (a, b) => 1  });

    if (result.length > 0) {
        ditances[`start_${key}`] = {
            len: result.length,
            keys: Object.keys(data.lockPositions)
                .filter(e => result
                    .filter(v => v.x == data.lockPositions[e].y && v.y == data.lockPositions[e].x).length > 0)
                .map(e => e.toLowerCase())
                .filter(e => e != key),
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

    const permute = (arr, m = [], len = 0, collected = []) => {

        if (arr.filter(e => collected.includes(e)).length > 0) return;

        if (arr.length === 0) {
            visited++;
            if (visited % 1000000 == 0) {
                console.log(visited);
            }
            if (len < lastBest) {
                lastBest = len;
                console.log(m.join(''), lastBest);
            }
            
        } else if (arr.filter(e => !collected.includes(e)).length === 0) {
            visited++;
            if (visited % 1000000 == 0) {
                console.log(visited);
            }
            if (len < lastBest) {
                lastBest = len;
                console.log(m.join(''), lastBest);
            }
            
        }
        
        else {
            let paths = [];
            for (let i = 0; i < arr.length; i++) {
                let curr = arr.slice();
                let next = curr.splice(i, 1);

                if (collected.includes(next)) continue;

                let vv = m.concat(next);

                if (vv.length === 1) {
                    const pair = ditances[`start_${vv[0]}`]

                    if (pair.requires.length == 0) {
                        paths.push([curr, vv, len + pair.len, [...pair.keys]])
                    }
                } else {
                    const pair = ditances[`${vv[vv.length-2]}_${vv[vv.length-1]}`]

                    const notMatchingRequires = pair.requires.filter(
                        e => !m.includes(e)
                    );

                    if (notMatchingRequires.length == 0) {
                        let newCollected = [...collected];
                        for (let k of pair.keys) {
                            if (!collected.includes(k)) newCollected.push(k);
                        }
                        paths.push([curr, vv, len + pair.len, newCollected])
                    }

                }
            }

            for (let path of paths.sort((a, b) => a[2] - b[2])) {
                permute(...path)

                if (len >= lastBest) return;
            }
        }
    }

    permute(inputArr)

    return result;
}

const calculateDistance = (path) => {
    let record = ditances[`start_${path[0]}`];

    if (record.requires.length > 0) return null;

    let distance = record.len;
    for (let i = 0; i < path.length - 1; i++) {
        record = ditances[`${path[i]}_${path[i + 1]}`];
        if (record.requires.filter(e => path.indexOf(e) > i).length > 0) {
            return null;
        }

        distance += record.len;
    }

    return distance;
}

// const buildTree = (path = [], current = 'start') => {
//     console.log(path.join(''));
//     return Object.keys(ditances)
//         .filter(e => e.startsWith(`${current}_`))
//         .filter(e => ditances[e].requires.filter(e => path.includes(e).length === 0))
//         .filter(e => !path.includes(e.split('_')[]))
//         .map(e => ({
//             key : e.split('_')[1],
//             distance: ditances[e].len,
//             children: buildTree([...path, current], e.split('_')[1])
//         }))
// }

// console.log(buildTree());

// console.log(Object.keys(data.lockPositions).length)
console.log(ditances);
permutator2(Object.keys(data.lockPositions))
const Graph = require('node-dijkstra')

let target = { x: 14, y: 709 }
let depth = 6084;

// let target = { x: 10, y: 10 }
// let depth = 510;

let cache = {};
const getGeoogicIndex = (x, y) => {
    if (cache[`${x}_${y}`]) {
        return cache[`${x}_${y}`];
    }

    if (x == target.x && y == target.y) {
        return 0;
    }

    if (x == 0 && y == 0) {
        return 0;
    }

    if (x == 0) {
        return y * 48271;
    }

    if (y == 0) {
        return x * 16807;
    }

    let value = getErosionLevel(x - 1, y) * getErosionLevel(x, y - 1);

    cache[`${x}_${y}`] = value;

    return value;
}

const getType = (x, y) => {
    const erosionLevel = getErosionLevel(x, y);

    if (erosionLevel % 3 == 0) {
        return 'rocky'
    }

    if (erosionLevel % 3 == 1) {
        return 'wet'
    }

    if (erosionLevel % 3 == 2) {
        return 'narrow'
    }
}

const getErosionLevel = (x, y) => {
    const index = (getGeoogicIndex(x, y) + depth) % 20183;

    return index;
}

let danger = 0;
let map = []
for (let x = 0; x <= target.x; x++) {
    if (!map[x]) {
        map[x] = [];
    }
    for (let y = 0; y <= target.y; y++) {
        let type = getType(x, y);

        if (type == 'rocky') {
            map[x][y] = 'rocky';
        } else if (type == 'wet') {
            danger++;
            map[x][y] = 'wet';
        } else if (type == 'narrow') {
            danger += 2;
            map[x][y] = 'narrow';
        }
    }
}

console.log(`Answer1 is: ${danger}`);

const getToolsForRegion = (regionType) => {
    if (regionType == 'rocky') {
        return ['climbing_gear', 'torch']
    }

    if (regionType == 'wet') {
        return ['climbing_gear', 'neither']
    }

    if (regionType == 'narrow') {
        return ['neither', 'torch']
    }
}

const cost = (start, end, endTool) => {
    return start.tool == endTool
        ? 1
        : 8;
}

let nodes = {};
for (let x = 0; x < target.x + 20; x++) {
    for (let y = 0; y < target.y + 20; y++) {
        let allowedTools = getToolsForRegion(getType(x, y));
        
        for (let t1 of allowedTools) {
            for (let t2 of allowedTools) {
                if (t1 == t2) continue;
                if (!nodes[`${x}_${y}_${t1}`]) {
                    nodes[`${x}_${y}_${t1}`] = {  };
                }

                nodes[`${x}_${y}_${t1}`][`${x}_${y}_${t2}`] = 7;
            }
        }

        let neighbours = [
            { y: y, x : x - 1 },
            { y: y, x : x + 1 },
            { y: y - 1, x : x },
            { y: y + 1, x : x }
        ].filter(e => e.x >= 0 && e.y >= 0 && e.x < target.x + 20 && e.y < target.y + 20)

        for (let ne of neighbours) {
            let allowedAtNeighbour = getToolsForRegion(getType(ne.x, ne.y));
            let common = allowedAtNeighbour.filter(e => allowedTools.includes(e));

            for (let tool of common) {
                nodes[`${x}_${y}_${tool}`][`${ne.x}_${ne.y}_${tool}`] = 1;
            }
        }
    }   
}

const route = new Graph()
for (let k of Object.keys(nodes)) {
    route.addNode(k, nodes[k]);
}

const path = route.path('0_0_torch', `${target.x}_${target.y}_torch`, { cost: true })

console.log(`Answer2 is: ${path.cost}`);
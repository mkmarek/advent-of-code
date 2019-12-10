const fs = require('fs');

const input = fs.readFileSync('10.txt').toString().split('\n')
    .map(e => e.trim().split(''));

var result = [];

const isBetween = (ar, br, cr) => {
    const a = { x: ar[0], y: ar[1] };
    const b = { x: br[0], y: br[1] };
    const c = { x: cr[0], y: cr[1] };

    let crossproduct = (c.y - a.y) * (b.x - a.x) - (c.x - a.x) * (b.y - a.y)

    if (Math.abs(crossproduct) > 0)
        return false

    let dotproduct = (c.x - a.x) * (b.x - a.x) + (c.y - a.y)*(b.y - a.y)
    if (dotproduct < 0)
        return false

    let squaredlengthba = (b.x - a.x)*(b.x - a.x) + (b.y - a.y)*(b.y - a.y)
    if (dotproduct > squaredlengthba)
        return false

    return true
}

const lineOfSigh = (start, end) => {

    if (start[0]== end[0] && start[1] === end[1]) return false;
    
    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
            if (x == start[0] &&  y == start[1]) continue;
            if (x == end[0] &&  y == end[1]) continue;
            if ( input[y][x] === '#') {
                if (isBetween(start, end, [x, y])) {
                    return false;
                }
            }
        }
        
    }

    return true;
}

const rayCast = (start) => {
    let cnt = 0;
    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
            if (input[y][x] === '#') {
                if (lineOfSigh(start, [x, y])) {
                    cnt++;
                }
            }
        }
        
    }

    return cnt;
}

const rayCastEl = (start) => {
    let cnt = [];
    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
            if (input[y][x] === '#') {
                if (lineOfSigh(start, [x, y])) {
                    cnt.push([x, y]);
                }
            }
        }
        
    }

    return cnt;
}

for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
        if (!result[y]) result[y] = [];

        if (input[y][x] === '#') {
            result[y][x] = rayCast([x, y]);
        } else {
            result[y][x] = null;
        }
    }
    
}


let bestCoords = [0, 0];
for (let y = 0; y < result.length; y++) {
    for (let x = 0; x < result[y].length; x++) {
        if (result[bestCoords[1]][bestCoords[0]] < result[y][x]) {
            bestCoords = [x, y];
        }
    }
}

let vaporized = [];
while (vaporized.length <= 200) {
    let asteroids = rayCastEl(bestCoords);

    for (let as of asteroids) {
        input[as[1]][as[0]] = '.';
    }

    let dsf = asteroids.map(e => ({ x: e[0], y: e[1], dir: ((Math.atan2(bestCoords[1] - e[1], bestCoords[0] - e[0]) - Math.PI / 2) + Math.PI * 2) % (Math.PI * 2) }))
        .sort((a, b) => a.dir - b.dir)
    vaporized = [...vaporized, ...dsf]

    console.log(vaporized.length);
}

console.log(vaporized[199])
console.log(bestCoords, result[bestCoords[1]][bestCoords[0]])
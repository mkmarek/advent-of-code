const fs = require('fs');

let input =  fs.readFileSync('9.txt').toString().split('\n').map(e => e.split(' '));

const locations = Object.keys(input.map(e => e[0])
    .reduce((prev, c) => ({ ...prev, [c]: true }), {}));


const shortestRoute = (path) => {
    console.log(path);
    for (let route of input) {
        if ((!path.length || path[path.length - 1] == route[0]) && !path.includes(route[2])) {
            let r = shortestRoute([ ...path, ...(!path.length ? [route[0]] : []), route[2] ]);
            distances.push([r[0], r[1] + Number(route[4])]);
        }
    }

    distances = distances.filter(e => e[0].length === locations.length);
    let best = distances.sort((a, b) => a[1] - b[1])[0];

    return best || [path, 0];
}

console.log(shortestRoute([]));
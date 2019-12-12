const fs = require('fs');

const input = fs.readFileSync('12.txt').toString().split('\n').map(e => e.trim().substr(0, e.trim().length - 1))
    .map(e => e.trim().split(', ').map(e => Number(e.split('=')[1])));

let velocities = input.map(e => [0, 0, 0]);


const setVel = (i, y, idx, input) => {
    velocities[i][idx] += input[i][idx] === input[y][idx]
        ? 0
        : (input[i][idx] < input[y][idx] ? 1 : -1)
}

let historyx = {};
let historyy = {};
let historyz = {};

const matches = (a, b) => !(a[0] !== b[0] || a[1] !== b[1] || a[2] !== b[2])

let hasM0, hasM1, hasM2

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

for (let h = 0; ; h++) {
    let tmp = [...input.map(e => [...e])];
    for (let i = 0; i < input.length; i++) {
        for (let y = 0; y < input.length; y++) {
            setVel(i, y, 0, tmp);
            setVel(i, y, 1, tmp);
            setVel(i, y, 2, tmp);
        }
        input[i][0] += velocities[i][0]
        input[i][1] += velocities[i][1]
        input[i][2] += velocities[i][2]
    }

    const keyx = `${input.map(e => e[0]).join(',')}_${velocities.map(e => e[0]).join(',')}`;
    const keyy = `${input.map(e => e[1]).join(',')}_${velocities.map(e => e[1]).join(',')}`;
    const keyz = `${input.map(e => e[2]).join(',')}_${velocities.map(e => e[2]).join(',')}`

    if (historyx[keyx] && !hasM0) {
        hasM0 = h;
        console.log('matchx ' + h);
    }
    if (historyy[keyy] && !hasM1) {
        console.log('matchy ' + h);
        hasM1 = h;
    }
    if (historyz[keyz] && !hasM2) {
        console.log('matchz ' + h);
        hasM2 = h;
    }

    if (hasM0 && hasM1 && hasM2) {
        console.log(hasM0, hasM1, hasM2)
        console.log(leastCommonMultiple(leastCommonMultiple(hasM0, hasM1), hasM2))
        return
    }

    historyx[keyx] = true;
    historyy[keyy] = true;
    historyz[keyz] = true;
}
let fs = require('fs');

let input = fs.readFileSync('./inputs/23.txt').toString().trim().split('\n').map(e => e.trim()).filter(e => e)
    .map(e => ({
        posX: Number(e.split(', ')[0].split(',')[0].substr('pos=<'.length)),
        posY: Number(e.split(', ')[0].split(',')[1]),
        posZ: Number(e.split(', ')[0].split(',')[2].substr(0, e.split(', ')[0].split(',')[2].length - 1)),
        radius: Number(e.split(', ')[1].substr('r='.length))
    }))

let bestBot = input.sort((a, b) => b.radius - a.radius)[0];

let cnt = 0;
for (let bot of input) {
    if (Math.abs(bot.posX - bestBot.posX) + Math.abs(bot.posY - bestBot.posY) + Math.abs(bot.posZ - bestBot.posZ) <= bestBot.radius) {
        cnt++;
    }
}

const findCenters = (res, mult) => {
    let centers = [];

    for (let x = (res.x - 1) * mult; x <= ((res.x) + 1) * mult; x++) {
        for (let y = (res.y - 1) * mult; y <= ((res.y) + 1) * mult; y++) {
            for (let z = (res.z - 1) * mult; z <= ((res.z) + 1) * mult; z++) {
                centers.push({ x, y, z })
            }
        }
    }

    return centers
}

let best = { x: 0, y : 0, z : 0 }
let multiplier = 2;
let divisor = 268435456

do {
    let points = null;

    points = findCenters(best, multiplier);
    for (let point of points) {
        let cnt1 = 0;
        for (let bot of input) {
            if (Math.abs(bot.posX / divisor - point.x) +
                Math.abs(bot.posY / divisor - point.y) +
                Math.abs(bot.posZ / divisor - point.z) <= bot.radius / divisor) {
                cnt1++;
            }
        }

        point.near = cnt1;
    }

    best = points[0];
    for (let p of points) {
        if (best.near < p.near) {
            best = p;
        } else if(best.near == p.near &&
            (Math.abs(p.x) + Math.abs(p.y) + Math.abs(p.z) < (Math.abs(best.x) + Math.abs(best.y) + Math.abs(best.z)))) {
            best = p;
        }
    }

    divisor = divisor / multiplier;
} while (divisor >= 1)

let distanceFromZero = Math.abs(best.x) + Math.abs(best.y) + Math.abs(best.z)

console.log(`Answer1: ${cnt}`);
console.log(`Answer2: ${distanceFromZero}`);
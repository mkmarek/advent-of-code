let fs = require('fs');

let input = fs.readFileSync('./inputs/10.txt').toString().trim().split('\n').map(e => e.trim()).filter(e => e);

let points = input.map(e => ({
    posX: Number(e.substr('position=<'.length).split(',')[0]),
    posY: Number(e.substr('position=<'.length).split(',')[1].split('>')[0]),
    velX: Number(e.split('velocity=')[1].substr('<'.length).split(',')[0]),
    velY: Number(e.split('velocity=')[1].substr('<'.length).split(',')[1].replace('>',''))
}))

let print = (points) => {
    let minX = points[0].posX;
    let minY = points[0].posY;
    let maxX = points[0].posX;
    let maxY = points[0].posY;

    for (point of points) {
        if (minX > point.posX) minX = point.posX;
        if (minY > point.posY) minY = point.posY;
        if (maxX < point.posX) maxX = point.posX;
        if (maxY < point.posY) maxY = point.posY;
    }


    let str = '';
    for (let y = minY; y < maxY; y++) {
        for (let x = minX; x < maxX; x++) {
            str += points.filter(e => e.posX == x && e.posY == y).length
                ? '*'
                : ' ';
        }
        str += '\n';
    }

    console.log(str);
}

let updatePositions = (points) => {
    for (point of points) {
        point.posX += point.velX;
        point.posY += point.velY;
    }
}


let minX = points[0].posX;
let minY = points[0].posY;
let maxX = points[0].posX;
let maxY = points[0].posY;

for (point of points) {
    if (minX > point.posX) minX = point.posX;
    if (minY > point.posY) minY = point.posY;
    if (maxX < point.posX) maxX = point.posX;
    if (maxY < point.posY) maxY = point.posY;
}

let prevSize = Math.pow(maxX - minX, 2) + Math.pow(maxY - minY, 2);
let seconds = 0;

let prevPoints = JSON.parse(JSON.stringify(points));
while(true) {
    updatePositions(points);

    minX = points[0].posX;
    minY = points[0].posY;
    maxX = points[0].posX;
    maxY = points[0].posY;

    for (point of points) {
        if (minX > point.posX) minX = point.posX;
        if (minY > point.posY) minY = point.posY;
        if (maxX < point.posX) maxX = point.posX;
        if (maxY < point.posY) maxY = point.posY;
    }

    let size = Math.pow(maxX - minX, 2) + Math.pow(maxY - minY, 2);

    if (size > prevSize) {
        print(prevPoints);
        break;
    }

    prevSize = size;
    prevPoints = JSON.parse(JSON.stringify(points));
    seconds++;
}

console.log(`This took ${seconds} seconds`)
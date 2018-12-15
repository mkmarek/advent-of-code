let fs = require('fs');

let input = 1718;

const getPowerLevel = (x, y) => {
    const rackId = x + 10;

    let powerLevel = rackId * y;

    const afterSerial = powerLevel + input;
    powerLevel = rackId * afterSerial;

    let str = powerLevel.toString();
    let hundreth = str.length >= 3
        ? Number(powerLevel.toString()[str.length - 3])
        : 0;

    return hundreth - 5;
}

let grid = [];

for (let x = 0; x <= 300; x++) {
    if (!grid[x]) {
        grid[x] = [];
    }
    for (let y = 0; y <= 300; y++) {
        grid[x][y] =  getPowerLevel(x, y)
    }
}

const getLargestLocalPower = (size) => {
    let gX = 0;
    let gY = 0;
    let lastMax = 0;

    for (let x = 0; x <= 300 - size; x++) {
        for (let y = 0; y <= 300 - size; y++) {
            let greaters = 0;
            
            for (let sx = 0; sx < size; sx++) {
                for (let sy = 0; sy < size; sy++) {
                    greaters += grid[x + sx][y+ sy];
                }
            }

            if (greaters > lastMax) {
                gX = x;
                gY = y;
                lastMax = greaters;
            }
        }
    }

    return [gX, gY, lastMax];
}

const getLargestLocalPowerAnySize = () => {
    let gX = 0;
    let gY = 0;
    let lastMax = 0;
    let maxSize = 0;

    for (let size = 1; size <= 300; size++) {
        const [tmpX, tmpY, tmpMax] = getLargestLocalPower(size);

        if (tmpMax > lastMax) {
            gX = tmpX;
            gY = tmpY;
            lastMax = tmpMax;
            maxSize = size;

            console.log(`Maybe answer2: ${gX},${gY},${maxSize}`);
        }
    }

    return [gX, gY, maxSize];
}

const [x, y] = getLargestLocalPower(3);

console.log(`Answer1: ${x},${y}`);

const [x2, y2, maxSize] = getLargestLocalPowerAnySize();

console.log(`Answer2: ${x2},${y2},${maxSize}`);
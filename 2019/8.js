const fs = require('fs');

const input = fs.readFileSync('8.txt').toString().split('')
    .map(e => Number(e.trim()));

function getLayers(w, h) {
    let layers = [];
    let curr = 0;

    while (curr < input.length) {
        let image = [];
        for (let y = 0; y < h; y++) {
            let k = [];
            for (let x = 0; x < w; x++) {
                k.push(input[curr++])
            }
            image.push(k);
        }
        layers.push(image);
    }

    return layers;
}

function numberOfDigits(layer, digit) {
    let cnt = 0;

    for (let y = 0; y < layer.length; y++) {
        for (let x = 0; x < layer[y].length; x++) {
            if (layer[y][x] === digit) {
                cnt++;
            }
        }
    }

    return cnt;
}

function getResultForPart1(layers) {
    let layerWithFewestZeroDigits = layers[0];
    let digits = numberOfDigits(layerWithFewestZeroDigits, 0)

    for (let j = 1; j < layers.length; j++) {
        const temp = numberOfDigits(layers[j], 0)
        
        if (temp < digits) {
            layerWithFewestZeroDigits = layers[j];
            digits = temp;
        }
    }

    return numberOfDigits(layerWithFewestZeroDigits, 1) * numberOfDigits(layerWithFewestZeroDigits, 2)
}

function getMessageForPart2(layers) {
    let image = [];

    for (let j = 0; j < layers.length; j++) {
        for (let y = 0; y < layers[j].length; y++) {
            if (!image[y]) image[y] = [];
            for (let x = 0; x < layers[j][y].length; x++) {
                if (image[y][x] == 2 || (!image[y][x] && image[y][x] !== 0))
                    image[y][x] = layers[j][y][x] ;
            }
        }
    }

    return image.map(e => e.join('').replace(/0/g, ' ')).join('\n');
}

const layers = getLayers(25, 6);

console.log(`Part1: ${getResultForPart1(layers)}`);
console.log('Part2:')
console.log(getMessageForPart2(layers));


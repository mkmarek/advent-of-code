const fs = require('fs');

let input = fs.readFileSync('16.txt').toString().trim().split('')
    .map(e => Number(e.trim()));

const basePatter = [0, 1, 0, -1]

let phase = 100;

let arr = new Array(input.length * 10000)
for (let g = 0; g < input.length * 10000;g++) {
    arr[g] = input[g % input.length];
}

arr = input;

for (let i = 0; i < phase; i++) {
    let tmp = [];
    console.log(`Phase ${i}`)
    for (let d = 0; d < arr.length; d++) {
        let digit = 0;

        if (d % 10000 === 0) console.log(`${d}/${arr.length}`);

        for (let bb = d; bb < arr.length; bb += (d + 1) * 4) {
            for (let cc = bb + d + 1; cc <= bb + d * 2; cc += 1) {
                digit += arr[cc];
            }
            for (let cc = bb + d * 3 + 1; cc <= bb + d * 4; cc += 1) {
                digit -= arr[cc];
            }
        }
        tmp.push(Math.abs(digit % 10));
    }
    arr = tmp;
    console.log(arr.join(''));
    return;
}

let fs = require('fs');

let input = fs.readFileSync('./inputs/17.txt').toString().split('\n').map(e => e.trim())
    .map(e => e[0] == 'x'
        ? ({
            type: 0,
            x: Number(e.split(', ')[0].split('=')[1]),
            fromY: Number(e.split(', ')[1].split('=')[1].split('..')[0]),
            toY: Number(e.split(', ')[1].split('=')[1].split('..')[1])
        })
        : ({
            type: 1,
            y: Number(e.split(', ')[0].split('=')[1]),
            fromX: Number(e.split(', ')[1].split('=')[1].split('..')[0]),
            toX: Number(e.split(', ')[1].split('=')[1].split('..')[1])
        }))

let waterSource = {x: 500, y: 0};

let map = [];

const getBounds = () => {
    let minX = null;
    let minY = null;
    let maxX = null;
    let maxY = null;

    for (let el of input) {
        if (el.type == 0) {
            if (!minX || minX > el.x) minX = el.x;
            if (!minY || minY > el.fromY) minY =  el.fromY;
            
            if (!maxX || maxX < el.x) maxX = el.x;
            if (!maxY || maxY < el.toY) maxY =  el.toY;
        } else {
            if (!minY || minY > el.y) minY = el.x;
            if (!minX || minX > el.fromX) minX =  el.fromX;

            if (!maxY || maxY < el.y) maxY = el.y;
            if (!maxX || maxX < el.toX) maxX =  el.toX;
        }
    }

    return [minX-1, minY, maxX, maxY];
}

const getCnt = () => {
    const [minX, minY, maxX, maxY] = getBounds();
    let cnt1 = 0;
    let cnt2 = 0;
    for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
            if (map[x] && (map[x][y] == 'w')) cnt1++;
            if (map[x] && (map[x][y] == '|')) cnt2++;
        }
    }

    return [cnt1, cnt2];
}

const print = () => {
    const [minX, minY, maxX, maxY] = getBounds();
    let str = '';
    let cnt = 0;
    for (let y = 0; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
            if (map[x] && map[x][y] == 'w') cnt++;
            if (map[x] && map[x][y]) str += map[x][y]
            else if (waterSource.x == x && waterSource.y == y) str +='X'
            else if (water.filter(e => e.y == y && e.x == x).length > 0) str +='|'
            else str +='.';
        }
        str+='\n';
    }

    console.log(str);
    fs.writeFileSync('test.txt', str);
}

for (let el of input) {
    if (el.type == 0) {
        for (let y = el.fromY; y <= el.toY; y++) {
            if (!map[el.x]) {
                map[el.x] = [];
            }

            map[el.x][y] = 'c';
        }
    } else {
        for (let x = el.fromX; x <= el.toX; x++) {
            if (!map[x]) {
                map[x] = [];
            }

            map[x][el.y] = 'c';
        }
    }
}

const isBlocked = (x, y) => {
    let inMap = map[x] && (map[x][y] == 'c' || map[x][y] == 'w')

    return inMap;
}

let water = [];
let i = 0;
print();
let prevCnt = 0;

const occupiesRow = (x, y) => {
    let start = 0;
    while (true) {
        if (!isBlocked(x+start, y + 1)) {
            return false;
        }

        if (isBlocked(x+start, y)) {
            return true;
        }
        start++;
    }
}

let lastCnt1 = 0;
let lastCnt2 = 0;
let yyy = 0;
while (true) {
    const [minX, minY, maxX, maxY] = getBounds();
    map[waterSource.x][waterSource.y + 1] = '|';

    for (let x = minX; x <= maxX; x++) {
        for (let y = 0; y <= maxY; y++) {
            if (!map[x]) map[x] = [];
            if (!map[x+1]) map[x+1] = [];
            if (!map[x-1]) map[x-1] = [];

            if (map[x] && map[x][y] == '|') {
                if (y == maxY) {
                    let [cnt1, cnt2] = getCnt();
                    if (cnt1 == lastCnt1 && cnt2 == lastCnt2) {
                        print();
                        console.log(getBounds())
                        console.log(getCnt());
                        return;
                    }
                    console.log(cnt1 + cnt2);
                    lastCnt1 = cnt1;
                    lastCnt2 = cnt2;
                }

                if (!isBlocked(x, y+1)) {
                    map[x][y+1] = '|';
                }
                else {
                    if (!isBlocked(x-1, y)) {
                        map[x-1][y] = '|';
                    } 
                    
                    if (!isBlocked(x+1, y)) {
                        map[x+1][y] = '|';
                    }
                }

                if (isBlocked(x-1, y) && isBlocked(x, y + 1) && occupiesRow(x, y)) {                 
                    map[x][y] = 'w';
                }
            }
        }
    }
}
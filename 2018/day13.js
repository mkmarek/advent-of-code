let fs = require('fs');

let input = fs.readFileSync('./inputs/13.txt').toString().split('\n');

let map = [];
let carts = [];

let y = 0;
for (let line of input) {
    map[y] = [];
    for (let x = 0; x < line.length; x++) {
        switch (line[x]) {
            case '>': carts.push({ x, y, dir: 'right', cross: 'left' }); map[y][x] = { type: 'line', dir: 'hor' }; break;
            case 'v': carts.push({ x, y, dir: 'down', cross: 'left' }); map[y][x] = { type: 'line', dir: 'ver' }; break;
            case '<': carts.push({ x, y, dir: 'left', cross: 'left' }); map[y][x] = { type: 'line', dir: 'hor' }; break;
            case '^': carts.push({ x, y, dir: 'up', cross: 'left' }); map[y][x] = { type: 'line', dir: 'ver' }; break;
            case '-': map[y][x] = { type: 'line', dir: 'hor' }; break;
            case '|': map[y][x] = { type: 'line', dir: 'ver' }; break;
            case '/': map[y][x] = { type: 'turn', dir: 'right' }; break;
            case '\\': map[y][x] = { type: 'turn', dir: 'left' }; break;
            case '+': map[y][x] = { type: 'cross' }; break;
            case ' ': break;
        }
    }
    y++;
}

const print = () => {
    for (let y = 0; y < map.length; y++) {
        let res = '';
        if (map[y]) {
            for (let x = 0; x < map[y].length; x++) {
                let cart = carts.find(e => e.x == x && e.y == y);
                if (cart) {
                    switch (cart.dir) {
                        case 'left': res += '<'; break;
                        case 'right': res += '>'; break;
                        case 'up': res += '^'; break;
                        case 'down': res += 'v'; break;
                    }
                } else if (!map[y][x]) {
                    res += ' ';
                } else if (map[y][x].type === 'line' && map[y][x].dir == 'hor') {
                    res += '-'
                } else if (map[y][x].type === 'line' && map[y][x].dir == 'ver') {
                    res += '|'
                } else if (map[y][x].type === 'turn' && map[y][x].dir == 'right') {
                    res += '/'
                } else if (map[y][x].type === 'turn' && map[y][x].dir == 'left') {
                    res += '\\'
                } else if (map[y][x].type === 'cross') {
                    res += '+'
                } else {
                    res += ' ';
                }
            }
        }
        console.log(res);
    }
}

const turnCross = (cart, dir) => {
    if (dir == 'left') {
        switch (cart.dir) {
            case 'left': cart.dir = 'down'; break;
            case 'right': cart.dir = 'up'; break;
            case 'up': cart.dir = 'left'; break;
            case 'down': cart.dir = 'right'; break;
        }
    } else if (dir == 'right') {
        switch (cart.dir) {
            case 'left': cart.dir = 'up'; break;
            case 'right': cart.dir = 'down'; break;
            case 'up': cart.dir = 'right'; break;
            case 'down': cart.dir = 'left'; break;
        }
    }
}

const turn = (cart, dir) => {
    if (dir == 'right') { // /
        switch (cart.dir) {
            case 'left': cart.dir = 'down'; break;
            case 'right': cart.dir = 'up'; break;
            case 'up': cart.dir = 'right'; break;
            case 'down': cart.dir = 'left'; break;
        }
    } else if (dir == 'left') { // \\
        switch (cart.dir) {
            case 'left': cart.dir = 'up'; break;
            case 'right': cart.dir = 'down'; break;
            case 'up': cart.dir = 'left'; break;
            case 'down': cart.dir = 'right'; break;
        }
    }
}

let boom =false;
carts = carts.sort((a, b) => (b.x * input[0].length + b.y) - (a.x * input[0].length + a.y));
while (true) {
    for (let cart of carts) {
        if (map[cart.y][cart.x].type === 'turn') {
            turn(cart, map[cart.y][cart.x].dir);
        } else if (map[cart.y][cart.x].type === 'cross') {
            turnCross(cart, cart.cross);

            if (cart.cross == 'left') {
                cart.cross = 'straight';
            } else if (cart.cross == 'straight') {
                cart.cross = 'right';
            } else if (cart.cross == 'right') {
                cart.cross = 'left';
            }
        }

        let x = cart.x;
        let y = cart.y;

        switch (cart.dir) {
            case 'left': x--; break;
            case 'right': x++; break;
            case 'up': y--; break;
            case 'down': y++; break;
        }
        cart.x = x;
        cart.y = y;

        let crashed = [];
        for (let cart of carts) {
            if (carts.filter(e => e.x == cart.x && e.y == cart.y).length > 1) {
                if (!boom) {
                    boom = true;
                    console.log(`First boom is: ${cart.x},${cart.y}`);
                }
                crashed.push(cart);
            }
        }

        carts = carts.filter(e => !crashed.includes(e))
            .sort((a, b) => -(b.x * input[0].length + b.y) + (a.x * input[0].length + a.y));;
    }

    if (carts.length == 1) {
        break;
    }

}

console.log(`Last surviving cart it: ${carts[0].x},${carts[0].y}`);
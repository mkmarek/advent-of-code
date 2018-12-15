let fs = require('fs');

const calc = (filename, elvenPower = 3, breakOnElfDeath = false) => {
    let input = fs.readFileSync(filename).toString().split('\n').filter(e => e).map(e => e.trim());

    let map = input.map(e => e.split(''));

    const astar = (unit,start, destination) => {
        let open = [{ node: start, g: 0, f: 0, x: start.x, y: start.y, parent : null }];
        let close = [];
        let visited = [];

        while (open.length) {
            let currentNode = open.pop();

            close.push(currentNode);

            if (currentNode.x == destination.x && currentNode.y == destination.y) {
                const result = [];
                while (currentNode) {
                    result.push({ x: currentNode.x, y : currentNode.y })
                    currentNode = currentNode.parent;
                }

                return result.reverse();
            }

            let neighbours = [
                { y: currentNode.y, x : currentNode.x - 1 },
                { y: currentNode.y, x : currentNode.x + 1 },
                { y: currentNode.y - 1, x : currentNode.x },
                { y: currentNode.y + 1, x : currentNode.x }
            ].filter(e => map[e.y] && map[e.y][e.x])
            .map(e => ({ node: map[e.y][e.x], g: currentNode.g + 1, x: e.x, y: e.y, parent: currentNode,
                // this is some performance killer :(
                f : currentNode.f + 1 }))

            for (let n of neighbours) {
                if (n.x == destination.x && n.y == destination.y) {
                    const result = [];
                    while (n) {
                        result.push({ x: n.x, y : n.y })
                        n = n.parent;
                    }
    
                    return result.reverse();
                }

                if (n.node == '#' || units.filter(e => e != unit && e.x == n.x && e.y == n.y).length > 0) continue;

                if (visited.filter(e => e.x == n.x && e.y == n.y).length == 0) {
                    open.push(n);
                    visited.push(n);
                }
            }

            open = open.sort((a, b) => b.f - a.f);
        }

        return null;
    }

    const elfs = [];
    const enemies = [];

    let idx = 0;
    for (let y = 0; y < map.length;y ++) {
        for (let x = 0; x < map[y].length;x ++) {
            if (map[y][x] == 'E') {
                elfs.push(({idx, x, y, team: 0, hp: 200, power: elvenPower}))
                map[y][x] = '.';
                idx++;
            } else if (map[y][x] == 'G') {
                enemies.push(({idx, x, y, team: 1, hp: 200, power: 3}))
                map[y][x] = '.';
                idx++;
            }
            
        }
    }

    const posSort = (a, b) => a.y == b.y ? a.x - b.x : a.y - b.y

    let units = [...elfs, ...enemies];

    const print = (path = []) => {
        let str = '';
        for (let y = 0; y < map.length;y ++) {
            for (let x = 0; x < map[y].length;x ++) {
                let unit = units.find(e => e.x == x && e.y == y);

                if (path.find(e => e.x == x && e.y == y)) {
                    str += '*';
                }
                else if (x == 9 && y == 23) {
                    str += 'Y';
                }
                else if (unit && unit.idx == 9) {
                    str += 'X';
                }
                else if (unit) {
                    str += unit.team == 0 ? 'E' : 'G';
                } else {
                    str += map[y][x];
                }
            }

            str += '\n';
        }

        console.log(str);
    }

    const onyOneTeam = () => {
        let team = units[0].team;

        for (let unit of units) {
            if (unit.team != team) {
                return false;
            }
        }

        return true;
    }


        let r = 0;
        while (true) {
            units = units.sort((a, b) => posSort(a, b));

            for (let ud = 0; ud < units.length; ud++) {
                if (onyOneTeam()) {
                    const sum = units.reduce((prev, next) => prev + next.hp, 0);
                    console.log(`And the magic number is: ${r * sum}`);
                    return true;
                }
                const unit = units[ud];

                let potentialTargets = [
                    { y: unit.y, x : unit.x - 1 },
                    { y: unit.y, x : unit.x + 1 },
                    { y: unit.y - 1, x : unit.x },
                    { y: unit.y + 1, x : unit.x }
                ]
                .map(e => units.filter(u => unit.team != u.team && u.x == e.x && u.y == e.y)[0])
                .filter(e => e)
                .sort((a, b) => ((a.hp - b.hp) * 100000) + posSort(a, b) );

                if (!potentialTargets.length) {
                    let enemies = units.filter(e => e.team != unit.team);
                    const movementPositions = [
                        { y: unit.y, x : unit.x - 1 },
                        { y: unit.y, x : unit.x + 1 },
                        { y: unit.y - 1, x : unit.x },
                        { y: unit.y + 1, x : unit.x }
                    ]
                    .filter(e => map[e.y] && map[e.y][e.x] && map[e.y][e.x] !== '#')
                    .filter(e => units.filter(f => f.x == e.x && f.y == e.y) == 0);

                    const targetPositions = enemies.map(e => ([
                        { y: e.y, x : e.x - 1 },
                        { y: e.y, x : e.x + 1 },
                        { y: e.y - 1, x : e.x },
                        { y: e.y + 1, x : e.x }
                    ]))
                    .reduce((prev, next) => [...prev, ...next], [])
                    .filter(e => map[e.y] && map[e.y][e.x] && map[e.y][e.x] !== '#')
                    .filter(e => units.filter(f => f.x == e.x && f.y == e.y) == 0);

                    let enemyPosition = [];
                    for (let b = 0; b < targetPositions.length; b++) {
                        enemyPosition.push(astar(unit, unit, targetPositions[b]));
                    }

                    enemyPosition = enemyPosition
                        .filter(e => e)
                        .sort((a, b) => (a.length - b.length) * 100000 + posSort(a[a.length -1], b[b.length-1]))[0];

                    if (enemyPosition) {

                        let startPosition = [];
                        for (let b = 0; b < movementPositions.length; b++) {
                            startPosition.push(astar(unit, movementPositions[b], enemyPosition[enemyPosition.length - 1]));
                        }

                        startPosition = startPosition
                            .filter(e => e)
                            .sort((a, b) => (a.length - b.length) * 100000 + posSort(a[0], b[0]))[0];
        
                        if (startPosition) {
                            unit.x = startPosition[0].x;
                            unit.y = startPosition[0].y;
                        }
                    }

                    potentialTargets = [
                        { y: unit.y, x : unit.x - 1 },
                        { y: unit.y, x : unit.x + 1 },
                        { y: unit.y - 1, x : unit.x },
                        { y: unit.y + 1, x : unit.x }
                    ]
                    .map(e => units.filter(u => unit.team != u.team && u.x == e.x && u.y == e.y)[0])
                    .filter(e => e)
                    .sort((a, b) => ((a.hp - b.hp) * 100000) + posSort(a, b) );
                }
                

                if (potentialTargets.length)
                {
                    potentialTargets[0].hp -= unit.power;
                
                    if (potentialTargets[0].hp <= 0) {
                        if (units.indexOf(potentialTargets[0]) < ud) {
                            ud--;
                        }
                        
                        if (potentialTargets[0].team == 0 && breakOnElfDeath) {
                            return false;
                        }
                        units = units.filter(e => e.hp > 0);
                    }
                }
            }
            r++;
        
        }
}

const calc2 = (filename) => {
    let result;
    let power = 4;
    do {
        result = calc(filename, power++, true);
        console.log(`Still working. Now the elfs have power: ${power}`)
    } while (!result)
}

console.log('Trying to answer the first question:')
calc('./inputs/15.txt')

console.log('Trying to answer the second question:')
calc2('./inputs/15.txt')
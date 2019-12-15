const fs = require('fs');

const input = fs.readFileSync('14.txt').toString().split('\n')
    .map(e => e.trim().split('=>').map(e => e.trim().split(', ').map(h => h.trim().split(' ').map(d => d.trim()))));

function calc(amountOfFuel) {
    let buildQueue = [{ product: 'FUEL', amount: amountOfFuel }];
    let children = [];
    let requiredOre = 0;

    let leftOvers = {};

    const calculateDependencies = (product, amount) => {
        if (product === 'ORE') {
            requiredOre += amount;
            return;
        }

        const recipe = input.find(e => e[1][0][1] === product);

        const producedAmount = recipe[1][0][0];
        const multiples = Math.ceil(amount / producedAmount);

        leftOvers[product] = (leftOvers[product] || 0) + (multiples * producedAmount) - amount;

        for (let el of recipe[0]) {
            children.splice(0, 0, { product: el[1], amount: multiples * el[0] })
        }
    }

    while (buildQueue.length > 0) {
        let { product, amount } = buildQueue.pop();

        if (amount) {
            calculateDependencies(product, amount);
        }

        if (buildQueue.length === 0 && children.length > 0) {
            const reduced = children.reduce((p, n) => {
                if (leftOvers[n.product] > n.amount) {
                    leftOvers[n.product] -= n.amount;
                    n.amount = 0;
                } else if (leftOvers[n.product] < n.amount) {
                    n.amount -= leftOvers[n.product];
                    leftOvers[n.product] = 0;
                } else if (leftOvers[n.product]) {
                    n.amount = 0;
                    leftOvers[n.product] = 0;
                }

                return ({ ...p, [n.product]: (p[n.product] || 0) + n.amount })
            }, {});
            buildQueue = Object.keys(reduced)
                .map(k => ({ product: k, amount: reduced[k] }));
            children = [];
        }
    }

    return requiredOre;
}

console.log(`Part1: ${calc(1)}`);

let increment = 1000000000000 / 2;
let prevIncrement = 0;
for (let i = 1; ;i += increment) {
    let ore = calc(i);

    prevIncrement = increment;
    increment = ore > 1000000000000
        ? -Math.max(1, Math.floor(Math.abs(increment) / 2))
        : Math.max(1,Math.floor(Math.abs(increment) / 2));

    if (ore < 1000000000000 && Math.abs(increment) === 1 && prevIncrement === -increment) {
        console.log(`Part2: ${i}`);
        return;
    }
}

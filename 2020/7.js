const fs = require('fs');

const input = fs.readFileSync('7.txt').toString().split('\n')
    .map(e => ({
        bag: e.trim().split('bags contain')[0].trim(),
        contains: e.trim().split('bags contain')[1].trim().split(', ').filter(d => d != 'no other bags.').map(d => ({
                number: Number(d.split(' ')[0]),
                type: (d.indexOf('bags.') > 0
                    ? d.substring(d.split(' ')[0].length, d.length - (d.split(' ')[0].length + 'bags.'.length))
                    : d.indexOf('bags') > 0
                        ? d.substring(d.split(' ')[0].length, d.length - (d.split(' ')[0].length + 'bags'.length))
                        : d.substring(d.split(' ')[0].length, d.length - (d.split(' ')[0].length + 'bag'.length))).trim()
            }))
        }));

function part1(bag) {
    let result =[]
    let q = [bag];

    let iteration = 0;

    while (q.length > 0) {
        let b = q.pop();

        for (let rule of input) {
            if (result.find(e => e.bag === rule.bag)) continue;
            if (rule.contains.find(e => e.type === b)) {
                result.push(({ bag: rule.bag, iteration }))
                q.push(rule.bag);
            }
        }

        iteration++;
    }

    return result.length;
}

function part2(bag) {
    function resursive(b) {
        let sum = 0;
        for (let rule of input) {
            if (rule.bag === b.type) {
                sum += rule.contains.map(e => resursive(e)).reduce((p, n) => p + n, 0)
            }
        }

        if (sum === 0) return b.number;

        return b.number + sum * b.number;
    }

    return resursive({ type: bag, number: 1 }) - 1
}

console.log(`Part1: ${part1('shiny gold')}`)
console.log(`Part2: ${part2('shiny gold')}`)
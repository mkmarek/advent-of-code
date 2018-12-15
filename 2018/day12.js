let fs = require('fs');

let input = fs.readFileSync('./inputs/12.txt').toString().trim().split('\n').map(e => e.trim()).filter(e => e);

let initialState = input[0].split(': ')[1];
let rules = [...input].slice(1).map(e => ({
    pat: e.split(' => ')[0],
    re: e.split(' => ')[1]
}))

String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}

const doStuff = (totalGens) => {
    let sums = [];
    let c = initialState;
    let prefixed = 0;
    for(let gen = 0; gen < totalGens; gen++) {
    
        if (c.indexOf('#') <= 3) {
            c = '...' + c;
            prefixed += 3;
        }

        if (c.lastIndexOf('#') >= c.length - 3) {
            c = c + '...';
        }

        let tmp = c;
        //console.log(c);

        for (let i = 2; i < tmp.length; i++) {
            let matches =  false;
            for (let rule of rules) {
                if (c[i - 2] == rule.pat[0] &&
                    c[i - 1] == rule.pat[1] &&
                    c[i] == rule.pat[2] &&
                    c[i + 1] == rule.pat[3] &&
                    c[i + 2] == rule.pat[4]) {
                        tmp = tmp.replaceAt(i, rule.re);
                        matches = rule;
                    }
            }

            if (!matches) {
                tmp = tmp.replaceAt(i, '.');
            } else {
                //tmp = tmp.replaceAt(i, matches.re);
            }
        }
        c = tmp;

        if (true) {
            let sum = 0;
    for (let i = 0; i  < c.length; i++) {
        if (c[i] === '#') {
            sum += i - prefixed;
        }
    }
            sums.push(sum);
            //console.log(gen, sum)
        }
    }

    let sum = 0;
    for (let i = 0; i  < c.length; i++) {
        if (c[i] === '#') {
            sum += i - prefixed;
        }
    }

    const predict = sums[totalGens -1 ] + (sums[totalGens - 1] - sums[totalGens - 2]) * (50000000000 - totalGens);

    return [sum, predict];
}

console.log(`First: ${doStuff(20)[0]}`);
console.log(`Second: ${doStuff(1000)[1]}`);
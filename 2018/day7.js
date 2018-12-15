let fs = require('fs');

let input = fs.readFileSync('./inputs/7.txt').toString().trim().split('\n').map(e => e.trim()).filter(e => e);

let stepreq = input.map(e => ({
    step: e.split(' ')[1],
    after: e.split(' ')[7]}))

let allSteps = [];

for (let step of stepreq) {
    if (!allSteps.includes(step.step)) {
        allSteps.push(step.step);
    }

    if (!allSteps.includes(step.after)) {
        allSteps.push(step.after);
    }
}

let steps = [];
allSteps = allSteps.sort();

//charCodeAt
let numberOfWorkers = 5;
let timeForStep = 60;

while (allSteps.length) {
    for (let i = 0; i < allSteps.length; i++){
        let step = allSteps[i];
        let req = stepreq.filter(e => e.after == step);

        if (req.filter(r => steps.filter(e => e.step == r.step) == 0).length > 0) {
            continue;
        }

        steps.push({ step, req: req.map(e => e.step), time: timeForStep + step.toLowerCase().charCodeAt(0) - 96 });
        allSteps = allSteps.filter(e => e !== step).sort();
        break;
    }
}

console.log(`Part1: ${steps.map(e => e.step).join('')}`);

let done = [];
let work = [];
let working = [];
while (true) {
    for (let step of working) {
        step.time--;
    }

    done = [...done, ...working.filter(e => e.time <= 0)];
    work = [...work, done];
    working =  working.filter(e => e.time > 0);

    let stepsAvailable = steps.filter(e => e.req.filter(e => done.filter(d => d.step == e).length == 0) == 0);
    while (working.length < numberOfWorkers
        && stepsAvailable.length > 0) {
        let step = stepsAvailable[0];
        steps = steps.filter((a, i) => a.step != step.step);
        stepsAvailable = stepsAvailable.filter((a, i) => a.step != step.step);
        working.push(step);
    }

    if (steps.length == 0 && working.length == 0) {
        break
    }
}

console.log(`Part2: ${work.length - 1}`);


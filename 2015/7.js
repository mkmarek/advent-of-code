const fs = require('fs');

let input =  fs.readFileSync('7.txt').toString().split('\n').map(e => e.trim().split(' '));

let cache = { b: 956 };

let getSignal = (name, prev) => {
	if (cache[name]) {
		return cache[name];
	}

	if (!isNaN(Number(name))) return Number(name)
	const instruction = input.find(e => e[e.length - 1] === name);

	console.log(instruction, prev, name);
	
	let val = 0;
	if (instruction.length === 3) val = getSignal(instruction[0], [...prev, name]);
	if (instruction.length === 4 && instruction[0] === 'NOT') val = ~getSignal(instruction[1], [...prev, name]);
	if (instruction.length === 5 && instruction[1] === 'AND') val = getSignal(instruction[0], [...prev, name]) & getSignal(instruction[2], [...prev, name]);
	if (instruction.length === 5 && instruction[1] === 'OR') val = getSignal(instruction[0], [...prev, name]) | getSignal(instruction[2], [...prev, name]);
	if (instruction.length === 5 && instruction[1] === 'LSHIFT') val = getSignal(instruction[0], [...prev, name]) << getSignal(instruction[2], [...prev, name]);
	if (instruction.length === 5 && instruction[1] === 'RSHIFT') val = getSignal(instruction[0], [...prev, name]) >> getSignal(instruction[2], [...prev, name]);

	cache[name] = val;

	return val;
}

console.log(getSignal('a', []));
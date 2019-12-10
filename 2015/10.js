const fs = require('fs');

let input =  fs.readFileSync('10.txt').toString().split('\n').map(e => e.split(' '));


console.log(shortestRoute([]));
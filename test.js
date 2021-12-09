const { sum, groupBy, toKeyValue, intersect} = require('./utils');

const arr = [1, 1, 1, 2, 2, 3, 4, 5];

console.log(sum(arr));
console.log(groupBy(arr));
console.log(toKeyValue({
    a: 1,
    b: 2,
    c: 3,
}))

console.log(intersect([1, 2, 3], [4, 3, 2]));
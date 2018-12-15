let fs = require('fs');

let input = fs.readFileSync('./inputs/8.txt').toString().trim().split(' ').map(e => e.trim()).map(e => Number(e));

const getNode =  (arr) => {
    const childNodes = arr[0];
    const metadata = arr[1];

    let size = 2;
    let children = [];
    for (let i = 0; i < childNodes; i++) {
        let [ s, node ] = getNode([...arr].slice(size))
        size += s;
        children.push(node);
    }

    let node = {
        metadata: [...arr].slice(size, size + metadata),
        children
    };

    return [size + metadata, node];
}

let [, root] = getNode(input)

let sumAllMetadata = (node) => {
    let s = 0;

    for (let c of node.children) {
        s += sumAllMetadata(c);
    }

    for (let m of node.metadata) {
        s += m;
    }

    return s;
}

let sumStuff = (node) => {
    let s = 0;
    if (node.children.length > 0) {
        for (let m of node.metadata) {
            let c = node.children[m-1];
            if (c) {
                s += sumStuff(c);
            }
        }
    } else {
        for (let m of node.metadata) {
            s += m;
        }
    }
    return s;
}

console.log(`Sum of all metadata is: ${sumAllMetadata(root)}`);
console.log(`The second part is: ${sumStuff(root)}`);
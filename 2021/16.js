const fs = require('fs');
const { deepCopy, getNeighbors } = require('../utils');

const data = fs.readFileSync('16.txt').toString().trim()
  .split('')
  .map(line => line.trim());

const hexToBin = `0 = 0000
1 = 0001
2 = 0010
3 = 0011
4 = 0100
5 = 0101
6 = 0110
7 = 0111
8 = 1000
9 = 1001
A = 1010
B = 1011
C = 1100
D = 1101
E = 1110
F = 1111`.split('\n').map(line => line.trim().split(' = '));

function part1(input) {
  const binary = input.map(hex => hexToBin.find(line => line[0] === hex)[1]).join('');
  // const binary = '110100101111111000101000'
  const packets = [];
  for (let i = 0; i < binary.length;) {
    const version = parseInt(binary.slice(i, i + 3), 2);
    i+=3;
    const typeId = parseInt(binary.slice(i, i + 3), 2);
    i+=3;
    let literal = '';
    let subpacketsInBits = null;
    let numberOfSubpackets = null;
    if (typeId == 4) {
      let bits = '';
      while (true) {
        const fiveBits = binary.slice(i, i + 5);
        bits += fiveBits.slice(1);;
        i+=5;

        if (fiveBits[0] === '0') break;
      }

      literal = `${parseInt(bits, 2)}`
    } else {
      const lengthTypeId = binary[i];
      i++;
      if ( lengthTypeId == '0') {
        subpacketsInBits = parseInt(binary.slice(i, i + 15), 2);
        i+=15;
      }
      if (lengthTypeId == '1') {
        const length = parseInt(binary.slice(i, i + 11), 2);
        i+=11;
        numberOfSubpackets = length;
      }
    }

    packets.push({ version, typeId, literal, subpacketsInBits, numberOfSubpackets });
  }
  return packets.reduce((acc, ver) => acc + ver.version, 0);
}

function parse(binary) {
  let i = 0;
  const at = i;
  const version = parseInt(binary.slice(i, i + 3), 2);
  i+=3;
  const typeId = parseInt(binary.slice(i, i + 3), 2);
  i+=3;
  let literal = '';
  let subpackets = [];
  if (typeId == 4) {
    let bits = '';
    while (true) {
      const fiveBits = binary.slice(i, i + 5);
      bits += fiveBits.slice(1);;
      i+=5;

      if (fiveBits[0] === '0') break;
    }

    literal = `${parseInt(bits, 2)}`
  } else {
    const lengthTypeId = binary[i];
    i++;
    if ( lengthTypeId == '0') {
      let subpacketsInBits = parseInt(binary.slice(i, i + 15), 2);
      let len = 0;

      while (len < subpacketsInBits) {
        const pack = parse(binary.slice(i + 15, i + 15 + subpacketsInBits));
        len += pack.len;
        i+= pack.len;
        subpackets.push(pack);
      }
      
      i+=15;
    }
    if (lengthTypeId == '1') {
      const length = parseInt(binary.slice(i, i + 11), 2);
      i+=11;
      for (let s = 0; s < length; s++) {
        const packet = parse(binary.slice(i));
        i+=packet.len;
        subpackets.push(packet);
      }
    }
  }

  return { len: i - at, version, typeId, literal, subpackets };
}

function part2(input) {
  const binary = input.map(hex => hexToBin.find(line => line[0] === hex)[1]).join('');
  
  const packets = parse(binary);
  
  return evalp(packets);
}

function evalp(packet) {
  // console.log(index, packets[index].typeId);
  switch (packet.typeId) {
    case 0: {
      // console.log('++++', subpackets);
      return packet.subpackets.reduce((acc, ver) => acc + evalp(ver), 0)
    }
    case 4: { const lit = Number(packet.literal);  return lit; }
    case 1: {
      // console.log('*********', subpackets);
      return packet.subpackets.reduce((acc, ver) => acc * evalp(ver), 1);
    }
    case 2: return packet.subpackets.reduce((acc, ver) => Math.min(acc, evalp(ver)), 999999999999999999);
    case 3: return packet.subpackets.reduce((acc, ver) => Math.max(acc, evalp(ver,)), 0);
    case 5: { 
      return evalp(packet.subpackets[0]) > evalp(packet.subpackets[1]) ? 1 : 0;
    }
    case 6: { 
      return evalp(packet.subpackets[0]) < evalp(packet.subpackets[1]) ? 1 : 0;
    }
    case 7: { 
      // console.log('xxx', a, b);
      return evalp(packet.subpackets[0]) === evalp(packet.subpackets[1]) ? 1 : 0;
    }
  }

  throw new Error('Unknown packet type: ' + packets[index].typeId);
}

console.log(`Part1: ${part1(deepCopy(data))}`)
console.log(`Part2: ${part2(deepCopy(data))}`)

const fs = require('fs');
const { deepCopy, getNeighbors } = require('../utils');

const data = fs.readFileSync('16.txt').toString().trim()
  .split('')
  .map(line => line.trim());

function hex2bin(hex){
  return parseInt(hex, 16).toString(2).padStart(4, '0');
}

function sumVersions(packet) {
  return packet.version + packet.children.reduce((acc, ver) => acc + sumVersions(ver), 0);
}

function parseLiteral(index, binary) {
  let bits = '';
  while (true) {
    const fiveBits = binary.slice(index, index + 5);
    bits += fiveBits.slice(1);
    index += 5;

    if (fiveBits[0] === '0') break;
  }

  return [parseInt(bits, 2), index];
}

function parseChildrenWithLength(index, binary) {
  const length = parseInt(binary.slice(index, index + 11), 2);
  index += 11;

  const children = [];

  for (let s = 0; s < length; s++) {
    const packet = parse(binary.slice(index));
    index += packet.len;
    children.push(packet);
  }

  return [children, index];
}

function parseChildrenWithByteLength(index, binary) {
  let childrenInBits = parseInt(binary.slice(index, index + 15), 2);
  index += 15;

  let len = 0;
  const children = [];

  while (len < childrenInBits) {
    const pack = parse(binary.slice(index, index + childrenInBits));
    len += pack.len;
    index += pack.len;
    children.push(pack);
  }
  
  return [children, index];
}

function parse(binary) {
  let cursor = 0;
  const packet = {};

  packet.version = parseInt(binary.slice(cursor, cursor + 3), 2);
  cursor+=3;

  packet.typeId = parseInt(binary.slice(cursor, cursor + 3), 2);
  cursor+=3;

  if (packet.typeId == 4) {
    const [lit, nextIndex] = parseLiteral(cursor, binary);

    packet.literal = lit;
    packet.children = [];
    cursor = nextIndex;
  } else {
    const lengthTypeId = binary[cursor];
    cursor++;

    if (lengthTypeId == '0') {
      const [children, nextIndex] = parseChildrenWithByteLength(cursor, binary);
      packet.children = children;
      cursor = nextIndex;
    } else {
      const [children, nextIndex] = parseChildrenWithLength(cursor, binary);
      packet.children = children;
      cursor = nextIndex;
    }
  }

  packet.len = cursor;

  return packet;
}

function evalPacket(packet) {
  switch (packet.typeId) {
    case 0: return packet.children.reduce((acc, ver) => acc + evalPacket(ver), 0);
    case 1: return packet.children.reduce((acc, ver) => acc * evalPacket(ver), 1);
    case 2: return packet.children.reduce((acc, ver) => Math.min(acc, evalPacket(ver)), 999999999999999999);
    case 3: return packet.children.reduce((acc, ver) => Math.max(acc, evalPacket(ver,)), 0);
    case 4: return Number(packet.literal);
    case 5: return evalPacket(packet.children[0]) > evalPacket(packet.children[1]) ? 1 : 0;
    case 6: return evalPacket(packet.children[0]) < evalPacket(packet.children[1]) ? 1 : 0;
    case 7: return evalPacket(packet.children[0]) === evalPacket(packet.children[1]) ? 1 : 0;
  }

  throw new Error('Unknown packet type: ' + packets[index].typeId);
}

function part1(input) {
  return sumVersions(parse(input.map(hex => hex2bin(hex)).join('')));
}

function part2(input) {
  return evalPacket(parse(input.map(hex => hex2bin(hex)).join('')));
}

console.log(`Part1: ${part1(deepCopy(data))}`)
console.log(`Part2: ${part2(deepCopy(data))}`)

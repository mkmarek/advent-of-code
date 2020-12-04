const fs = require('fs');

const input = fs.readFileSync('4.txt').toString().split('\r\n\r\n')
    .map(e => e.replace(/\n/g, ' ').split(' ').map(x => x.split(':')));

function getValues(entry) {
    let byr = entry.find(e => e[0].trim() === 'byr');
    let iyr = entry.find(e => e[0].trim() === 'iyr');
    let eyr = entry.find(e => e[0].trim() === 'eyr');
    let hgt = entry.find(e => e[0].trim() === 'hgt');
    let hcl = entry.find(e => e[0].trim() === 'hcl');
    let ecl = entry.find(e => e[0].trim() === 'ecl');
    let pid = entry.find(e => e[0].trim() === 'pid');
    let cid = entry.find(e => e[0].trim() === 'cid');

    byr = byr && byr[1].trim();
    iyr = iyr && iyr[1].trim();
    eyr = eyr && eyr[1].trim();
    hgt = hgt && hgt[1].trim();
    hcl = hcl && hcl[1].trim();
    ecl = ecl && ecl[1].trim();
    pid = pid && pid[1].trim();
    cid = cid && cid[1].trim();

    return { byr, iyr, eyr, hgt, hcl, ecl, pid };
}

function valuesExists(entry) {
    const { byr, iyr, eyr, hgt, hcl, ecl, pid } = getValues(entry);
    return byr && iyr && eyr && hgt && hcl && ecl && pid;
}

function isValid(entry) {
    const { byr, iyr, eyr, hgt, hcl, ecl, pid } = getValues(entry);

    if (byr && iyr && eyr && hgt && hcl && ecl && pid) {
        return (Number(byr) >= 1920 && Number(byr) <= 2002) &&
            (Number(iyr) >= 2010 && Number(iyr) <= 2020) &&
            (Number(eyr) >= 2020 && Number(eyr) <= 2030) &&
            (hgt.endsWith('cm') ? Number(hgt.substring(0, hgt.length - 2)) >= 150 && Number(hgt.substring(0, hgt.length - 2)) <= 193 : Number(hgt.substring(0, hgt.length - 2)) >= 59 && Number(hgt.substring(0, hgt.length - 2)) <= 76) &&
            (/(^#[0-9|a-f]{6}$)/.test(hcl)) &&
            ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(ecl) &&
            (/(^[0-9]{9}$)/.test(pid));
    }

    return false;
}

function part1() {
    let valid = 0;

    for (let i = 0; i < input.length; i++) {
        if (valuesExists(input[i])) valid++;
    }

    return valid
}

function part2() {
    let valid = 0;

    for (let i = 0; i < input.length; i++) {
        if (isValid(input[i])) valid++;
    }

    return valid
}

console.log(`Part1: ${part1()}`)
console.log(`Part2: ${part2()}`)
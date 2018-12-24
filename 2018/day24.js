let fs = require('fs');

let input = fs.readFileSync('./inputs/24.txt').toString().trim().split('\n').map(e => e.trim()).filter(e => e);

let immuneSystem = [];
let infection = [];

let current = null;

for (let line of input) {
    if (line === 'Immune System:') {
        current = immuneSystem;
    } else if (line === 'Infection:') {
        current = infection;
    } else {
        let units = line.substr(0, line.indexOf(' units'));

        let index = units.length + ' units each with '.length;
        let hp = line.substr(index, line.indexOf(' hit points') - index);

        index += hp.length + ' hit points '.length
        
        let immune = [];
        let weak = [];

        if (line[index] == '(') {
            const attributes = line.substr(index + 1, line.indexOf(')', index + 1) - index - 1);
            let types = attributes.split(';');

            for (let type of types) {
                if (type.trim().startsWith('immune to')) {
                    immune = type.substr('immune to '.length).split(',').map(e => e.trim())
                } else {
                   
                    weak = type.substr('weak to '.length).split(',').map(e => e.trim())
                }
            }

            index = line.indexOf(')', index + 1) + 2;
        }

        index = index + 'with an attack that does '.length;
        let attack = line.substr(index, line.indexOf(' damage', index) - index)
        index = line.indexOf(' damage', index) + ' damage at initiative '.length

        current.push(({
            idx: current.length + 1,
            units: Number(units),
            hp: Number(hp),
            immune,
            weak,
            damage: Number(attack.split(' ')[0]),
            damageType: attack.split(' ')[1].trim(),
            initiative: Number(line.substr(index))
        }))
    }
}

const getEffectivePower = (group) => {
    return group.damage * group.units;
}

const calculateDamage = (attacker, defender) => {
    if (defender.immune.map(e => e.trim()).includes(attacker.damageType.trim())) {
        return 0;
    }

    if (defender.weak.map(e => e.trim()).includes(attacker.damageType.trim())) {
        return getEffectivePower(attacker) * 2;
    }

    return getEffectivePower(attacker);
}

const selectTarget = (group, targets) => {
    let sorted = targets
        .filter(e => e.group !== group.group)
        .sort((a, b) => {
            let dmg = calculateDamage(group, b) - calculateDamage(group, a);

            if (dmg == 0) {
                let effpow = getEffectivePower(b) - getEffectivePower(a);

                if (effpow == 0) {
                    return b.initiative - a.initiative;
                }

                return effpow;
            }

            return dmg;
        })

    return sorted[0];
}

const fight = (boost = 0) => {
    let groups = [
        ...immuneSystem
            .map(e => ({ ...e, damage: e.damage + boost, group: 'Immune system' })),
        ...infection
            .map(e => ({ ...e, group: 'Infection' }))
    ]

    while (true) {
        groups = groups
        .sort((a, b) => {
            let effpow = getEffectivePower(b) - getEffectivePower(a);

            if (effpow == 0) {
                return b.initiative - a.initiative;
            }

            return effpow;
        })

        let potentialTargets = [...groups];

        for (let group of groups) {
            group.target = selectTarget(group, potentialTargets);

            if (group.target && calculateDamage(group, group.target) == 0) {
                group.target = null;
            } else {
                potentialTargets = potentialTargets.filter(e => e != group.target);
            }
        }

        groups = groups
        .sort((a, b) => b.initiative - a.initiative)

        let damageWasDealt = false;
        for (let group of groups) {
            if (group.target && group.units > 0) {
                let damage = calculateDamage(group, group.target);

                let unitsLost = Math.floor(damage / group.target.hp);

                if (unitsLost > 0) damageWasDealt = true;

                group.target.units -= unitsLost;
                group.target = null;
            }
        }

        if (!damageWasDealt) return null;
        
        groups = groups.filter(e => e.units > 0);
        
        if (!groups.find(e => e.group == 'Immune system') || !groups.find(e => e.group == 'Infection')) {
            return groups;
        }
    }
}

console.log(`Answer 1 is: ${fight(0).reduce((a, b) => a + b.units, 0)}`);

let winner = null;
let boost = 1;
do {
    winner = fight(boost);
    boost++;
} while (!winner || winner[0].group === 'Infection')

console.log(`Answer 2 is: ${winner.reduce((a, b) => a + b.units, 0)}`);
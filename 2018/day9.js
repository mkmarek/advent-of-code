let fs = require('fs');

const compute = (players, lastMarbleValue) => {
    let scores = [];

    let marbles = { value: 0 };
    marbles.next = marbles;
    marbles.prev = marbles;

    let currentMarble = marbles;
    let nextMarble = 1;
    while (true) {
        for (var i = 0; i < players; i++) {


            if (nextMarble % 23 == 0) {
                if (!scores[i]) {
                    scores[i] = nextMarble
                } else {
                    scores[i] += nextMarble
                }

                for (let i = 0; i < 7; i++) {
                    currentMarble = currentMarble.prev;
                }

                scores[i] += currentMarble.value

                let tt = currentMarble.next;
                let tt2 = currentMarble.prev;
                currentMarble.prev.next = tt;
                currentMarble.next.prev = tt2;

                currentMarble = currentMarble.next;
            } else {
                let tmp = {
                    value: nextMarble,
                    prev: currentMarble.next,
                    next: currentMarble.next.next
                }

                currentMarble.next.next.prev = tmp;
                currentMarble.next.next = tmp;
                currentMarble = tmp;
            }

            if (lastMarbleValue <= nextMarble) {
                let max = 0;

                for (let score of scores) {
                    if (max < score) {
                        max = score;
                    }
                }

                return max;
            }

            nextMarble++
        }
    }
}

console.log(`Answer1 is: ${compute(400, 71864)}`);
console.log(`Answer2 is: ${compute(400, 71864 * 100)}`);
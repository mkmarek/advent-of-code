let elf1 = 0;
let elf2 = 1;
let arr = [3, 7];
let iterations = 939601;

while (arr.length < iterations + 10) {
    let combined = arr[elf1] + arr[elf2];
    let str =  `${combined}`;
    for (let x = 0; x < str.length; x++) {
        arr.push(Number(str[x]));
    }

    elf1 = (elf1 + 1 + arr[elf1] )% arr.length;
    elf2 = (elf2 + 1 + arr[elf2]) % arr.length;
}

console.log(`Answer1: ${arr.slice(arr.length - 10).join('')}`);

let iterstr = `${iterations}`;
while (true) {
    let combined = arr[elf1] + arr[elf2];
    let str =  `${combined}`;
    for (let x = 0; x < str.length; x++) {
        arr.push(Number(str[x]));

        if (arr.length >= iterstr.length) {
            let isGood = true;
            for (let i = 0; i < iterstr.length; i++) {
                if (arr[arr.length - iterstr.length + i] != iterstr[i]) {
                    isGood = false;
                }
            }
    
            if (isGood) {
                console.log(`Answer1: ${arr.length - iterstr.length}`);
                return;
            }
        }
    }

    elf1 = (elf1 + 1 + arr[elf1] )% arr.length;
    elf2 = (elf2 + 1 + arr[elf2]) % arr.length;
}
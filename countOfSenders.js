const { log } = require('console');
const fs = require('fs')

let input = fs.readFileSync('output.json')

input = JSON.parse(input);

// log(input);

let mp = new Map();

input.forEach(item => {
    let initial_sender = item.initial_sender;

    if (mp.has(initial_sender)) {
        mp.set(initial_sender, mp.get(initial_sender) + 1);
    } else {
        mp.set(initial_sender, 1);
    }
})

// log(mp);


let ans = []


mp.forEach((value, key) => {
    // console.log(key, value); // may print a 1, b 2, c 3 in any order

    let obj = {
        "sender": key,
        "count": value
    }
    ans.push(obj);
});

// ans.sort((a, b) => { a.count > b.count })


ans.sort((a, b) => {
    if (a.count < b.count) return 1;
    if (a.count > b.count) return -1;
    return 0;
});

fs.writeFileSync('countingTxnsOfUsers.json', JSON.stringify(ans, null, 2));

log("done")


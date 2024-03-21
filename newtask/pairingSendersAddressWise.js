const { log } = require('console');
const fs = require('fs');

let input = fs.readFileSync('swaps.json');

input = JSON.parse(input);

let mpp = new Map();


input.forEach(item => {
    let initial_sender = item.initial_sender;

    if (!mpp.has(initial_sender)) {
        mpp.set(initial_sender, []);
    }
    mpp.get(initial_sender).push(item);
});


// log(mpp)
let ans = []

for (let [key, value] of mpp.entries()) {
    // console.log(key, value);

    let sender = key;
    swaps = value;

    let obj = {
        "initial_sender": sender,
        "transactions": value
    }

    ans.push(obj);
}


ans.forEach(item => {
    let data = item;

    data.transactions.sort((a, b) => a.swaps[0].unixTimestamp - b.swaps[0].unixTimestamp);
})

fs.writeFileSync('swapsAddressWise.json', JSON.stringify(ans, null, 2));

log("done, output in swapsAddressWise.json")


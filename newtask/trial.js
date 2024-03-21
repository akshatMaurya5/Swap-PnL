const { log } = require('console');
const fs = require('fs');

let input1 = fs.readFileSync('pnl1.json');
input1 = JSON.parse(input1);

let input2 = fs.readFileSync('pnl2.json');
input2 = JSON.parse(input2);

let ans = [];
let mpp = new Map();

input1.forEach(item => {
    // log(item);
    mpp.set(item.address, item.PnL);
});
// log(mpp.get('0xbc05a930f9c959244cb79b6e1d10e947067e73ba'))

// log(mpp);

input2.forEach(item => {
    let obj = {
        "address": item.address,
        "PnL1": mpp.get(item.address),
        "PnL2": item.PnL
    }
    ans.push(obj);
});

log(ans);

fs.writeFileSync('pnl.json', JSON.stringify(ans, null, 2));


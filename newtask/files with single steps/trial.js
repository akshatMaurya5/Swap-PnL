const { log } = require('console');
const { assertNormalize } = require('ethers');
const fs = require('fs');

let input1 = fs.readFileSync('pnl.json');
input1 = JSON.parse(input1);

let input2 = fs.readFileSync('pnl1.json');
input2 = JSON.parse(input2);

let mpp1 = new Map();

input1.forEach(item => {
    mpp1.set(item.address, item.PnL);
})

// log(mpp1);

let same = 0;

// log(input2)

let cnt = 0;
let res = []

input2.forEach(item => {

    if (item.pnl != mpp1.get(item.sender)) {
        log(item.sender)
        cnt++;
    }
    let curr = {
        "sender": item.sender,
        "pnlOrig": mpp1.get(item.sender),
        "pnl": item.pnl
    };
    // log(curr)

    res.push(curr)


})

log(res.length)
log(cnt)

fs.writeFileSync('compare.json', JSON.stringify(res, null, 2), 'utf8')

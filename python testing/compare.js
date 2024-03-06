const { log } = require('console');
const fs = require('fs')

let rawswapdata = fs.readFileSync('../protcolwise/uniswapV3.json')
const swapdata = JSON.parse(rawswapdata);


let myrawoutput = fs.readFileSync('transactions.json')
const mydata = JSON.parse(myrawoutput)

let mydataset = new Set();
let swapdataset = new Set();

// cnt = 0;

// for (let i = 0; i < swapdata.length; i++) {
//     log(swapdata[i]);
//     cnt++;

//     if (cnt > 5) break;
// }



swapdata.forEach(item => {
    const txnHash = item.transaction.id;
    swapdataset.add(txnHash);

    // console.log(txnHash);
})

mydata.forEach(item => {
    const txnHash = item.transaction_hash;
    mydataset.add(txnHash);
    // console.log(txnHash);
})

let intersection = []

swapdataset.forEach(hash => {
    if (mydataset.has(hash)) {
        intersection.push({ "transaction_hash": hash });
    }
})

fs.writeFileSync('dataCovered.json', '');


fs.writeFileSync('dataCovered.json', JSON.stringify(intersection, null, 2));
console.log("done | data in dataCovered.json");
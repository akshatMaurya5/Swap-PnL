const { log } = require('console');
const fs = require('fs');

let rawswapdata = fs.readFileSync('../protcolwise/uniswapV3.json')
const swapdata = JSON.parse(rawswapdata);

let rawdata = fs.readFileSync('transactions.json')
const data = JSON.parse(rawdata);

let swaps = new Set();

let address = '0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad'
for (let i = 0; i < data.length; i++) {

    if (data[i].sender == address || data[i].recipient == address) {
        swaps.add(data[i].transaction_hash);
    }
}

log(swaps.size)

// let swapset = new Set();

// for (let i = 0; i < swapdata.length; i++) {
//     swapset.add(swapdata[i].transaction.id);
// }

// let intersection = new Set();


// swaps.forEach(hash => {
//     if (swapset.has(hash)) {
//         intersection.add(hash);
//     }
// })

// log(intersection.size)
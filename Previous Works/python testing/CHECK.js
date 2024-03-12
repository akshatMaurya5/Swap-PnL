const fs = require('fs');


let rawswapdata = fs.readFileSync('../protcolwise/uniswapV3.json')
const swapdata = JSON.parse(rawswapdata);


let myrawoutput = fs.readFileSync('transactions.json')
const mydata = JSON.parse(myrawoutput)

let myset = new Set();

let swapset = new Set();

swapdata.forEach(item => {
    swapset.add(item.transaction.id);
})

mydata.forEach(item => {
    myset.add(item.transaction_hash);
})

console.log("size of my set: " + myset.size)
console.log("size of swap set: " + swapset.size)
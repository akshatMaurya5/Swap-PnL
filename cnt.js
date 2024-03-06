const { log } = require('console');
const fs = require('fs')

// let input = JSON.parse(fs.readFileSync('check1.json'));

// let valid = 0, invalid = 0;

// input.forEach(data => {
//     const count = data.swaps.reduce((total, arr) => total + arr.length, 0);
//     // log(count);
//     if (count > 0) valid++;
//     else invalid++;
//     if (data.transaction_hash == "0x00a45c350fe41fab6799667fcb4f93c5631fb1d42080c2c520c00cb56fa39ae3") {
//         // log(count);
//     }
// })


// log(`valid = ${valid} invalid = ${invalid}`)


let data = JSON.parse(fs.readFileSync('filteredTransactions.json'));

let st = new Set();

data.forEach(item => {
    st.add(item.transaction_hash);
})

log(st.size)


let inp = JSON.parse(fs.readFileSync('singleSwaps.json'));
log(inp.length)
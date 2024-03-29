const { log } = require('console');
const fs = require('fs');

let input = JSON.parse(fs.readFileSync('check.json'));

let st = new Set();
st.add("WETH")
st.add("CLOSEDAI")

let hashes = new Set();
let diffCurrenty = new Set();

input.forEach(item => {
    let txns = item.transactions;
    txns.forEach(txn => {
        let swaps = txn.swaps

        swaps.forEach(swap => {
            if (!st.has(swap.token0_symbol) || !st.has(swap.token1_symbol)) {
                hashes.add(txn.transaction_hash)
                if (!st.has(swap.token0_symbol)) {
                    diffCurrenty.add(swap.token0_symbol)
                }
                if (!st.has(swap.token1_symbol)) {
                    diffCurrenty.add(swap.token1_symbol)
                }
            }
        })
    })
})

log(hashes)
log(hashes.size)
log(diffCurrenty)




fs.writeFileSync('check.json', JSON.stringify(input, null, 2));


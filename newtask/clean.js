//random file, no need to worry about

const { log } = require('console');
const fs = require('fs');

let input = fs.readFileSync('swapsAddressWise.json');
input = JSON.parse(input);

let st = new Set();
st.add("CLOSEDAI")
st.add("WETH")


input.forEach(item => {
    let txns = item.transactions;

    let good = true;
    txns.forEach(txn => {

        let swaps = txn.swaps;
        swaps.forEach(swap => {
            if (!st.has(swap.token0_symbol) || !st.has(swap.token1_symbol)) {
                log("bad", txn.transaction_hash)
                good = false;
            }
        })


    })

    log(item.initial_sender)
    if (good) {
        log("all good");
    }
    else {
        log("bad");
    }

})
// log(input[0].initial_sender)
// if (good) log("all good");
// else log("bad")


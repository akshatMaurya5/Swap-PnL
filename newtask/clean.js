//random file, no need to worry about

const { log } = require('console');
const fs = require('fs');

let input = fs.readFileSync('swapsAddressWiseCopy.json');
input = JSON.parse(input);
let st = new Set();
st.add("CLOSEDAI")
st.add("WETH")

function good(swap) {
    return st.has(swap.token0_symbol) && st.has(swap.token1_symbol);
}

function bothBad(swap) {
    if (st.has(swap.token0_symbol) || st.has(swap.token1_symbol)) return false;
    return true;
}

function deleteBothBad(input) {
    input.forEach(item => {
        let transactions = item.transactions;
        // log(transactions);

        transactions.forEach(transaction => {
            let swaps = transaction.swaps;
            let newSwaps = []

            swaps.forEach(swap => {
                if (!bothBad(swap)) {
                    newSwaps.push(swap)
                }
            })
        })
    })
}

function filterSwaps(input) {

    input.forEach(item => {
        let transactions = item.transactions;

        transactions.forEach(transaction => {
            let swaps = transaction.swaps;
            let newSwaps = []

            for (let i = 0; i < swaps.length; i++) {
                if (good(swaps[i])) {
                    newSwaps.push(swaps[i])
                }
                else if (!st.has(swaps[i].token1_symbol)) {

                    let startPoint = swaps[i];
                    let currTokenSymbol = swaps[i].token1_symbol;

                    let j = i + 1;
                    while (j < swaps.length) {
                        if (swaps[j].token0_symbol == currTokenSymbol && !st.has(swaps[j].token1_symbol)) {
                            currTokenSymbol = swaps[j].token1_symbol;
                            j++;
                        }
                        else {
                            break;
                        }
                    }

                    // log(swaps[j]);
                    // break;
                    i = j;
                    if (j < swaps.length) {
                        let modifiedSwap = startPoint;
                        startPoint.token1_address = swaps[j].token1_address;
                        startPoint.token1_symbol = swaps[j].token1_symbol;
                        startPoint.amount1 = swaps[j].amount1;

                        newSwaps.push(modifiedSwap)
                    }

                }
            }


            transaction.swaps = newSwaps;
        })
    })


    input.forEach(item => {
        let transactions = item.transactions;

        transactions.forEach(transaction => {
            let swaps = transaction.swaps;


            if (!st.has(swaps[0].token0_symbol) && swaps[0].token1_symbol == "WETH") {
                swaps.shift();
            }

            transaction.swaps = swaps;
        })
    })


}




// deleteBothBad(input)

filterSwaps(input)

input.forEach(item => {
    let txns = item.transactions;
    txns.forEach(txn => {
        let swaps = txn.swaps
        let newSwaps = []
        swaps.forEach(swap => {
            if (swap.token1_symbol != swap.token0_symbol) {
                newSwaps.push(swap);
            }
        })

        txn.swaps = newSwaps;
    })
})

fs.writeFileSync('check.json', JSON.stringify(input, null, 2))
































































/*

let badAddresses = []

input.forEach(item => {
    let txns = item.transactions;

    let good = true;
    txns.forEach(txn => {

        let swaps = txn.swaps;
        swaps.forEach(swap => {
            if (!st.has(swap.token0_symbol) || !st.has(swap.token1_symbol)) {
                // log("bad", txn.transaction_hash)
                good = false;
            }
        })


    })

    // log(item.initial_sender)
    // if (good) {
    //     log("all good");
    // }
    // else {
    //     log("bad");
    // }

    if (!good) {
        // log({ "bad sender": item.initial_sender })
        badAddresses.push({ "sender": item.initial_sender, "cnt": item.transactions.length })
    }

})


badAddresses.sort((a, b) => b.cnt - a.cnt);

log(badAddresses)
fs.writeFileSync("bad.json", JSON.stringify(badAddresses, null, 2))



// log(input[0].initial_sender)
// if (good) log("all good");
// else log("bad")

*/


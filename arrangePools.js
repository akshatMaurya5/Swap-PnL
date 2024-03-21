const { log } = require('console')
const fs = require('fs')

let input = fs.readFileSync('pairedSwaps.json')
input = JSON.parse(input)

let pools = new Map();

function makePool(token0, token1) {
    let sortedTokens = [token0, token1].sort();
    let pool = sortedTokens.join("/");
    return pool;
}

function arrangeInPools() {
    input.forEach(item => {
        let swaps = item.swaps;
        let initial_sender = item.initial_sender;

        swaps.forEach(swap => {
            let token0 = swap.token0_symbol;
            let token1 = swap.token1_symbol;

            let newSwap = {
                "transaction_hash": item.transaction_hash,
                "initial_sender": initial_sender,
                "sender": swap.sender,
                "recipient": swap.recipient,
                "block_timestamp": swap.block_timestamp,
                "unixTimestamp": swap.unixTimestamp,
                "token0_address": swap.token0_address,
                "token0_symbol": swap.token0_symbol,
                "amount0": swap.amount0,
                "token1_address": swap.token1_address,
                "token1_symbol": swap.token1_symbol,
                "amount1": swap.amount1

            }

            let pool = makePool(token0, token1);

            if (!pools.has(pool)) {
                pools.set(pool, []);
            }

            pools.get(pool).push(newSwap);
        })
    })
}

arrangeInPools();

// Create an array of pool names
let onlyNames = Array.from(pools.keys());

// Convert the Map to an object
// let poolsObject = {};


let ans = []
pools.forEach((value, key) => {
    // poolsObject[key] = value;
    let obj = {
        "pool": key,
        "swaps": value
    }

    ans.push(obj);

});

// Write poolsObject to JSON file
fs.writeFileSync('temp.json', JSON.stringify(ans, null, 2));

log("output in temp.json")

// Write onlyNames array to JSON file
fs.writeFileSync('poolNames.json', JSON.stringify(onlyNames));

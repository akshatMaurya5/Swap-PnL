const { log } = require('console')
const fs = require('fs')

let input = fs.readFileSync('pairedSwaps.json')
input = JSON.parse(input)

// log(input);

let pools = new Map();

function makePool(token0, token1) {
    let sortedTokens = [token0, token1].sort();
    let pool = sortedTokens.join("/");
    return pool;
}


function arrangeInPools() {
    input.forEach(item => {
        let swaps = item.swaps;

        swaps.forEach(swap => {
            let token0 = swap.token0_symbol;
            let token1 = swap.token1_symbol;

            let pool = makePool(token0, token1);

            if (!pools.has(pool)) {
                pools.set(pool, []);
            }

            pools.get(pool).push(swap);
        })
    })
}



arrangeInPools();

// log(pools);


let poolsObject = {};
let onlyNames = [];
pools.forEach((value, key) => {
    onlyNames.push(key);
    poolsObject[key] = value;
});

// Convert object to JSON string
let json = JSON.stringify(poolsObject, null, 2);

// Write JSON string to file
fs.writeFileSync('temp.json', json);

fs.writeFileSync('poolNames.json', JSON.stringify(onlyNames));



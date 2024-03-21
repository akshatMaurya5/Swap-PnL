const { log } = require('console')
const fs = require('fs')

let input = fs.readFileSync('temp.json')

input = JSON.parse(input)

// log(input);


let ans = []

input.forEach(item => {
    log('pool:', item.pool)
    let parts = item.pool.split("/")

    let front = false, back = false;

    let swaps = item.swaps;

    for (let i = 0; i < swaps.length; i++) {
        let token0_symbol = swaps[i].token0_symbol;
        let token1_symbol = swaps[i].token1_symbol;

        if (token0_symbol == parts[0] && token1_symbol == parts[1]) {
            front = true;
        }

        if (token0_symbol == parts[1] && token1_symbol == parts[0]) {
            back = true;
        }

        if (front && back) {
            ans.push(item);
            break;
        }
    }
})

fs.writeFileSync('poolsWithBuyAndSell.json', JSON.stringify(ans, null, 2));
log("done || output in poolsWithBuyAndSell.json")
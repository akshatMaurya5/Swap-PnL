const { log } = require('console')
const fs = require('fs')

let input = fs.readFileSync('poolNames.json')
input = JSON.parse(input)

let ans = []


let stableCoins = [
    "USDT",
    "USDC",
    "DAI",
    "FDUS",
    "TUSD",
    "FRAX",
    "TUSD",
    "BNB",
    "LINK",
    "WBTC",
    "WETH",
    "WBTC",
]

let st = new Set();

stableCoins.forEach(item => {
    st.add(item)
})

input.forEach(item => {
    let parts = item.split("/")
    // log(item, parts);

    if (st.has(parts[0]) && st.has(parts[1])) {
        log(item);
    }
})


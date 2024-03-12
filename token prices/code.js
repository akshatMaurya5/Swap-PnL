const { log } = require('console');
const fs = require('fs');

let input = JSON.parse(fs.readFileSync('swaps.json'));

let daiMap = new Map();
let usdcMap = new Map();
let usdtMap = new Map();
let wbtcMap = new Map();
let wethMap = new Map();

let symbolMap = new Map();

function fillSymbolMap() {
    symbolMap.set('WETH', wethMap);
    symbolMap.set('USDC', usdcMap);
    symbolMap.set('USDT', usdtMap);
    symbolMap.set('WBTC', wbtcMap);
    symbolMap.set('WETH', wethMap);
}

function fillMap(map, filename) {
    let data = JSON.parse(fs.readFileSync(filename));
    data.forEach(item => {
        map.set(item.unixTimestamp, item.price);
    });
}

function getRelevantMap(symbol) {
    return symbolMap.get(symbol);
}

function findClosestKey(map, number) {
    let closestKey;
    let minDifference = Infinity;

    for (const key of map.keys()) {
        const difference = Math.abs(key - number);
        if (difference < minDifference) {
            minDifference = difference;
            closestKey = key;
        }
    }

    return closestKey;
}

function getPnL() {

    let ans = []
    input.forEach(item => {
        // log(item);
        let allSwaps = item.swaps;
        let swap = allSwaps[allSwaps.length - 1];

        log(swap);

        log(item.transaction_hash)
        let timestamp = swap.unixTimestamp;


        log(timestamp)

        // log("_------------------------------------------------------------------------------------_")

        let amount0 = swap.amount0;
        let symbol0 = swap.token0_symbol;

        let amount1 = swap.amount1;
        let symbol1 = swap.token1_symbol;

        log(symbol0, amount0, symbol1, amount1)

        let initial_token_map = getRelevantMap(symbol0);
        let final_token_map = getRelevantMap(symbol1);


        // log(initial_token_map);

        let key1 = findClosestKey(initial_token_map, timestamp);
        let key2 = findClosestKey(final_token_map, timestamp);



        log("timestamps:", timestamp, key1, key2);

        let price_of_initial_token = initial_token_map.get(key1);
        let price_of_final_token = final_token_map.get(key2);

        let initalAmountSpent = amount0 * price_of_initial_token;
        let finalAmountReceived = amount1 * price_of_final_token;

        let pnl = finalAmountReceived - initalAmountSpent;

        let swapObj = {
            "symbol0": symbol0,
            "amount0": amount0,
            "symbol1": symbol1,
            "amount1": amount1,
            "price_of_initial_token": price_of_initial_token,
            "price_of_final_token": price_of_final_token,
        }

        let obj = {
            "transaction_hash": item.transaction_hash,
            "initial_sender": item.initial_sender,
            "pnl": pnl,
            "tokenInfo": swapObj,
            "swap": allSwaps
        }
        ans.push(obj);
        log(pnl);


        fs.writeFileSync('pnl.json', JSON.stringify(ans, null, 2));
    })






}

fillMap(daiMap, 'daiPrice.json');
fillMap(usdcMap, 'usdcPrice.json');
fillMap(usdtMap, 'usdtPrice.json');
fillMap(wbtcMap, 'wbtcPrice.json');
fillMap(wethMap, 'wethPrice.json');
fillSymbolMap();

getPnL();

// log(wethMap);


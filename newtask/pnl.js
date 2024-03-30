const { log } = require('console');
const fs = require('fs')

function fillMap(map, path) {
    let data = fs.readFileSync(path)
    data = JSON.parse(data);

    data.forEach(item => {
        map.set(item.unixTimestamp, item.price);
    });
}
function findClosestKey(number) {
    let closestKey;
    let minDifference = Infinity;

    for (const key of wethMap.keys()) {
        const difference = Math.abs(key - number);
        if (difference < minDifference) {
            minDifference = difference;
            closestKey = key;
        }
    }

    return closestKey;
}


function pnl(input) {

    let ans = []
    input.forEach(item => {
        let initial_sender = item.initial_sender;
        let transactions = item.transactions;

        let spent = 0;
        let got = 0;

        transactions.forEach(transaction => {
            let swaps = transaction.swaps;

            swaps.forEach(swap => {
                let token0_symbol = swap.token0_symbol;
                let token1_symbol = swap.token1_symbol;
                let token0_amount = swap.amount0;
                let token1_amount = swap.amount1;
                let timestamp = swap.unixTimestamp;

                if (token0_symbol == "WETH" && token1_symbol == "DSync") {
                    // WETH -> CLOSEDAI
                    let priceOfToken0AtThatTime = wethMap.get(findClosestKey(timestamp));
                    let moneySpent = token0_amount * priceOfToken0AtThatTime;
                    spent += moneySpent;
                }
                else if (token0_symbol == "DSync" && token1_symbol == "WETH") {
                    // CLOSEDAI -> WETH
                    let priceOfToken1AtThatTime = wethMap.get(findClosestKey(timestamp));
                    let moneyGot = token1_amount * priceOfToken1AtThatTime;
                    got += moneyGot;
                }
            });
        });

        let pnl = got - spent;

        // pnl = Math.abs(pnl);

        let obj = {
            "sender": initial_sender,
            "pnl": pnl
        };
        // log(obj);
        ans.push(obj);
    });

    ans.sort((a, b) => b.pnl - a.pnl);

    fs.writeFileSync("pnl.json", JSON.stringify(ans, null, 2))
    log("done, output in pnl.json")
}


// log(findClosestKey(1710946559))


let wethMap = new Map();
fillMap(wethMap, 'tokenPrices/wethPrice.json');
// pnl(JSON.parse(fs.readFileSync('swapsAddressWiseCopy.json')));
pnl(JSON.parse(fs.readFileSync('finalSwaps.json')));



// log(wethMap)

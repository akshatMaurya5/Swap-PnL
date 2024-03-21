//const { log } = require('console');
const { log } = require('console');
const fs = require('fs');

let input = fs.readFileSync('swapsAddressWiseCopy.json')
input = JSON.parse(input);

//// log(input)

let wethMap = new Map();

function fillMap() {
    let data = fs.readFileSync('tokenPrices/wethPrice.json')
    data = JSON.parse(data);

    data.forEach(item => {
        wethMap.set(item.unixTimestamp, item.price);
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

function pnl() {

    let tokenCnt = new Map();
    let symbol = "CLOSEDAI"

    let ans = []
    input.forEach(item => {

        let txns = item.transactions;

        let sender = item.initial_sender;

        let used = 0;
        let got = 0;

        let soldAmt = 0;

        let amountOfClosedAI = 0;

        txns.forEach(txn => {
            let swaps = txn.swaps;


            swaps.forEach(swap => {

                if (swap.token0_symbol == "WETH") { //case of buying closed ai against weth
                    //log("yes");
                    let timestamp = swap.unixTimestamp;
                    let priceOfWethAtThatPointOfTime = wethMap.get(findClosestKey(timestamp));

                    let token0amt = swap.amount0;
                    let token1amt = swap.amount1;

                    amountOfClosedAI += (swap.amount1);
                    amountOfClosedAI.toFixed(5)


                    //log("swap.amount1: " + swap.amount1);
                    //log("sum = ", amountOfClosedAI);
                    used += (token0amt * priceOfWethAtThatPointOfTime);

                    //// log("amtGotOf_CAI:", token1amt)

                    if (!tokenCnt.has(symbol)) {
                        tokenCnt.set(symbol, token1amt);
                    }
                    else {
                        tokenCnt.set(symbol, tokenCnt.get(symbol) + token1amt);
                    }
                }
                else { // case of selling cai for weth
                    //log("other")
                    let amountWeth = swap.amount1;
                    let amountClosedAISwapped = swap.amount0;

                    let timestamp = swap.unixTimestamp;
                    let priceOfWethAtThatPointOfTime = wethMap.get(findClosestKey(timestamp));

                    soldAmt += swap.amount0;
                    got += (amountWeth * priceOfWethAtThatPointOfTime);

                    // if (amountClosedAISwapped <= amountOfClosedAI) {
                    ////     log("in 1")
                    //     soldAmt += swap.amount0;
                    //     got += (amountWeth * priceOfWethAtThatPointOfTime);
                    // }
                    // else {
                    ////     log("in 2")
                    //     let amountReceived = amountWeth * priceOfWethAtThatPointOfTime;
                    //     let amountReceivedPerToken = amountReceived / amountClosedAISwapped;

                    //     got += (amountOfClosedAI * amountReceivedPerToken);
                    //     amountOfClosedAI = 0;
                    // }



                }
            })
        })





        let inHand = tokenCnt.get(symbol)


        //// log(tokenCnt);

        //// log("inhand=", inHand)
        //// log("sold  =", soldAmt);

        //log("----------------------------------------------------------------")

        //// log("used = ", used);
        //// log("got  = ", got);



        //log("-----------------------------------------------------------------------")
        //log("-----------------------------------------------------------------------")


        //log("-----------------------------------------------------------------------")
        //log("-----------------------------------------------------------------------")
        //// log("account:", sender)
        //// log("PnL=", got - used);
        //log("-----------------------------------------------------------------------")
        //log("-----------------------------------------------------------------------")

        let obj = {
            "address": sender,
            "PnL": got - used
        }
        // log(obj);
        ans.push(obj);

    })

    ans.sort((a, b) => {
        return a.PnL > b.PnL;
    })

    fs.writeFileSync("pnl.json", JSON.stringify(ans, null, 2))
    log("done, output in pnl.json")

}

fillMap();
pnl();
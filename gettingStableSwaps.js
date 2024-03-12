const { log } = require('console');
const fs = require('fs')


function getSingleSwaps() {
    let input = JSON.parse(fs.readFileSync('check.json'))

    let ans = []

    let cnt = 0;
    input.forEach(item => {
        let done = 0;
        let currSwap = [];
        item.swaps.forEach(swapArray => {
            swapArray.forEach(swap => {
                if (swap.length && done == 0) {
                    currSwap = swap;
                    log("processing : ", cnt++);
                    done = 1;
                }
            });
        });

        let obj = {
            transaction_hash: item.transaction_hash,
            initial_sender: item.initial_sender,
            swap: currSwap
        }

        ans.push(obj);
    });

    input.forEach(item => {
        let found = ans.find(entry => entry.transaction_hash === item.transaction_hash);
        if (!found) {
            ans.push({ transaction_hash: item.transaction_hash, swap: [] });
        }
    });

    log("total_inital=", input.length);
    log("total_final=", ans.length);

    fs.writeFileSync('singleSwaps.json', '');
    fs.writeFileSync('singleSwaps.json', JSON.stringify(ans, null, 2));
    log("done, output in singleSwaps.json");

}



// usdt usdc 

let stableCoins = [
    '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
    '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
    '0xc5f0f7b66764F6ec8C8Dff7BA683102295E16409', // FDUSD
    '0x0000000000085d4780B73119b644AE5ecd22b376', //TUSD
    '0x853d955aCEf822Db058eb8505911ED77F175b99e', //FRAX
    //usde not found
    '0x0000000000085d4780b73119b644ae5ecd22b376', // TUSD
    '0xB8c77482e45F1F44dE1745F52C74426C631bDD52', //BNB
    '0x514910771AF9Ca656af840dff83E8264EcF986CA', //LINK
    '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', //WBTC
    '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH
    '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'  // WBTC
]
// function filterTransactions(inputFileName, outputFileName, stableCoins) {

//     getSingleSwaps();

//     let input = JSON.parse(fs.readFileSync(inputFileName));

//     let filteredTransactions = input.filter(transaction => {
//         return transaction.swap.length > 0 && transaction.swap.every(swap => stableCoins.includes(swap.token_address.toLowerCase()));
//     });

//     fs.writeFileSync(outputFileName, '');
//     fs.writeFileSync(outputFileName, JSON.stringify(filteredTransactions, null, 2));
//     log("final step done, output in filteredTransactions.json")
// }

getSingleSwaps();

// filterTransactions('singleSwaps.json', 'filteredTransactions.json', stableCoins);

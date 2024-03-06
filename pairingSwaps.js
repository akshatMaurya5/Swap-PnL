const { log } = require('console');
const fs = require('fs');

let input = JSON.parse(fs.readFileSync('filteredTransactions.json'))


let ans = []

input.forEach(item => {
    // log(item);
    let swap = item.swap;
    // log(swap);

    let newSwap = []

    let i = 0;

    while (i < swap.length - 1) {
        let j = i + 1;

        let sender = swap[i].sender;
        let recipient = swap[j].sender;
        let block_timestamp = swap[i].block_timestamp;

        let token0address = swap[i].token_address;
        let token0symbol = swap[i].symbol;
        let amount0 = swap[i].value;

        let token1address = swap[j].token_address;
        let token1symbol = swap[j].symbol;
        let amount1 = swap[j].value;

        if (token0symbol == token1symbol) {
            i++;
            continue;
        }

        // const unixTimestamp = new Date(block_timestamp).getTime() / 1000;
        const dateObj = new Date(block_timestamp);

        // Format the Date object to match the format of the Date in the first file
        const formattedDate = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')} ${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}:${dateObj.getSeconds().toString().padStart(2, '0')}.${dateObj.getMilliseconds().toString().padStart(3, '0')}`;

        const unixTimestamp = dateObj.getTime() / 1000;


        let obj = {
            sender: sender,
            recipient: recipient,
            block_timestamp: block_timestamp,
            unixTimestamp: unixTimestamp,
            token0_address: token0address,
            token0_symbol: token0symbol,
            amount0: amount0,
            token1_address: token1address,
            token1_symbol: token1symbol,
            amount1: amount1
        }

        newSwap.push(obj);
        i++;
    }
    let finalObj = {
        transaction_hash: item.transaction_hash,
        initial_sender: item.initial_sender,
        swaps: newSwap
    }
    ans.push(finalObj);
})

// log(ans);

fs.writeFileSync('pairedSwaps.json', JSON.stringify(ans, null, 2));
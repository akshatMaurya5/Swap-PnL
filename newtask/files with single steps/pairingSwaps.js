const { log } = require('console');
let fs = require('fs');

let input = fs.readFileSync('singleLogs.json')

input = JSON.parse(input);


let ans = [];

input.forEach(item => {


    let swap = item.swaps;

    let i = 0;

    let newSwaps = [];

    while (i < swap.length - 1) {
        let j = i + 1;

        let sender0 = swap[i].sender;
        let recipient0 = swap[i].recipient;
        let sender1 = swap[j].sender;
        let recipient1 = swap[j].recipient;

        let block_timestamp = swap[i].block_timestamp;

        let token0address = swap[i].token_address;
        let token0symbol = swap[i].symbol;
        let amount0 = swap[i].value;

        let token1address = swap[j].token_address;
        let token1symbol = swap[j].symbol;
        let amount1 = swap[j].value;

        if (token0address == token1address) {
            i++;
            continue;
        }

        const dateObj = new Date(block_timestamp);

        // Format the Date object to match the format of the Date in the first file
        const formattedDate = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')} ${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}:${dateObj.getSeconds().toString().padStart(2, '0')}.${dateObj.getMilliseconds().toString().padStart(3, '0')}`;

        const unixTimestamp = dateObj.getTime() / 1000;


        let obj = {
            sender0: sender0,
            recipient0: recipient0,
            sender1: sender1,
            recipient1: recipient1,
            formattedDate: formattedDate,
            block_timestamp: block_timestamp,
            unixTimestamp: unixTimestamp,
            token0_address: token0address,
            token0_symbol: token0symbol,
            amount0: parseFloat(amount0),
            token1_address: token1address,
            token1_symbol: token1symbol,
            amount1: parseFloat(amount1)
        }

        newSwaps.push(obj);
        i++;
    }

    let finalObj = {
        transaction_hash: item.transaction_hash,
        initial_sender: item.initial_sender,
        swaps: newSwaps
    }
    ans.push(finalObj);
})


fs.writeFileSync('swaps.json', JSON.stringify(ans, null, 2));
log("done, output in swaps.json")
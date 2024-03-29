const { log } = require('console');
const fs = require('fs');

function step1() {
    let data = JSON.parse(fs.readFileSync('output.json'));

    let ans = [];

    data.forEach(item => {
        let copy = item;
        let grouped_logs = item.grouped_logs;

        for (const logNumber in grouped_logs) {
            if (grouped_logs.hasOwnProperty(logNumber)) {
                const logArray = grouped_logs[logNumber];
                let arr = [];
                arr.push(logArray[0]);
                copy.grouped_logs[logNumber] = arr;
            }
        }
        ans.push(copy);
    });

    log("Output processing completed");

    gettingSingle(ans);
}

function gettingSingle(data) {
    let res = [];

    data.forEach(item => {
        let arr = [];
        let grouped_logs = item.grouped_logs;

        for (const logNumber in grouped_logs) {
            arr.push(grouped_logs[logNumber]);
        }

        let singleArray = [];

        arr.forEach(item => {
            item.forEach(subItem => {
                singleArray.push(subItem);
            });
        });

        let obj = {
            "transaction_hash": item.transaction_hash,
            "initial_sender": item.initial_sender,
            "swaps": singleArray
        };
        res.push(obj);
    });

    log("Single processing completed");

    pairingSwaps(res);
}

function pairingSwaps(data) {
    let ans = [];

    data.forEach(item => {
        let swap = item.swaps;
        let newSwaps = [];

        for (let i = 0; i < swap.length - 1; i++) {
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
                continue;
            }

            const dateObj = new Date(block_timestamp);
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
            };
            newSwaps.push(obj);
        }

        let finalObj = {
            transaction_hash: item.transaction_hash,
            initial_sender: item.initial_sender,
            swaps: newSwaps
        };
        ans.push(finalObj);
    });

    log("Swaps processing completed");

    pairingSendersAddressWise(ans);
}

function pairingSendersAddressWise(data) {
    let mpp = new Map();

    data.forEach(item => {
        let initial_sender = item.initial_sender;

        if (!mpp.has(initial_sender)) {
            mpp.set(initial_sender, []);
        }
        mpp.get(initial_sender).push(item);
    });

    let ans = [];

    for (let [key, value] of mpp.entries()) {
        let sender = key;
        let transactions = value;

        transactions.forEach(transaction => {
            transaction.swaps.sort((a, b) => a.unixTimestamp - b.unixTimestamp);
        });

        let obj = {
            "initial_sender": sender,
            "transactions": transactions
        };
        ans.push(obj);
    }



    fs.writeFileSync('finalSwaps.json', JSON.stringify(ans, null, 2));

    log("Final processing completed");
}

step1();

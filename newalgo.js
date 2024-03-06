const { log } = require('console');
const fs = require('fs');

function groupTransactions(inputFilePath, outputFilePath) {
    try {
        const data = fs.readFileSync(inputFilePath, 'utf8');
        const transactions = JSON.parse(data);
        fs.writeFileSync(outputFilePath, '');

        // Group transactions by transaction_hash
        const groupedTransactions = transactions.reduce((groups, transaction) => {
            const hash = transaction.transaction_hash;
            if (!groups[hash]) {
                groups[hash] = {
                    transaction_hash: hash,
                    initial_sender: transaction.initial_sender,
                    logs: []
                };
            }
            // Remove transaction_hash and initial_sender from each log
            const { transaction_hash, initial_sender, ...cleanedTransaction } = transaction;
            groups[hash].logs.push(cleanedTransaction);
            groups[hash].logs.sort((a, b) => parseInt(a.log_index) - parseInt(b.log_index));
            return groups;
        }, {});

        // Write grouped transactions to output file
        fs.writeFileSync(outputFilePath, JSON.stringify(Object.values(groupedTransactions), null, 2));
        console.log('Data has been written to', outputFilePath);
        log("STEP 1/3 DONE")
        groupThem();
    } catch (error) {
        console.error('Error:', error);
    }
}


async function groupThem() {
    let input = await JSON.parse(fs.readFileSync('output.json'));

    let res = [];

    for (let i = 0; i < input.length; i++) {
        const transactionHash = input[i].transaction_hash;
        const initialSender = input[i].initial_sender;
        const logs = input[i].logs;

        let groupedLogs = {};

        for (const log of logs) {
            const logIndex = log.log_index;
            if (!groupedLogs[logIndex]) {
                groupedLogs[logIndex] = [];
            }
            groupedLogs[logIndex].push(log);
        }

        // Remove the 'undefined' key from groupedLogs
        delete groupedLogs.undefined;

        res.push({
            transaction_hash: transactionHash,
            initial_sender: initialSender,
            grouped_logs: groupedLogs
        });
    }
    fs.writeFileSync('output.json', '');
    fs.writeFileSync('output.json', JSON.stringify(res, null, 2));


    log('STEP 2/3 DONE')

}

function initalSenderAsSender(logs, initial_sender) {

    for (let i = 0; i < logs.length; i++) {

        if (logs[i].sender == initial_sender) return 1;
    }
    return 0;
}

function initialSenderAsRecipient(logs, initial_sender) {

    for (let i = 0; i < logs.length; i++) {

        if (logs[i].recipient == initial_sender) return 1;
    }
    return 0;
}

function frontValidotor(logs, initial_sender) {

    let len = logs.length;
    let toFind = initial_sender;

    let st = new Set();

    logs.forEach(item => {
        st.add(item);
    })

    let iterations = len + 5;

    while (st.size) {
        if (!iterations) break;

        st.forEach(item => {
            if (item.sender == toFind) {
                toFind = item.recipient;
                st.delete(item);
            }
        })
        if (!st.size) break;
        iterations--;
    }

    return st.size == 0;
}

function backwardValidator(logs, initial_sender) {
    let len = logs.length;
    let toFind = initial_sender;

    let st = new Set();

    logs.forEach(item => {
        st.add(item);
    })

    let iterations = len + 5;

    while (st.size) {
        if (!iterations) break;

        st.forEach(item => {
            if (item.recipient == toFind) {
                toFind = item.sender;
                st.delete(item);
            }
        })
        if (!st.size) break;
        iterations--;
    }

    return st.size == 0;
}


function getOrderFromFront(logs, initial_sender) {
    let order = [];

    let st = new Set();
    let toFind = initial_sender;

    logs.forEach(item => {
        st.add(item);
    })

    while (st.size > 0) {

        st.forEach(item => {
            if (item.sender == toFind) {
                toFind = item.recipient;
                order.push(item);
                st.delete(item);
            }
        })

    }
    return order;

}

function getOrderFromBack(logs, initial_sender) {

    // log("here");
    let order = [];

    // order.push(initial_sender);

    let st = new Set();
    let toFind = initial_sender;

    logs.forEach(item => {
        st.add(item);
    })

    while (st.size > 0) {

        st.forEach(item => {
            if (item.recipient == toFind) {
                toFind = item.sender;
                order.push(item);
                st.delete(item);
            }
        })
        if (!st.size) break;
    }
    order.reverse();
    return order;
}


function doWork() {

    let input = JSON.parse(fs.readFileSync('output.json'));
    let ans = []
    // log(input)

    input.forEach(entry => {
        const transactionHash = entry.transaction_hash;
        const initialSender = entry.initial_sender;
        // log(transactionHash, initialSender);


        const groupedLogs = entry.grouped_logs;

        // log(groupedLogs)
        let Result = []

        for (logIdx in groupedLogs) {

            let logs = groupedLogs[logIdx];

            let startFromSender = initalSenderAsSender(logs, initialSender);
            let startFromRecipient = initialSenderAsRecipient(logs, initialSender);
            log(`startFromSender: ${startFromSender} startFromRecipient: ${startFromRecipient}`);

            let done = 0;

            if (startFromSender) {
                let checkValidFromFront = frontValidotor(logs, initialSender);
                let checkValidFromBack = backwardValidator(logs, initialSender);

                log("in sender");

                log(`checkValidFromFront: ${checkValidFromFront} checkValidFromBack: ${checkValidFromBack}`);

                let ans = []
                if (checkValidFromFront) {
                    // log("1");
                    ans = getOrderFromFront(logs, initialSender);
                }
                else if (checkValidFromBack) {
                    // log("2");
                    ans = getOrderFromBack(logs, initialSender);
                }
                // log(transactionHash, ans);
                if (ans.size) done = 1;
                Result.push(ans);
                // if (ans.size) Result.push(ans);

            }
            else if (startFromRecipient) {
                let checkValidFromFront = frontValidotor(logs, initialSender);
                let checkValidFromBack = backwardValidator(logs, initialSender);

                log("in recipient")
                log(`checkValidFromFront: ${checkValidFromFront} checkValidFromBack: ${checkValidFromBack}`);

                // log("hello");

                let ans = []
                if (checkValidFromFront) {
                    // log("1");
                    ans = getOrderFromFront(logs, initialSender);
                }
                else if (checkValidFromBack) {
                    // log("2");
                    ans = getOrderFromBack(logs, initialSender);
                }
                // log(transactionHash, ans);
                if (ans.size) done = 1;
                // log("came here", done)
                Result.push(ans);

                // if (ans.size) Result.push(ans);
            }
            if (done == 0) {
                // log("now here in final block");

                if (logs.length == 3) {

                    // log(logs);
                    let token = new Set();

                    let duplicate = "l";

                    let mymap = new Map();

                    logs.forEach(item => {
                        // log("this", item);
                        if (token.has(item.symbol)) {
                            duplicate = item.symbol;
                            // log("this is dup:", item.symbol);

                        }
                        else {
                            mymap.set(item.symbol, item);
                            token.add(item.symbol);
                        }
                    })
                    // log("value of duplicate:", duplicate);

                    let order = []
                    // log(mymap);

                    for (let [key, value] of mymap) {
                        order.push(value);
                    }

                    // log(order);
                    if (order[0].symbol != duplicate) {
                        // swap(order[0], order[1]);
                        let zero = order[1];
                        let one = order[0];
                        order[0] = zero;
                        order[1] = one;
                    }


                    Result.push(order);
                    // log("data=", order);

                }
            }
        }

        // log(Result);
        let obj = {
            transaction_hash: transactionHash,
            initial_sender: initialSender,
            swaps: []
        }
        obj.swaps.push(Result)
        if (obj.swaps.length == 0) {
            obj.status = "invalid swap"
        }
        // log(obj);
        if (obj.swaps.length == 0) {
            obj.push({ message: "invalid swap" })
        }
        ans.push(obj);

    })

    fs.writeFileSync('check.json', '');
    fs.writeFileSync('check.json', JSON.stringify(ans, null, 2));
    log("output in check.json");

}

// groupTransactions('output.json', 'output.json');
// 
doWork();

// log("valid=", valid, " invalid=", invalid);


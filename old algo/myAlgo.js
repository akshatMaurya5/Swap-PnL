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



function forward(logArray, initial_sender) {

    // log("here", initial_sender);
    for (let i = 0; i < logArray.length; i++) {
        // log(logArray[i].sender);

        if (logArray[i].sender === initial_sender) {
            return 1;
        }
    }
    // return false;
    return 0;

    // log("NO");
}

function backward(logArray, initial_sender) {
    for (let i = 0; i < logArray.length; i++) {
        // log(logArray[i].sender);

        if (logArray[i].recipient === initial_sender) {
            return 1;
        }
    }

    return 0;
}


function forwardValidator(logs, initial_sender) {

    let len = logs.length;

    let toFind = initial_sender;

    let st = new Set();

    logs.forEach(item => {
        st.add(item);
    })

    let iterations = len + 2;

    while (st.size) {

        if (!iterations) break;

        st.forEach(item => {
            if (item.sender === toFind) {
                toFind = item.recipient;
                st.delete(item);
            }
            // if (!st.size) break;
        })
        if (!st.size) break;
        iterations--;
    }


    return st.size == 0;
}

function backwardValidator(logs, initial_sender) {
    let toFind = initial_sender;

    let st = new Set();
    logs.forEach(item => {
        st.add(item);
    })

    let iterations = st.size + 5;

    while (st.size) {

        if (!iterations) break;

        st.forEach(item => {
            if (item.recipient === toFind) {
                toFind = item.sender;
                st.delete(item);
            }
            // if (!st.size) break;
        })
        if (!st.size) break;
        iterations--;
    }
    return st.size == 0;
}






let valid = 0, invalid = 0;



function doWork() {


    let input = JSON.parse(fs.readFileSync('output1.json'));
    let ans = []

    input.forEach(entry => {
        const transactionHash = entry.transaction_hash;
        const initialSender = entry.initial_sender;
        log(transactionHash, initialSender);

        // if (transactionHash == "0x48d475ff89dbd4cd3d99a377ae801aff62f91672296c5d9b644f1c88adf9718f") 
        // if (transactionHash === "0x48d475ff89dbd4cd3d99a377ae801aff62f91672296c5d9b644f1c88adf9718f") {
        //     // continue;
        // }

        const groupedLogs = entry.grouped_logs;

        let Result = []

        // log(groupedLogs);
        for (logIdx in groupedLogs) {


            let logs = groupedLogs[logIdx];
            // log(logIdx, logs);
            // log(logIdx, "and", );

            //to check cycle from back front and back
            let fwdValid = forwardValidator(logs, initialSender);
            let bkwdValid = backwardValidator(logs, initialSender);

            if (fwdValid || bkwdValid) {
                valid++;
                log("SWAP IS VALID", transactionHash);
            }
            else {
                invalid++;
                log("SWAP IS NOT VALID", transactionHash);
            }


            if (!fwdValid || !bkwdValid) {
                continue;
            }

            //to check initial_sender present as sender in any log
            let fwd = forward(groupedLogs[logIdx], initialSender);

            if (fwd) {

                let indexOfAddress = new Map();
                let index = 0;
                let set = new Set();

                logs.forEach(item => {
                    set.add(item.sender);
                    set.add(item.recipient);
                })

                // log("size", set.size);

                logs.forEach(item => {
                    if (!indexOfAddress.has(item.sender)) {
                        indexOfAddress.set(item.sender, index++);
                    }
                    if (!indexOfAddress.has(item.recipient)) {
                        indexOfAddress.set(item.recipient, index++);
                    }
                })

                // log(indexOfAddress);

                let adj = new Map();

                let dataForEachIndex = new Map();
                let idx = 0;
                logs.forEach(item => {
                    adj.set(indexOfAddress.get(item.sender), indexOfAddress.get(item.recipient));
                    dataForEachIndex.set(idx, item);
                    idx++;
                })
                // log("-------------------------------------------")
                // log(dataForEachIndex);
                // log("-------------------------------------------")


                // log(adj);

                // log(initialSender, indexOfAddress.get(initialSender));

                let start = indexOfAddress.get(initialSender);

                // log("start=", start);

                let order = []

                order.push(start);

                let node = start;
                while (adj.get(node) != start) {
                    node = adj.get(node);
                    order.push(node);
                }
                // log(order);

                let ans = []

                order.forEach(index => {
                    ans.push(dataForEachIndex.get(index));
                })

                Result.push(ans);

                // log(ans);
                // fs.writeFileSync('check.json', '')
                // fs.writeFileSync('check.json', JSON.stringify(ans, null, 2));



            }

            //to check initial_sender present as recipient in any log
            let bkwd = backward(groupedLogs[logIdx], initialSender);

            if (!fwd && bkwd) {

                // log("yes");

                let indexOfAddress = new Map();
                let index = 0;
                let set = new Set();

                logs.forEach(item => {
                    set.add(item.sender);
                    set.add(item.recipient);
                })

                // log("size", set.size);

                logs.forEach(item => {
                    if (!indexOfAddress.has(item.sender)) {
                        indexOfAddress.set(item.sender, index++);
                    }
                    if (!indexOfAddress.has(item.recipient)) {
                        indexOfAddress.set(item.recipient, index++);
                    }
                })

                // log(indexOfAddress);

                let adj = new Map();
                let dataForEachIndex = new Map();
                let idx = 0;

                logs.forEach(item => {
                    adj.set(indexOfAddress.get(item.recipient), indexOfAddress.get(item.sender));
                    dataForEachIndex.set(idx, item);
                    idx++;
                })


                // log(adj);
                // log("-------------------------------------------")
                // log(dataForEachIndex);
                // log("-------------------------------------------")


                // log(adj);


                let start = indexOfAddress.get(initialSender);
                // log("start: ", start);

                let order = []

                let tempSet = new Set();

                logs.forEach(item => {
                    tempSet.add(item);
                })

                // log(tempSet);

                let toFind = initialSender;
                while (tempSet.size) {
                    tempSet.forEach(item => {
                        if (item.recipient === toFind) {
                            order.push(item);
                            toFind = item.sender;
                            tempSet.delete(item);
                        }
                    });
                }

                // log(order);

                order.reverse();

                // log("****************************************************************")
                // log(order);
                // log("****************************************************************")

                // fs.writeFileSync('check.json', '')
                // fs.writeFileSync('check.json', JSON.stringify(order, null, 2));
                Result.push(order);

            }
            if (!fwd && !bkwd) {
                log("CANNOT PROCESS IT");
            }

        }

        fs.writeFileSync('check.json', '')
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
        // fs.writeFileSync('check.json', JSON.stringify(Result, null, 2));
    })

    fs.writeFileSync('check.json', '');
    // ans.sort(a.swaps.length - b.swaps.length);
    fs.writeFileSync('check.json', JSON.stringify(ans, null, 2));
    log('STEP 3/3 DONE')
    console.log("Output written to check.json");


}


// groupTransactions('output.json', 'output.json');

doWork();

log("valid=", valid, " invalid=", invalid);


// module.exports = {
//     groupThem,
//     groupTransactions,
//     doWork
// };




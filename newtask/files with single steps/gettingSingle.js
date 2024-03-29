//get single entry

const { log } = require('console')
const fs = require('fs')

let input = fs.readFileSync('newOutput.json')

input = JSON.parse(input)
let res = []
input.forEach(item => {
    let arr = []

    let grouped_logs = item.grouped_logs

    // log(item.grouped_logs);

    for (const logNumber in grouped_logs) {
        // log(logNumber, grouped_logs[logNumber])
        arr.push(grouped_logs[logNumber])
    }

    // log("arr", arr);

    let singleArray = [];

    arr.forEach(item => {
        // singleArray.push(item)

        item.forEach(subItem => {
            singleArray.push(subItem)
        })
    })

    // log(singleArray)

    let obj = {
        "transaction_hash": item.transaction_hash,
        "initial_sender": item.initial_sender,
        "swaps": singleArray
    }
    res.push(obj)

})

// log(res);

fs.writeFileSync('singleLogs.json', JSON.stringify(res, null, 2))

log("done, output in singleLogs.json")
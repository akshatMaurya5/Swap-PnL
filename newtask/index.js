//first file to be processed


const { log } = require('console');
const fs = require('fs');

let data = JSON.parse(fs.readFileSync('output.json'))

let ans = []
data.forEach(item => {

    let copy = item;
    let grouped_logs = item.grouped_logs

    for (const logNumber in grouped_logs) {
        if (data.hasOwnProperty(logNumber)) {
            // Get the array for the current log number
            const logArray = grouped_logs[logNumber];

            let arr = []
            arr.push(logArray[0]);

            copy.grouped_logs[logNumber] = arr;

            // log(arr);
        }


    }
    ans.push(copy);
})

fs.writeFileSync('newOutput.json', JSON.stringify(ans, null, 4));
log("Output in newOutput.json")









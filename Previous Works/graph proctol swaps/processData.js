const fs = require('fs');

const rawData = fs.readFileSync('output.json')
const jsonData = JSON.parse(rawData);

const allTransactions = jsonData.reduce((acc, current) => {
    // Check if the current element has a "swaps" property and it is an array
    if (current && current.swaps && Array.isArray(current.swaps)) {
        // Concatenate the current swaps array to the accumulator
        acc = acc.concat(current.swaps);
    }
    return acc;
}, []);


fs.writeFileSync('finalOutput.json', '');

for (let i = 0; i < allTransactions.length; i++) {
    let timestamp = allTransactions[i].timestamp;
    const date = new Date(timestamp * 1000);
    const formattedDate = date.toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' UTC';
    allTransactions[i].timestamp = formattedDate;
}
fs.writeFileSync('finalOutput.json', '');

fs.writeFileSync('finalOutput.json', JSON.stringify(allTransactions, null, 2));

console.log("done");
const fs = require('fs');

let input = JSON.parse(fs.readFileSync('swaps.json'));

input.forEach(item => {
    item.swaps.sort((a, b) => a.unixTimestamp - b.unixTimestamp)
})


fs.writeFileSync('swaps.json', JSON.stringify(input, null, 2));

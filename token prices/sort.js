const { log } = require('console');
const fs = require('fs');

// let input = fs.writeFileSync('swaps.json')

let input = JSON.parse(fs.readFileSync('swaps.json'));

// log(input)
let ans = [];

input.forEach(item => {

    // log(item);
    let swaps = item.swaps;
    // log(swaps);
    swaps.forEach(swap => {
        ans.push(swap);
    })
    // ans.push(swaps);
})

// log(ans);
// ans.sort()
ans.sort((a, b) => a.unixTimestamp - b.unixTimestamp);

fs.writeFileSync('sorted.json', JSON.stringify(ans));
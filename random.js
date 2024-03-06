const { log } = require('console');
const fs = require('fs')

let input = fs.readFileSync('pairedSwaps.json')
input = JSON.parse(input)

let st = new Set();

input.forEach(item => {
    let swaps = item.swaps;

    swaps.forEach(swap => {
        st.add(swap.token0_symbol);
        st.add(swap.token1_symbol);
    })
})

log(st);
const { log } = require('console');
const fs = require('fs');

let rawdata = fs.readFileSync('uniswapV3.json');
let data = JSON.parse(rawdata);

let st = new Set();

for (let i = 0; i < data.length; i++) {
    st.add(data[i].transaction.id);
}

log(st.size);
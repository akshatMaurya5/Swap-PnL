const fs = require('fs');

const rawdata = fs.readFileSync('swaps_uniswapV3_april.json');
const data = JSON.parse(rawdata)

out = []

for (let i = 0; i < data.length; i++) {
    out.push(data[i])
}
fs.writeFileSync('output.json', '');
fs.writeFileSync('output.json', JSON.stringify(out, null, 2));
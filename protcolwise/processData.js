const { log } = require('console');
const fs = require('fs')

let rawdata = fs.readFileSync('dydx.json');
let data = JSON.parse(rawdata)

let out = []

for (let i = 0; i < data.length; i++) {
    out.push(data[i])
}

fs.writeFileSync('dydx.json', "");
fs.writeFileSync('dydx.json', JSON.stringify(out, null, 2));

log("processing finished");
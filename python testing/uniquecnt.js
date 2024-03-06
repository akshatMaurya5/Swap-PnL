const { log } = require('console');
const fs = require('fs')
const rawdata = fs.readFileSync('dataCovered.json');

const data = JSON.parse(rawdata)

const st = new Set();

for (let i = 0; i < data.length; i++) {

    // log(data[i].transaction.id)
    st.add(data[i].transaction_hash);
}

log(st.size)
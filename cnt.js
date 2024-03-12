const { log } = require('console');
const fs = require('fs');

let data = JSON.parse(fs.readFileSync('input.json'));

log(data.length)
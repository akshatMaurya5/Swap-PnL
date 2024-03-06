const { log } = require('console');
const fs = require('fs');

let input = fs.readFileSync('pairedSwaps.json');
input = JSON.parse(input);

log(input);



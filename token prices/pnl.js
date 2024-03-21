const { log } = require('console')
const fs = require('fs')

let input = JSON.parse(fs.readFileSync('swaps.json'))

log(input);
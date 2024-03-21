const { log } = require('console');
const fs = require('fs');

let data = JSON.parse(fs.readFileSync('input.json'));

log(data.length)


// let data = JSON.parse(fs.readFileSync('input.json'))
// // log(data);

// let ans = []

// data.forEach(item => {
//     if (item.initial_sender == "0xae2fc483527b8ef99eb5d9b44875f005ba1fae13") {
//         ans.push(item);
//     }
// })

// fs.writeFileSync('input.json', JSON.stringify(ans, null, 2));

log("Done");

// log(data.length)
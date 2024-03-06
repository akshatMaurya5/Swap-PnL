const { log } = require("console");
const fs = require("fs");

let data = JSON.parse(fs.readFileSync('uniswapV3.json'));

let address = '0xac20892bdd036e3af9c3f30a433f53a13d485b2797155770c96723dbbc6c92e0'


let ans = new Set();


for (let i = 0; i < data.length; i++) {
    if (data[i].transaction.id == address) {
        // if (ans1 == -1) {
        //     ans1 = data[i];
        //     continue;
        // }
        // if (ans2 == -1) {
        //     ans2 = data[i];
        //     continue;

        // }
        // if (ans3 == -1) {
        //     ans3 = data[i];
        //     continue;
        // }
        ans.add(data[i])
    }
}




log(ans)
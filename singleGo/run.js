const { mergeData } = require("./processTransactions")
const { runAll } = require("./pnl");
const { processSwaps } = require("./clean")

async function work() {
    await mergeData();
    runAll();
}

work();

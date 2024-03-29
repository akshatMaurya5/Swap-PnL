const { mergeData } = require("./processTransactions")
const { runAll } = require("./pnl");

async function work() {
    await mergeData();
    runAll();
}

work();

const { Web3 } = require('web3');

const infuraApiKey = 'f98f08baefa343fd89e1c823efc5ef40';
const infuraUrl = `https://mainnet.infura.io/v3/${infuraApiKey}`;

const web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));


async function getLogs(transactionHash) {
    try {
        const transactionReceipt = await web3.eth.getTransactionReceipt(transactionHash);
        const logs = transactionReceipt.logs;

        console.log('Logs for Transaction:');
        logs.forEach((log, index) => {
            console.log(`Log ${index + 1}:`);
            console.log(`Address: ${log.address}`);
            console.log(`Data: ${log.data}`);
            console.log(`Topics: ${log.topics}`);
            console.log('--------------------------------');
        });
    } catch (error) {
        console.error('Error fetching logs:', error);
    }
}

async function getLatestTransactions() {
    try {
        const blockNumber = await web3.eth.getBlockNumber();

        const latestBlock = await web3.eth.getBlock(blockNumber, true);
        const latestTransactions = latestBlock.transactions.slice(0, 1);

        console.log('Latest 5 Transactions:');
        for (const [index, tx] of latestTransactions.entries()) {
            console.log(`Transaction ${index + 1}:`);
            console.log(`Hash: ${tx.hash}`);
            console.log(`From: ${tx.from}`);
            console.log(`To: ${tx.to}`);
            console.log(`Value: ${web3.utils.fromWei(tx.value, 'ether')} ETH`);

            await getLogs(tx.hash);

            console.log('--------------------------------');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

getLatestTransactions();




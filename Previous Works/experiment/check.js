const { Web3 } = require('web3');

const infuraApiKey = 'f98f08baefa343fd89e1c823efc5ef40';
const infuraUrl = `https://mainnet.infura.io/v3/${infuraApiKey}`;

const web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));

async function getLogs(transactionHash) {

    const transactionReceipt = await web3.eth.getTransactionReceipt(transactionHash);
    const logs = transactionReceipt.logs;

    console.log(logs);
}


let address = '0xf02d8e4194b55d723a170bbf2b34e5599fef6059d28f9c99ad021221e52beb54'

getLogs(address)
const fs = require('fs');
const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");
const { log } = require('console');

require('dotenv').config();

const apiKey = process.env.API_KEY;

const chunkSize = 145;

let inputFile = 'input.json'



const getTokenData = async () => {
    await Moralis.start({
        apiKey,
    });

    const rawData = fs.readFileSync(inputFile);
    const data = JSON.parse(rawData);

    const tokenAddresses = data.map(entry => entry.token_address);

    const chain = EvmChain.ETHEREUM;

    let outputData = [];

    for (let i = 0; i < tokenAddresses.length; i += chunkSize) {
        const batchAddresses = tokenAddresses.slice(i, i + chunkSize);

        const response = await Moralis.EvmApi.token.getTokenMetadata({
            addresses: batchAddresses,
            chain,
        });

        outputData = outputData.concat(response);

        console.log(`Processed batch ${i / chunkSize + 1}/${Math.ceil(tokenAddresses.length / chunkSize)}`);
    }

    // Write the output to tempOutput.json
    fs.writeFileSync('output.json', JSON.stringify(outputData, null, 2));

    console.log("STEP 1/3 DONE.");
};

const getSingleData = async () => {
    // Wait for getTokenData to complete before reading the tempOutput.json
    await getTokenData();

    const rawData = fs.readFileSync('output.json');
    const dataArray = JSON.parse(rawData);

    clearFile();

    const oDArray = [].concat(...dataArray);

    const jsonData = JSON.stringify(oDArray, null, 2);

    // Write the JSON data to a file
    fs.writeFileSync('output.json', jsonData, 'utf-8');

    console.log('STEP 2/3 DONE');
};

function clearFile() {
    fs.writeFileSync('output.json', '');
}

async function mergeData() {
    await getSingleData();

    const outputData = JSON.parse(fs.readFileSync('output.json', 'utf-8'));
    const inputData = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));
    // const inputData = JSON.parse(fs.readFileSync('inputdata.json', 'utf-8'));
    clearFile();
    const addressMap = new Map();

    for (const obj of outputData) {
        addressMap.set(obj.address, obj);
    }
    // log(addressMap);
    // return;

    alldata = []

    for (const inputTransaction of inputData) {

        const addressFromInput = inputTransaction.token_address;
        const txnHash = inputTransaction.transaction_hash;
        const dataFromMap = addressMap.get(addressFromInput);
        const currValue = inputTransaction.value;
        const decimals = dataFromMap.decimals;


        const newValue = Number(currValue) / Math.pow(10, Number(decimals));
        // log(dataFromMap.decimals)
        const newData = {
            transaction_hash: inputTransaction.transaction_hash,
            initial_sender: inputTransaction.initial_sender,
            sender: inputTransaction.sender,
            recipient: inputTransaction.recipient,
            token_address: inputTransaction.token_address,
            block_timestamp: inputTransaction.block_timestamp,
            symbol: dataFromMap.symbol,
            decimals: decimals,
            //    value:inputTransaction.value,
            value: newValue.toString(),
            log_index: inputTransaction.log_index
        }

        alldata.push(newData);
    }

    const jsonData = JSON.stringify(alldata, null, 2);
    fs.writeFileSync("output.json", jsonData, 'utf-8');


    console.log("STEP 3/3 DONE")

}


// clearFile();
mergeData();


// module.exports = mergeData();


const { ethers, JsonRpcProvider } = require('ethers');

const infuraApiKey = 'f98f08baefa343fd89e1c823efc5ef40';
const infuraUrl = `https://mainnet.infura.io/v3/${infuraApiKey}`;



const getEventSignature = (eventName, abi) => {
    const eventAbi = abi.find((entry) => entry.name === eventName);
    const types = eventAbi.inputs.map((input) => input.type);
    return `${eventName}(${types.join(',')})`;
}

const main = async () => {
    // const provider = new ethers.providers.JsonRpcProvider(infuraUrl)
    const provider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/f98f08baefa343fd89e1c823efc5ef40')
    const USDC_ETH_V3 = '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640';

    const contractAbi = [
        {
            "anonymous": false,
            "inputs": [
                { "indexed": true, "internalType": "address", "name": "sender", "type": "address" },
                { "indexed": true, "internalType": "address", "name": "recipient", "type": "address" },
                { "indexed": false, "internalType": "int256", "name": "amount0", "type": "int256" },
                { "indexed": false, "internalType": "int256", "name": "amount1", "type": "int256" },
                { "indexed": false, "internalType": "uint160", "name": "sqrtPriceX96", "type": "uint160" },
                { "indexed": false, "internalType": "uint128", "name": "liquidity", "type": "uint128" },
                { "indexed": false, "internalType": "int24", "name": "tick", "type": "int24" }
            ],
            "name": "Swap",
            "type": "event"
        },
    ]

    const eventSignature = getEventSignature('Swap', contractAbi)
    console.log('--------event sig-----')
    console.log(eventSignature)
    console.log('-------------')

    const filter = {
        address: USDC_ETH_V3,
        topics: [
            ethers.utils.id(eventSignature),

        ],
        fromBlock: 17957558,
        toBlock: 17957658,
    };

    const result = await provider.getLogs(filter)

    const contractInterface = new ethers.utils.Interface(contractAbi);

    result.forEach((log, idx) => {
        const decodedLog = contractInterface.decodeEventLog('Swap', log.data, log.topics);

        console.log('--------------', idx)
        console.log('sender:      ', decodedLog.sender)
        console.log('recipient:   ', decodedLog.recipient)
        console.log('amount0:     ', decodedLog.amount0.toString())
        console.log('amount1:     ', decodedLog.amount1.toString())
        console.log('sqrtPriceX96:', decodedLog.sqrtPriceX96.toString())
        console.log('liquidity:   ', decodedLog.liquidity.toString())
        console.log('tick:        ', decodedLog.tick)
        console.log('--------------')
    });
}

/*
    node scripts/04_getLogsAndDecode.js
*/

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
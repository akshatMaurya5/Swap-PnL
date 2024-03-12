const axios = require('axios');
const { log } = require('console');
const fs = require('fs');

const URL = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3';

const query = `
  query swapData($first: Int, $skip: Int, $timestamp_gte: BigInt, $timestamp_lte: BigInt) {
    swaps(
      orderBy: timestamp
      orderDirection: asc
      where: {
        timestamp_gte: $timestamp_gte,
        timestamp_lte: $timestamp_lte
      }
      first: $first
      skip: $skip
    ) {
      transaction {
        id
        gasPrice
        gasUsed
      }
      origin
      token0 {
        id
        symbol
        decimals
      }
      token1 {
        id
        symbol
        decimals
      }
      amount0
      amount1
      amountUSD
      timestamp
      logIndex
    }
  }
`;

const january22Timestamp = Math.round(new Date('2024-01-28').getTime() / 1000);
const batchSize = 1000;
const totalToFetch = 30000;
let fetchedCount = 0;

console.log(january22Timestamp);
let allSwaps = [];

async function fetchTransactions() {
  while (fetchedCount < totalToFetch) {
    const variables = {
      first: batchSize,
      skip: fetchedCount,
      timestamp_gte: january22Timestamp,
      timestamp_lte: january22Timestamp + 86400,
    };

    try {
      const result = await axios.post(URL, {
        query,
        variables,
      });

      const data = result.data.data;

      // Append the new batch of swaps to the existing array
      // res=data.swaps;
      allSwaps = allSwaps.concat(data);

      fetchedCount += batchSize;
    } catch (error) {
      console.error('Error:', error);
      break;
    }
  }

  // Write the final data to output.json
  fs.writeFileSync('output.json', '');

  fs.writeFileSync('output.json', JSON.stringify(allSwaps, null, 2));
  console.log(`Fetched and written ${fetchedCount} transactions to output.json`);
}

// fetchTransactions();
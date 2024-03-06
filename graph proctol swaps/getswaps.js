// const axios = require('axios');
// const { log } = require('console');
// const fs = require('fs');

// const URL = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3';

// const query = `
//   query swapData($first: Int, $skip: Int, $timestamp_gte: BigInt, $timestamp_lte: BigInt) {
//     swaps(
//       orderBy: timestamp
//       orderDirection: asc
//       where: {
//         timestamp_gte: $timestamp_gte,
//         timestamp_lte: $timestamp_lte
//       }
//       first: $first
//       skip: $skip
//     ) {
//       transaction {
//         id
//         gasPrice
//         gasUsed
//       }
//       origin
//       token0 {
//         id
//         symbol
//         decimals
//       }
//       token1 {
//         id
//         symbol
//         decimals
//       }
//       amount0
//       amount1
//       amountUSD
//       timestamp
//       logIndex
//     }
//   }
// `;

// const january22Timestamp = Math.round(new Date('2024-01-22').getTime() / 1000);
// const batchSize = 1000;
// const totalToFetch = 30000;
// let fetchedCount = 0;
// let allSwaps = [];

// async function fetchTransactions() {
//   while (fetchedCount < totalToFetch) {
//     const variables = {
//       first: batchSize,
//       skip: fetchedCount,
//       timestamp_gte: january22Timestamp,
//       timestamp_lte: january22Timestamp + 86400,
//     };

//     try {
//       const result = await axios.post(URL, {
//         query,
//         variables,
//       });

//       const data = result.data.data;

//       // Append the new batch of swaps to the existing array
//       // res=data.swaps;
//       allSwaps = allSwaps.concat(data);

//       fetchedCount += batchSize;
//     } catch (error) {
//       console.error('Error:', error);
//       break;
//     }
//   }

//   // Write the final data to output.json
//   fs.writeFileSync('output.json', '');

//   fs.writeFileSync('output.json', JSON.stringify(allSwaps, null, 2));
//   console.log(`Fetched and written ${fetchedCount} transactions to output.json`);
// }

// fetchTransactions();




// const axios = require('axios');
// const fs = require('fs');

// const URL = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3';

// const query = `
//   query swapData($first: Int, $skip: Int, $timestamp_gte: BigInt, $timestamp_lte: BigInt) {
//     swaps(
//       orderBy: timestamp
//       orderDirection: asc
//       where: {
//         timestamp_gte: $timestamp_gte,
//         timestamp_lte: $timestamp_lte
//       }
//       first: $first
//       skip: $skip
//     ) {
//       transaction {
//         id
//         gasPrice
//         gasUsed
//       }
//       origin
//       token0 {
//         id
//         symbol
//         decimals
//       }
//       token1 {
//         id
//         symbol
//         decimals
//       }
//       amount0
//       amount1
//       amountUSD
//       timestamp
//       logIndex
//     }
//   }
// `;

// const january28Timestamp = Math.round(new Date('2024-01-28').getTime() / 1000);
// const batchSize = 1000;
// const totalToFetch = 30000;
// let fetchedCount = 0;
// let batchNumber = 0;
// let allSwaps = [];

// async function fetchTransactions() {
//   while (fetchedCount < totalToFetch) {
//     const remainingToFetch = totalToFetch - fetchedCount;
//     const currentBatchSize = Math.min(remainingToFetch, batchSize);

//     const variables = {
//       first: currentBatchSize,
//       skip: fetchedCount,
//       timestamp_gte: january28Timestamp,
//       timestamp_lte: january28Timestamp + 86400,
//     };

//     try {
//       const result = await axios.post(URL, {
//         query,
//         variables,
//       });

//       const data = result.data;

//       // Check if data is present and has the expected structure
//       if (data && data.data && data.data.swaps) {
//         // Append the new batch of swaps to the existing array
//         allSwaps = allSwaps.concat(data.data.swaps);

//         fetchedCount += currentBatchSize;
//         batchNumber++;

//         console.log(`Processed batch ${batchNumber}, Total fetched: ${fetchedCount}`);
//       } else {
//         console.error('Unexpected response structure:', data);
//         break;
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       break;
//     }
//   }

//   // Write the final data to output.json
//   fs.writeFileSync('output.json', JSON.stringify(allSwaps, null, 2));
//   console.log(`Fetched and written ${fetchedCount} transactions to output.json`);
// }

// fs.writeFileSync('output.json', '');
// fetchTransactions();















///from here


const axios = require('axios');
const fs = require('fs');

if (process.env.NODE_ENV !== 'production') {
  require('longjohn');
}

const url = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3';

const query = `
query swapData($first: Int, $skip: Int, $lastID: BigInt) {
  swaps(
    orderBy: timestamp
    orderDirection: asc
    where: {
      timestamp_gte: $lastID,
      timestamp_lte: 1706409999
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


const january28Timestamp = Math.round(new Date('2024-01-28').getTime() / 1000);
const january29Timestamp = Math.round(new Date('2024-01-29').getTime() / 1000);

const first = 1000;
let skip = 0;
let lastId = 1706400000;  // January 28, 2024
let lastTimestamp = null;
let timestamplte = 1706409999;
// const timestampLte = january29Timestamp;  // January 29, 2024
// const timestampLte = 1706400000 + 10000;

const allSwaps = [];
cnt = 0;
async function fetchSwaps(first, skip, lastId) {
  const variables = {
    first,
    skip,
    lastID: lastId,
  };

  const payload = {
    query,
    variables,
  };

  try {
    const response = await axios.post(url, payload);

    if (response.status !== 200) {
      throw new Error(`API call failed with status code ${response.status}`);
    }

    const data = response.data;

    if (!data || !data.data || !data.data.swaps) {
      throw new Error("API response does not contain 'data' key");
    }

    return data.data.swaps;
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }


}

async function main() {
  try {
    while (true) {
      let currentSkip = 0;

      for (let i = 0; i < 6; i++) {
        const swaps = await fetchSwaps(first, currentSkip, lastId);
        allSwaps.push(...swaps);

        currentSkip += 1000;
        cnt += 1000;
        if (cnt > 2000) {
          break;
        }
      }

      if (allSwaps.length === 0) {
        console.log("No results found.");
        return;
      }

      const lastBatch = allSwaps[allSwaps.length - 1];

      if (lastBatch) {
        lastTimestamp = lastBatch.timestamp;

        if (lastTimestamp >= timestampLte) {
          break;
        }

        lastId = lastTimestamp;
      } else {
        console.log("Last API call didn't return any swaps.");
        break;
      }
    }

    fs.writeFileSync('output.json', JSON.stringify(allSwaps, null, 2));
    console.log("All swap data has been retrieved and saved in output.json!");
  } catch (error) {
    console.error(error.message);
  }
}

fs.writeFileSync('output.json', '');
main();

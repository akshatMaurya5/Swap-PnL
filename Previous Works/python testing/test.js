const fs = require('fs');


function processedTransactions(transactions) {
  const pairs = {}; // Dictionary to store paired transactions
  const transactionLookup = {}; // Dictionary to group transactions by transaction_hash

  // Loops through each transaction and group by transaction_hash
  transactions.forEach(transaction => {
    const transactionHash = transaction.transaction_hash;
    if (!transactionLookup[transactionHash]) {
      transactionLookup[transactionHash] = [];
    }
    transactionLookup[transactionHash].push(transaction);
  });

  // Converts grouped transactions into pairs
  Object.entries(transactionLookup).forEach(([transactionHash, transactionList]) => {
    const swapList = transactionList.map(transaction => ({
      sender: transaction.sender,
      recipient: transaction.recipient,
      token_address: transaction.token_address,
      symbol: transaction.symbol,
      value: parseFloat(transaction.value),
      log_index: transaction.log_index
    }));

    pairs[transactionHash] = {
      transaction_hash: transactionHash,
      block_timestamp: transactionList[0].block_timestamp,
      swaps: swapList
    };
  });

  // Sorts swaps within each pair by log_index
  Object.values(pairs).forEach(pair => {
    pair.swaps.sort((a, b) => parseInt(a.log_index) - parseInt(b.log_index));
  });

  return Object.values(pairs);
}

// Function to pair swaps within each transaction pair
function swapPairing(transactions) {
  const pairs = processedTransactions(transactions);

  for (const pair of pairs) {
    const swaps = pair.swaps;
    const pairedSwaps = [];

    let i = 0;
    while (i < swaps.length - 1) {
      const transfer0 = swaps[i];
      const transfer1 = swaps[i + 1];

      // Checks if transfers are a valid pair or a swap transaction
      // Removes all transactions that are not swap
      if (
        transfer0.sender === transfer1.recipient &&
        transfer0.recipient === transfer1.sender
      ) {
        pairedSwaps.push({
          sender: transfer0.sender,
          recipient: transfer0.recipient,
          token0_address: transfer0.token_address,
          token0_symbol: transfer0.symbol,
          amount0: transfer0.value,
          token1_address: transfer1.token_address,
          token1_symbol: transfer1.symbol,
          amount1: transfer1.value
        });
        i += 2; // Move to the next pair
      } else {
        i += 1; // Move to the next transfer
      }
    }

    // Replaces the original swaps with the paired swaps
    pair.swaps = pairedSwaps;
  }

  return pairs;
}


function clearFile() {
  fs.writeFileSync('output.json', '');
}


function sortSwaps() {
  const outputData = fs.readFileSync('output.json', 'utf-8')
  const data = JSON.parse(outputData);

  // data.sort((a, b) => a.swaps.length > b.swaps.length);
  clearFile();
  newdata = []


  for (let i = 0; i < data.length; i++) {
    if (data[i].swaps.length > 0) {
      newdata.push(data[i]);
    }
  }

  const jsonData = JSON.stringify(newdata, null, 2);
  fs.writeFileSync("output.json", jsonData, 'utf-8');

  console.log("processing done | data in output.json");


}


const transactionsData = fs.readFileSync('transactions.json');
const transactions = JSON.parse(transactionsData);


clearFile();

// Process transactions and perform swap pairing
const result = swapPairing(transactions);

const jsondata = JSON.stringify(result, null, 2);
fs.writeFileSync('output.json', jsondata);


sortSwaps();




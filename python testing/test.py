import json

# Function to process raw transactions into a more structured format
def processed_transactions(transactions):
    pairs = {}  # Dictionary to store paired transactions
    transaction_lookup = {}  # Dictionary to group transactions by transaction_hash

    # Loops through each transaction and group by transaction_hash
    for transaction in transactions:
        transaction_hash = transaction["transaction_hash"]
        if transaction_hash not in transaction_lookup:
            transaction_lookup[transaction_hash] = []
        transaction_lookup[transaction_hash].append(transaction)

    # Converts grouped transactions into pairs
    for transaction_hash, transaction_list in transaction_lookup.items():
        swap_list = []
        for transaction in transaction_list:
            swap_list.append({
                "sender": transaction["sender"],
                "recipient": transaction["recipient"],
                "token_address": transaction["token_address"],
                "symbol": transaction["symbol"],
                "value": float(transaction["value"]),
                "log_index": transaction["log_index"]
            })

        pairs[transaction_hash] = {
            "transaction_hash": transaction_hash,
            "block_timestamp": transaction_list[0]["block_timestamp"],
            "swaps": swap_list
        }
    
    # Sorts swaps within each pair by log_index
    for pair in pairs.values():
        pair["swaps"] = sorted(pair["swaps"], key=lambda x: int(x["log_index"]))

    return list(pairs.values())

# Function to pair swaps within each transaction pair
def swap_pairing(transactions):
    pairs = processed_transactions(transactions)

    for pair in pairs:
        swaps = pair["swaps"]
        paired_swaps = []

        i = 0
        while i < len(swaps) - 1:
            transfer0 = swaps[i]
            transfer1 = swaps[i + 1]
            
            # Checks if transfers are a valid pair or a swap transaction
            # Removes all transactions that are not swap
            if transfer0["sender"] == transfer1["recipient"] and transfer0["recipient"] == transfer1["sender"]:
                paired_swaps.append({
                    "sender": transfer0["sender"],
                    "recipient": transfer0["recipient"],
                    "token0_address": transfer0["token_address"],
                    "token0_symbol": transfer0["symbol"],
                    "amount0": transfer0["value"],
                    "token1_address": transfer1["token_address"],
                    "token1_symbol": transfer1["symbol"],
                    "amount1": transfer1["value"]
                })
                i += 2  # Move to the next pair
            else:
                i += 1  # Move to the next transfer

        # Replaces the original swaps with the paired swaps
        pair["swaps"] = paired_swaps

    return pairs

# Read transactions from 'transactions.json'
with open('transactions.json', 'r', encoding='utf-8') as f:
    transactions = json.load(f)

# Process transactions and perform swap pairing
result = swap_pairing(transactions)

# Write the result to 'output.json'
with open('output.json', 'w', encoding='utf-8') as output_file:
    json.dump(result, output_file, ensure_ascii=False, indent=2)

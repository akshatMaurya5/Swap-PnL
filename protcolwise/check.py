import requests

url_dydx = 'https://api.thegraph.com/subgraphs/name/dydxprotocol/governance'
# https://api.thegraph.com/subgraphs/name/messari/dydx-governance

query_dydx = '''
query swapData($first: Int, $skip: Int, $lastID: BigInt) {
  swaps(
    orderBy: timestamp
    orderDirection: asc
    where: {
      timestamp_gte: $lastID,
      timestamp_lte: 1706832999
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
'''

variables_dydx = {
    "first": 5,
    "skip": 0,
    "lastID": 1234567890  # Replace with your desired lastID value
}

try:
    response_dydx = requests.post(url_dydx, json={"query": query_dydx, "variables": variables_dydx})

    # print(response_dydx)
    data=response_dydx.json()
    print(data)
    # if response_dydx.status_code == 200:
    #     data_dydx = response_dydx.json()
    #     print(data_dydx)
    # else:
    #     print(f"Error: {response_dydx.status_code}, {response_dydx.text}")

except requests.RequestException as e:
    print(f"Request Exception: {e}")

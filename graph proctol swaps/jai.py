import aiohttp
import json
import asyncio

url = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3'

query = '''
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
'''

first = 1000
skip = 0
last_id = 1706400000 # april 1
last_timestamp = None
timestamp_lte = 1706409999 # may 1

all_swaps = []

async def fetch_swaps(session, first, skip, last_id):
    variables = {
        "first": first,
        "skip": skip,
        "lastID": last_id
    }

    # created the request payload
    payload = {
        "query": query,
        "variables": variables
    }

    async with session.post(url, json=payload) as response:
        # to check if the API call was successful
        if response.status != 200:
            raise ValueError(f"API call failed with status code {response.status}")

        # to parse the response JSON
        data = await response.json()

        # Error handling
        if 'data' not in data:
            raise ValueError("API response does not contain 'data' key")

        swaps = data['data']['swaps']

        return swaps

async def main():
    async with aiohttp.ClientSession() as session:
        tasks = []

        last_id = 1706400000

        while True:
            skip = 0

            for i in range(6):
                # created the task for the API call
                task = asyncio.create_task(fetch_swaps(session, first, skip, last_id))
                tasks.append(task)

                skip += 1000

            # waiting for all API calls to complete
            results = await asyncio.gather(*tasks)

            # to check if the results list is empty
            if not results:
                print("No results found.")
                return

            # to process the results of each API call
            for swaps in results:
                all_swaps.extend(swaps)

            # to check if the last API call returned any swaps
            if results[-1]:
                # to get the last timestamp from the last API call
                last_timestamp = results[-1][-1]['timestamp']
                if last_timestamp == timestamp_lte:
                    break

                last_id = last_timestamp
            else:
                print("Last API call didn't return any swaps.")
                break

asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
asyncio.run(main())

with open('swaps_uniswapV3_april.json', 'w') as json_file:
    json.dump(all_swaps, json_file)

print("All swap data has been retrieved and saved in swaps_uniswapV3_april.json!")
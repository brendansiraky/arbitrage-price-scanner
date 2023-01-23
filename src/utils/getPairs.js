const fetch = require('node-fetch')

const { getInputAndOutputFromUrl } = require('../helpers/getInputAndOutputFromUrl')

/*
    baseTokenInfo: { id: 'wbnb', ticker: 'WBNB', address: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c' }
*/
async function getPairs(exchangeName, baseTokenInfo) {
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/exchanges/${exchangeName}/tickers`)
        const result = await response.json()
        
        const tickers = result.tickers

        // Keep only those trading pairs that have contain our base token.
        const tradingPairs = tickers.filter(ticker => 
            ticker.target_coin_id === baseTokenInfo.id || ticker.coin_id === baseTokenInfo.id
        ).map(ticker => {

            // Get the addresses from the trade_url
            const tradingPair = getInputAndOutputFromUrl(ticker.trade_url)

            // We don't actually know which one is our base, so we need to sort it to be at the front
            const sortedTradingPair = tradingPair.sort((a, b) => (a === baseTokenInfo.address ? -1 : 1) || (b === baseTokenInfo.address ? -1 : 1))
            
            // If the base token is not the first element in our array, we have a problem.
            if (sortedTradingPair[0] !== baseTokenInfo.address) throw new Error('Our pairs are not sorted correctly and base token is not first!')

            return {
                tradingPair: sortedTradingPair,
                basePairName: `${ticker.coin_id}/${ticker.target_coin_id}`
            }
        })

        return tradingPairs

    } catch (err) {
        console.error(`Error from getTickers - ${err}`)
    }
}

module.exports = { getPairs }
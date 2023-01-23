const fetch = require('node-fetch')
// const { intersection } = require('underscore')
const { intersectionBy } = require('lodash')

const { getInputAndOutputFromUrl } = require('../helpers/getInputAndOutputFromUrl')

/*
    baseTokenInfo: { id: 'wbnb', ticker: 'WBNB', address: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c' }
*/
async function getPairs(exchangeNames, baseTokenInfo) {
    try {

        // Create an array of empty arrays.
        const exchangeTickers = []

        for (let i = 0; i < exchangeNames.length; i++) {
            console.log(`looping grabbing ${exchangeNames[i]}`)
            const response = await fetch(`https://api.coingecko.com/api/v3/exchanges/${exchangeNames[i]}/tickers`)
            const result = await response.json()

            exchangeTickers.push(result.tickers)
        }


        const tradingPairs = intersectionBy(...exchangeTickers, 'coin_id')

        // Keep only those tickers which target is our baseTokenInfo.ticker.
        const filteredAndMappedTradingPairs = tradingPairs.filter(ticker => 
            ticker.target_coin_id.toLowerCase() === baseTokenInfo.ticker.toLowerCase()
        ).map(ticker => {

            // Get the addresses from the trade_url
            const [inputToken, outputToken] = getInputAndOutputFromUrl(ticker.trade_url)

            return {
                tradingPair: [inputToken, outputToken], // The outputToken will be the baseToken
                basePairName: `${ticker.coin_id}/${ticker.target_coin_id}`
            }
        })

        return filteredAndMappedTradingPairs

    } catch (err) {
        console.error(`Error from getTickers - ${err}`)
    }
}

module.exports = { getPairs }
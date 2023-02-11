const { uniqBy } = require('lodash')
const { getInputAndOutputFromUrl } = require('../helpers/getInputAndOutputFromUrl')

const { getTokenLookup } = require('./tokenLookup')

const tokenLookup = getTokenLookup()

async function fetchTradingPairs(pages = 1, exchangeName = 'pancakeswap_new') {
    let pairs = []

    for (let i = 0; i < pages; i++) {
        const response = await fetch(`https://api.coingecko.com/api/v3/exchanges/${exchangeName}/tickers?page=${i + 1}`)
        const result = await response.json()
        pairs.push(...result.tickers)
	}

	const mapped = pairs.map(pair => getInputAndOutputFromUrl(pair.trade_url))

	const filteredMapped = mapped.filter((entry) => {
		const token0 = entry[0]
		const token1 = entry[1]
		return tokenLookup[token0] && tokenLookup[token1]
	})

	if (filteredMapped.length < mapped.length) {
		console.log('Had to remove pairs because they werent contained in the token Lookup. Consider updating the json file')
	}

	return uniqBy(filteredMapped, (x) => `${x[0]}${x[1]}`)
}

module.exports = { fetchTradingPairs }
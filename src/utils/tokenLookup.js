const pancakeswapTokens = require('../tokens/bsc.json')
const { parseAddressCase } = require('../helpers/parseAddressCase')

let tokenLookup = null

function getTokenLookup() {
	if (!tokenLookup) {
		tokenLookup = pancakeswapTokens.tokens.reduce((acc, cur) => {
			const address = parseAddressCase(cur.address)
			acc[address] = {
				...cur,
				address,
			}
			return acc
		}, {})
	}

	return tokenLookup
}

module.exports = { getTokenLookup }
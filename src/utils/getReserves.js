const { parseAddressCase } = require('../helpers/parseAddressCase')
const { TokenReservesContract } = require('../../contracts/TokenReserves')
const { readSavedPairs } = require('./pairs')

async function getReserves() {
	const tradingPairs = await readSavedPairs(5)
    try {
        const reserves = await TokenReservesContract.methods.getPairAddresses(
			tradingPairs,
		).call()
		return reserves.map(r => ({
			...r,
			token0: parseAddressCase(r.token0),
			token1: parseAddressCase(r.token1),
			pairAddress: parseAddressCase(r.pairAddress)
		}))
		
    } catch (err) {
        console.error(`Caught error in getReserves: ${err}`)
    }
}

module.exports = { getReserves }
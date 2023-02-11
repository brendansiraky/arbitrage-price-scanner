const { parseAddressCase } = require('../helpers/parseAddressCase')
const { PancakeswapTokenReservesContract } = require('../../contracts/TokenReserves')

async function getReserves(tradingPairs, tokenReservesContract = PancakeswapTokenReservesContract) {
    try {
        const reserves = await tokenReservesContract.methods.getPairAddresses(
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
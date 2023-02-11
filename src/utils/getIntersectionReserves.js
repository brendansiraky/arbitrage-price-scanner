const { BASE_TOKEN_ADDRESS } = require("../../config")
const { getReserves } = require("./getReserves")
const { getTradingPairs } = require("./pairs")

async function getIntersectingReserves(exchangeConfig) {
    const { pages, exchangeOne, exchangeTwo } = exchangeConfig

    // Grab the pairs from the 2 exchanges we are working with
	const exchangeOneTradingPairs = await getTradingPairs(pages, exchangeOne.name)
	const exchangeTwoTradingPairs = await getTradingPairs(pages, exchangeTwo.name)

    // Keep those that are an association with the base token.
    const exchangeOneTradingPairsWithBase = exchangeOneTradingPairs.filter(([token0, token1]) => token0 === BASE_TOKEN_ADDRESS || token1 === BASE_TOKEN_ADDRESS)
    const exchangeTwoTradingPairsWithBase = exchangeTwoTradingPairs.filter(([token0, token1]) => token0 === BASE_TOKEN_ADDRESS || token1 === BASE_TOKEN_ADDRESS)
    
    // Grab the reserve information about the pairs
	const reservesFromExchangeOne = await getReserves(exchangeOneTradingPairsWithBase, exchangeOne.reserveContract)
    const reservesFromExchangeTwo = await getReserves(exchangeTwoTradingPairsWithBase, exchangeTwo.reserveContract)

    const intersections = reservesFromExchangeOne.reduce((acc, cur) => {
        const comparisonOne = `${cur.token0}${cur.token1}`
        reservesFromExchangeTwo.forEach(e => {
            const comparisonTwo = `${e.token0}${e.token1}`
            if (comparisonOne === comparisonTwo) {
                acc.reserveOne.push({
                    ...cur,
                    routerContractAddress: exchangeOne.routerContractAddress
                })
                acc.reserveTwo.push({
                    ...e,
                    routerContractAddress: exchangeTwo.routerContractAddress
                })
            }
        })
    
        return acc
    }, { reserveOne: [], reserveTwo: [] })

    return intersections
}

module.exports = { getIntersectingReserves }
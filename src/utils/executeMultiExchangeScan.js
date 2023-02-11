const fs = require('fs')
const _ = require('lodash')
const { PancakeswapTokenReservesContract, BiswapTokenReservesContract } = require("../../contracts/TokenReserves")
const { getTokenLookup } = require("./tokenLookup")
const { fromWei } = require("../helpers/convert")
const { BASE_TOKEN_ADDRESS } = require("../../config")
const { getIntersectingReserves } = require("./getIntersectionReserves")
const { PANCAKESWAP_ROUTER_CONTRACT_ADDRESS_V2, BISWAP_ROUTER_CONTRACT_ADDRESS } = require('../../constants/addresses')
const { executeMultiExchangeSwap } = require('./executeMultiExchangeSwap')

const exchangesConfig = {
    exchangeOne: {
        name: 'pancakeswap_new',
        reserveContract: PancakeswapTokenReservesContract,
        routerContractAddress: PANCAKESWAP_ROUTER_CONTRACT_ADDRESS_V2,
    },
    exchangeTwo: {
        name: 'biswap',
        reserveContract: BiswapTokenReservesContract,
        routerContractAddress: BISWAP_ROUTER_CONTRACT_ADDRESS,
    },
    pages: 2
}

function getExchangeRate(reserve) {
    const tokenLookup = getTokenLookup()

    const token0Decimals = tokenLookup[reserve.token0].decimals
	const token1Decimals = tokenLookup[reserve.token1].decimals
	
	// USDC 49,651,433
	const reserve0 = fromWei(reserve.reserve0, token0Decimals)
	
	// ETH 31,300
	const reserve1 = fromWei(reserve.reserve1, token1Decimals)

	// USDC per ETH = 0.0006
	const exchangeRate = (reserve0 / reserve1)

    return exchangeRate
}

function getProfitableMultiTrades(reserveOne, reserveTwo) {
    // purely an estimation, shouldshould try work this out properly.
    const transactionFee = 0.0017
    const liquidityProviderFee = 0.0025

    const profitableTrades = reserveOne.reduce((acc, currentReserveOne, index) => {
        const currentReserveTwo = reserveTwo[index]

        const firstExchangeRate = getExchangeRate(currentReserveOne)
        const secondExchangeRate = getExchangeRate(currentReserveTwo)

        const cheapExchangeRate = Math.min(firstExchangeRate, secondExchangeRate)
        const expensiveExchangeRate = Math.max(firstExchangeRate, secondExchangeRate)
        const cheaperExchangeRateWithFee = cheapExchangeRate * (1 + liquidityProviderFee + transactionFee)

        if (cheaperExchangeRateWithFee < expensiveExchangeRate) {

            const fromToken = currentReserveOne.token0 === BASE_TOKEN_ADDRESS ? currentReserveOne.token0 : currentReserveOne.token1
            const toToken = currentReserveOne.token0 !== BASE_TOKEN_ADDRESS ? currentReserveOne.token0 : currentReserveOne.token1
            
            const fromExchange = firstExchangeRate < secondExchangeRate ? currentReserveOne : currentReserveTwo
            const toExchange = firstExchangeRate < secondExchangeRate ? currentReserveTwo : currentReserveOne

            const difference = `${(((expensiveExchangeRate - cheaperExchangeRateWithFee) / expensiveExchangeRate) * 100)}`

            acc.push({
                gain: difference,
                config: {
                    fromToken,
                    toToken,
                    fromRouterContractAddress: fromExchange.routerContractAddress,
                    toRouterContractAddress: toExchange.routerContractAddress
                }
            })
        }
        
        return acc
    }, [])

    return profitableTrades.sort((a, b) => a.gain - b.gain)
}

async function executeMultiExchangeScan() {

    const { reserveOne, reserveTwo } = await getIntersectingReserves(exchangesConfig)

    const profitableTrades = getProfitableMultiTrades(reserveOne, reserveTwo)

    if (profitableTrades.length > 0) {
        // We have profitable trades
        // Grab the most profitable one
        console.log('Found a profitable trade!')

        const { gain, config } = profitableTrades[profitableTrades.length - 1]

        const onSuccess = (receipt) => {
            console.log('Successfully Executed Trade! Logging trade details and receipt!')
            const jsonToWrite = {
                config,
                gain,
                receipt,
                type: 'MultiExchange'
            }

            fs.writeFileSync(`${__dirname}/../../logs/${Date()}.json`, JSON.stringify(jsonToWrite, null, 2))
        }

        executeMultiExchangeSwap(
            1,
            [config.fromToken, config.toToken],
            config.fromRouterContractAddress, 
            config.toRouterContractAddress, 
            onSuccess
        )
    } else {
        console.log('Did NOT find a profitable trade.')
    }

}

module.exports = { executeMultiExchangeScan }
const { convertFromWei, convertToWei } = require('../helpers/convert')

async function executeSimpleTrade(
    tradeFunction,
    startBalanceNotInWei,
    tokenSwapArray
) {
    try {

        
        const { tradingPair, basePairName } = tokenSwapArray
        console.log(tradingPair)

        // Convert the starting balance to wei as this is what the trading function expects as the amount value.
        const startingBalanceInWei = convertToWei(startBalanceNotInWei)

        const outputTokenBalance = await tradeFunction(startingBalanceInWei, tradingPair)

        // console.log(convertFromWei(outputTokenBalance))
        return `${basePairName} - ${convertFromWei(outputTokenBalance)}`

    } catch (err) {
        console.error(`Error from executeSimpleTrade - ${err}`)
    }
}

module.exports = { executeSimpleTrade }
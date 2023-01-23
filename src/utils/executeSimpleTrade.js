async function executeSimpleTrade(
    tradeFunction,
    startBalanceNotInWei,
    tokenSwapArray
) {
    try {
        // Convert the starting balance to wei as this is what the trading function expects as the amount value.
        const startingBalanceInWei = convertToWei(startBalanceNotInWei)

        const outputTokenBalance = await tradeFunction(startingBalanceInWei, tokenSwapArray)

        console.log(convertFromWei(outputTokenBalance))

    } catch (err) {
        console.error(`Error from executeSimpleTrade - ${err}`)
    }
}

module.exports = { executeSimpleTrade }
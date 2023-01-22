async function executeTrade(router, amountIn, pairsArray) {
    try {
        const amountsOut = await router.methods.getAmountsOut(amountIn, pairsArray).call()
        return amountsOut[1]
    } catch (err) {
        console.error(`Error in getAmountsOut - ${err}`)
    }
}

module.exports = { executeTrade }
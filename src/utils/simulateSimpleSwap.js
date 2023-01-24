async function simulateSimpleSwap(
    router,
    amount,
    pairsArray,
) {
    try {
        const amountsOut = await router.methods.getAmountsOut(amount, pairsArray).call()
        const outputValue = amountsOut[1]
        return outputValue
    } catch (err) {
        console.error(`Error from simulateSimpleSwap - ${err}`)
    }
}

module.exports = { simulateSimpleSwap }
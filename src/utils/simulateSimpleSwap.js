const { getV2TokenPairContract } = require('./getV2TokenPairContract')

async function simulateSimpleSwap(
    router,
    amount,
    pairsArray,
    formatOutputValue = false
) {
    try {
        const amountsOut = await router.methods.getAmountsOut(amount, pairsArray).call()
        const outputValue = amountsOut[1]

        let readableOutputValue
        // In the case that the output value should be formatted and not in wei.
        if (formatOutputValue) {
            // We don't know how many decimals a token will have, so we can't generalically convert it from wei.
            // We need to get the token address first.
            const baseTokenContract = getV2TokenPairContract(pairsArray[0])

            // Then grab the decimals of this token
            const decimals = await baseTokenContract.methods.decimals().call()

            // Convert it from wei
            readableOutputValue = outputValue / 10 ** decimals
        }

        return readableOutputValue || outputValue
    } catch (err) {
        console.error(`Error from simulateSimpleSwap - ${err}`)
    }
}

module.exports = { simulateSimpleSwap }
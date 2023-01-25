const { fromWei, toWei } = require('../helpers/convert')
const { getTokenDecimals } = require('./getTokenDecimals')

async function simulateSimpleSwap(
    router,
    amount,
    pairsArray,
    formatOutput = false,
) {
    try {
        let outputValue

        const decimals = await getTokenDecimals(pairsArray[0])
        const inputValue = toWei(amount, decimals)
        const amountsOut = await router.methods.getAmountsOut(inputValue, pairsArray).call()

        if (formatOutput) {
            outputValue = fromWei(amountsOut[1], decimals)
        }

        return outputValue || amountsOut[1]
    } catch (err) {
        console.error(`Error from simulateSimpleSwap - ${err}`)
    }
}

module.exports = { simulateSimpleSwap }
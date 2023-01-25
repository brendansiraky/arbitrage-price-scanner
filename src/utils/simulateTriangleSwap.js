const { toWei, fromWei } = require('../helpers/convert');
const { getTokenDecimals } = require('./getTokenDecimals');
const { simulateSimpleSwap } = require('./simulateSimpleSwap')

async function simulateTriangleSwap(
    router,
    amount,
    pairsArray,
) {
    try {
        const decimals = await getTokenDecimals(pairsArray[0])
        const inputValue = toWei(amount, decimals)
    
        const firstSwapOutput = await simulateSimpleSwap(
            router,
            inputValue,
            [pairsArray[0], pairsArray[1]]
        )
    
        const secondSwapOutput = await simulateSimpleSwap(
            router,
            firstSwapOutput,
            [pairsArray[1], pairsArray[2]]
        )
    
        const thirdSwapOutput = await simulateSimpleSwap(
            router,
            secondSwapOutput,
            [pairsArray[2], pairsArray[0]],
        )
    
        const outputValue = fromWei(thirdSwapOutput, decimals)
    
       return outputValue
    } catch (err) {
        console.error(`Error from simulateTriangleSwap - ${err}`)
    }
}

module.exports = { simulateTriangleSwap }
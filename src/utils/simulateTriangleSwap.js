const { getTokenDecimals } = require('./getTokenDecimals');
const { simulateSimpleSwap } = require('./simulateSimpleSwap')

async function simulateTriangleSwap(
    router,
    amount,
    pairsArray,
    outputTokenDecimals = null
) {

    const firstSwapOutput = await simulateSimpleSwap(
        router,
        amount,
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

    let readableOutputValue;

    if (outputTokenDecimals) {
        // Convert it from wei
        readableOutputValue = thirdSwapOutput / 10**outputTokenDecimals

        return readableOutputValue || outputValue
    }

    return readableOutputValue || thirdSwapOutput
}

module.exports = { simulateTriangleSwap }
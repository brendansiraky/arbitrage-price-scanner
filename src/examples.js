const { UniswapRouter } = require('./contracts/routers')
const { simulateSimpleSwap } = require('./utils/simulateSimpleSwap')
const { simulateTriangleSwap } = require('./utils/simulateTriangleSwap')

/******* EXAMPLES *******/
async function executeSimulateSimpleSwap() {
    const value = '1' // WETH

    const output = await simulateSimpleSwap(
        UniswapRouter,
        value,
        [
            '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH
            '0x4d224452801aced8b2f0aebe155379bb5d594381' // APE
        ],
        true // Indicates whether to format the output
    )

    console.log(output)
}

async function executeSimulateTriagleSwap() {
    const value = '100' // TETHER

    const output = await simulateTriangleSwap(
        UniswapRouter,
        value,
        [
            '0xdac17f958d2ee523a2206206994597c13d831ec7', // Tether
            '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH
            '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
        ],
    )

    console.log(output)
}

// executeSimulateSimpleSwap()
// executeSimulateTriagleSwap()
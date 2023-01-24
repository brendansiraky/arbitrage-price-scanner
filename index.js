const { Web3Client } =  require('./src/utils/client.js')
const BigNumber = require('big.js')
const { getRandomEntryFromArray } = require('./src/helpers/getRandomEntryFromArray')
const { executeMultiExchangeSwap } = require('./src/utils/executeMultiExchangeSwap')
const { simulateSimpleSwap } = require('./src/utils/simulateSimpleSwap')

const { getV2TokenPairContract } = require('./src/utils/getV2TokenPairContract')

const { PancakeSwapRouter, UniswapRouter } = require('./src/contracts/routers')

const { getPairs } = require('./src/utils/getPairs.js');
const { convertToWei, convertFromWei } = require('./src/helpers/convert.js')

// // Closure function that wraps over the UNISWAP router 
// async function uniswapTrade(amount, pairsArray) {
//     return executeTrade(UniswapRouter, amount, pairsArray)
// }

// // Closure function that wraps over the PANCAKESWAP router 
// async function pancakeTrade(amount, pairsArray) {
//     return executeTrade(PancakeSwapRouter, amount, pairsArray)
// }

// // Closure function that wraps over the BISWAP router
// async function biswapTrade(amount, pairsArray) {
//     return executeTrade(BiswapRouter, amount, pairsArray)
// }

// const amountInUSDC = '100' / 10**6 // $100

async function executeScan() {
    // Get the pairs that crossover between these 2 exchanges
    // const pairs = await getPairs(['pancakeswap_new'], baseTokenInfo)

    // const randomPair = getRandomEntryFromArray(pairs)

    // executeSimpleTrade(
    //     pancakeTrade,
    //     '1',
    //     randomPair
    // )


    try {
        // const amountsOutFirst = await UniswapRouter.methods.getAmountsOut(amountInEth, [USDC, WETH]).call()
        // const amountsOutSecond = await UniswapRouter.methods.getAmountsOut(amountsOutFirst[1], [WETH, USDC]).call()

        // console.log(amountsOutSecond[1] / 10**6)

        // const bigNumber = new BigNumber()
        // console.log(amountsOut)

        // const num = convertFromWei(amountsOut[1] / 10**6)
        // const usdcOutput = new BigNumber(amountsOut[1]).div(10 ** 6)
        // console.log(usdcOutput.toFixed(2))

    } catch (err) {
        console.error(`Error from getAmountsOut - ${err}`)
    }
}

async function getCheaperExchangeRouter(
    firstTradeFunction,
    secondTradeFunction,
    pairs
) {

}

// executeScan()

/******* EXAMPLES *******/
async function executeSimulateSimpleSwap() {
    const output = await simulateSimpleSwap(
        UniswapRouter,
        convertToWei('1'), // 1 WETH (ETH)
        [
            '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH
            '0x4d224452801aced8b2f0aebe155379bb5d594381' // APE
        ],
        true // Indicates whether we want the output to be formatted or returned as wei.
    )

    console.log(output)
}

executeSimulateSimpleSwap()

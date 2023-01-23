const { Web3Client } =  require('./src/utils/client.js')
const { executeTrade } = require('./src/utils/executeTrade.js')
const { getRandomEntryFromArray } = require('./src/helpers/getRandomEntryFromArray')
const { executeMultiExchangeSwap } = require('./src/utils/executeMultiExchangeSwap')
const { executeSimpleTrade } = require('./src/utils/executeSimpleTrade')

// ABI's
const BiswapRouterAbi = require('./abi/BiswapRouter.json')
const PancakeSwapRouterV2Abi = require('./abi/PancakeSwapRouterV2.json');
const { getPairs } = require('./src/utils/getPairs.js');

// Biswap
const BISWAP_ROUTER_CONTRACT_ADDRESS = '0x3a6d8cA21D1CF76F653A67577FA0D27453350dD8'
const BiswapRouter = new Web3Client.eth.Contract(
    BiswapRouterAbi.abi, 
    BISWAP_ROUTER_CONTRACT_ADDRESS
)

// Pancakeswap
const PANCAKESWAP_ROUTER_CONTRACT_ADDRESS_V2 = '0x10ED43C718714eb63d5aA57B78B54704E256024E'
const PancakeSwapRouter = new Web3Client.eth.Contract(
    PancakeSwapRouterV2Abi.abi, 
    PANCAKESWAP_ROUTER_CONTRACT_ADDRESS_V2
)

// Starting token will relate to what we hold in our wallet.
// This is because it is needed in order to trigger the first trade (e.g BNB/CAKE).

// Steps for multi exchange trade
/*
    1. Get the crossover pairs of tokens that are trading on 2 different DEX's
    2. Check the exchange rate of the pair on each of the exchanges
    3. Is the % difference in exchange rates greater than the fees it will cost to trade?
        - Fees would include: 
            - Liquidity pool provider fee ((0.20% - 0.25%) * 2)
            - Transaction Fee.
    4. If the trade is worth taking, then call the executeMultiExchange function and simulate the trade and whether the finishing balance will be greater than the starting balance.
    5. if this is true, then fire off the real trade by calling the smart contract that has been deployed to execute trades.
    6. Alternatively, number 4. can be skipped and number 5. can just be executed as the contract will revert annyway if the trade is not profitable.
*/

const baseTokenInfo = { 
    // id: 'wbnb',
    ticker: 'WBNB', 
    // address: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
}

// Closure function that wraps over the PANCAKESWAP router 
async function pancakeTrade(amount, pairsArray) {
    return executeTrade(PancakeSwapRouter, amount, pairsArray)
}

// Closure function that wraps over the BISWAP router
async function biswapTrade(amount, pairsArray) {
    return executeTrade(BiswapRouter, amount, pairsArray)
}

async function executeScan() {
    // Get the pairs that crossover between these 2 exchanges
    const pairs = await getPairs(['pancakeswap_new', 'biswap'], baseTokenInfo)

    
    setInterval(async () => {
        const { tradingPair, basePairName } = getRandomEntryFromArray(pairs)
        const tradingPairReversed = tradingPair.reverse()
        
        // Grab the exchange rate from both of the exchanges.
        const amountFromPancake = await executeSimpleTrade(
            pancakeTrade,
            '1',
            {
                tradingPair: tradingPairReversed, // WBNB/TW
                basePairName,
            }
        )
    
        const amountFromBiswap = await executeSimpleTrade(
            biswapTrade,
            '1',
            {
                tradingPair: tradingPairReversed, // WBNB/TW
                basePairName,
            }
        )
    
        console.log({ amountFromPancake, amountFromBiswap })
    }, 10000)


    //   const { tradingPair, basePairName } = tokenSwapArray

    // executeMultiExchangeSwap(
    //     pancakeTrade,
    //     biswapTrade,
    //     '1',
    //     randomPair
    // )

    // setInterval(() => {
    //     const randomPair = getRandomEntryFromArray(pairs)
    //     executeMultiExchangeSwap(
    //         pancakeTrade,
    //         biswapTrade,
    //         '1',
    //         randomPair
    //     )
    // }, 10000)
}

async function getCheaperExchangeRouter(
    firstTradeFunction,
    secondTradeFunction,
    pairs
) {

}

executeScan()

/*
    {
        tradingPair: sortedTradingPair,
        basePairName: `${ticker.coin_id}/${ticker.target_coin_id}`
    }
*/

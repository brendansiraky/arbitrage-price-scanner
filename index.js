const { convertToWei, convertFromWei } =  require('./src/helpers/convert')
const { Web3Client } =  require('./src/utils/client.js')
const { executeTrade } = require('./src/utils/executeTrade.js')

const PancakeSwapFactoryV2Abi = require('./abi/PancakeSwapFactoryV2.json')
const PancakeSwapRouterV2Abi = require('./abi/PancakeSwapRouterV2.json')
const BiswapFactoryAbi = require('./abi/BiswapFactory.json')
const BiswapRouterAbi = require('./abi/BiswapRouter.json')

const { COINMARKET_CAP_API_KEY } = require('./config')

console.log(COINMARKET_CAP_API_KEY)

// Biswap
const BISWAP_FACTORY_CONTRACT_ADDRESS = '0x858E3312ed3A876947EA49d572A7C42DE08af7EE'
const BISWAP_ROUTER_CONTRACT_ADDRESS = '0x3a6d8cA21D1CF76F653A67577FA0D27453350dD8'

const BiswapRouter = new Web3Client.eth.Contract(
    BiswapRouterAbi.abi, 
    BISWAP_ROUTER_CONTRACT_ADDRESS
)
const BiswapFactory = new Web3Client.eth.Contract(
    BiswapFactoryAbi.abi,
    BISWAP_FACTORY_CONTRACT_ADDRESS
)

// Pancakeswap
const PANCAKESWAP_FACTORY_CONTRACT_ADDRESS_V2 = '0xBCfCcbde45cE874adCB698cC183deBcF17952812'
const PANCAKESWAP_ROUTER_CONTRACT_ADDRESS_V2 = '0x10ED43C718714eb63d5aA57B78B54704E256024E'

const PancakeSwapRouter = new Web3Client.eth.Contract(
    PancakeSwapRouterV2Abi.abi, 
    PANCAKESWAP_ROUTER_CONTRACT_ADDRESS_V2
)
const PancakeSwapFactory = new Web3Client.eth.Contract(
    PancakeSwapFactoryV2Abi.abi,
    PANCAKESWAP_FACTORY_CONTRACT_ADDRESS_V2
)

const BNB = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
const BUSD = '0xe9e7cea3dedca5984780bafc599bd69add087d56'
const CAKE = '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82'
const BSW = '0x965F527D9159dCe6288a2219DB51fc6Eef120dD1'


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

async function executeTriangleTrade() {
    try {
        // 1. We get the amount of bnb we are spending

        const startingBnbBalance = '1'

        // 2. We get the amountOut for bnb/shitcoin
        const cake = await getAmountsOut(convertToWei(startingBnbBalance), [BNB, BSW])

        // 3. Convert the cake to BUSD
        const busd = await getAmountsOut(cake, [BSW, BUSD])

        // 4. Convert BUSD back to BNB
        const bnb = await getAmountsOut(busd, [BUSD, BNB])

        const endingBnbBalance = convertFromWei(bnb)

        console.log(`
            BNB Starting Balance: ${startingBnbBalance} \n
            BNB Ending Balance ${endingBnbBalance} \n

            Ending Difference: ${(((endingBnbBalance - startingBnbBalance) / startingBnbBalance) * 100).toFixed(4)}%
        `)
    } catch (error) {
        console.error(err)
    }
}

async function executeSimpleTrade() {
    try {


    } catch (error) {
        console.error(err)
    }
}

async function executeMultiExchangeTrade() {
    const startingBalanceInBnb = '1'

    // Swap it on pancake for busd
    // const cake = await executeTrade(PancakeSwapRouter, convertToWei(startingBalanceInBnb), [BNB, CAKE])
    const cake = await executePancakeTrade(convertToWei(startingBalanceInBnb), [BNB, CAKE])
    
    // const busd = await executeTrade(PancakeSwapRouter, cake, [CAKE, BUSD])
    const busd = await executePancakeTrade(cake, [CAKE, BUSD])
    
    const bnb = await executePancakeTrade(busd, [BUSD, BNB])

    const endingBalanceInBnb = convertFromWei(bnb)

    console.log(`
        BNB Starting Balance: ${startingBalanceInBnb} \n
        BNB Ending Balance ${endingBalanceInBnb} \n

        Ending Difference: ${(((endingBalanceInBnb - startingBalanceInBnb) / startingBalanceInBnb) * 100).toFixed(4)}%
    `)
}

async function executePancakeTrade(amount, pairsArray) {
    return executeTrade(PancakeSwapRouter, amount, pairsArray)
}

async function executeBiswapTrade(amount, pairsArray) {
    return executeTrade(BiswapRouter, amount, pairsArray)
}

// executeMultiExchangeTrade()
// executeTriangleTrade()

// mainHTTP()
// calcBNBPrice()
// execute()


// executeDoubleExchangeTrade()
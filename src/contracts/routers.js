const { Web3Client } = require('../utils/client')

const BiswapRouterAbi = require('../../abi/BiswapRouter.json')
const PancakeSwapRouterV2Abi = require('../../abi/PancakeSwapRouterV2.json')
const UniswapRouterV2Abi = require('../../abi/UniswapRouter.json')

// Pancakeswap
const PANCAKESWAP_FACTORY_CONTRACT_ADDRESS = '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73'
const PANCAKESWAP_ROUTER_CONTRACT_ADDRESS_V2 = '0x10ED43C718714eb63d5aA57B78B54704E256024E'
const PancakeSwapRouter = new Web3Client.eth.Contract(
    PancakeSwapRouterV2Abi.abi,
    PANCAKESWAP_ROUTER_CONTRACT_ADDRESS_V2
)

// Biswap
const BISWAP_ROUTER_CONTRACT_ADDRESS = '0x3a6d8cA21D1CF76F653A67577FA0D27453350dD8'
const BiswapRouter = new Web3Client.eth.Contract(
    BiswapRouterAbi.abi, 
    BISWAP_ROUTER_CONTRACT_ADDRESS
)

// Uniswap
const UNISWAP_FACTORY_CONTRACT_ADDRESS = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'
const UNISWAP_ROUTER_CONTRACT_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
const UniswapRouter = new Web3Client.eth.Contract(
    UniswapRouterV2Abi.abi, 
    UNISWAP_ROUTER_CONTRACT_ADDRESS
)

module.exports = {
    UniswapRouter,
    PancakeSwapRouter,
    BiswapRouter,
}


/*
    PANCAKE
    WBNB - 0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c
    CAKE - 0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82


    PANCAKE_TESTNET
    Router = '0xD99D1c33F9fC3444f8101754aBC46c52416550D1'
    Factory = '0x6725F303b657a9451d8BA641348b6761A6CC7a17'
*/

/*
    GOERLI TESTNET
    WETH = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'
    UNI = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'
    USDC = '0xA2025B15a1757311bfD68cb14eaeFCc237AF5b43'
    DAI = '0xDF1742fE5b0bFc12331D8EAec6b478DfDbD31464'


    WETH/USDC POOL = '0x07865c6e87b9f70255377e024ace6630c1eaa37f'
    WETH/UNI POOL = '0x28cee28a7C4b4022AC92685C07d2f33Ab1A0e122'
*/
const { Web3Client } = require('../src/utils/client')

const BiswapRouterAbi = require('../abi/BiswapRouter.json')
const PancakeSwapRouterV2Abi = require('../abi/PancakeSwapRouterV2.json')
const UniswapRouterV2Abi = require('../abi/UniswapRouter.json')
const { 
    PANCAKESWAP_ROUTER_CONTRACT_ADDRESS_V2, 
    BISWAP_ROUTER_CONTRACT_ADDRESS, 
    UNISWAP_ROUTER_CONTRACT_ADDRESS 
} = require('../constants/addresses')

// Pancakeswap
const PancakeSwapRouter = new Web3Client.eth.Contract(
    PancakeSwapRouterV2Abi.abi,
    PANCAKESWAP_ROUTER_CONTRACT_ADDRESS_V2
)

// Biswap
const BiswapRouter = new Web3Client.eth.Contract(
    BiswapRouterAbi.abi, 
    BISWAP_ROUTER_CONTRACT_ADDRESS
)

// Uniswap
const UniswapRouter = new Web3Client.eth.Contract(
    UniswapRouterV2Abi.abi, 
    UNISWAP_ROUTER_CONTRACT_ADDRESS
)

module.exports = {
    UniswapRouter,
    PancakeSwapRouter,
    BiswapRouter,
}
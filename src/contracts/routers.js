const { Web3Client } = require('../utils/client')

const BiswapRouterAbi = require('../../abi/BiswapRouter.json')
const PancakeSwapRouterV2Abi = require('../../abi/PancakeSwapRouterV2.json')
const UniswapRouterV2Abi = require('../../abi/UniswapRouter.json')

// Pancakeswap
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
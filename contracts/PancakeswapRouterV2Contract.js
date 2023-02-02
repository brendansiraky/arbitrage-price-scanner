const { Web3Client } = require('../src/utils/client')
const PancakeswapRouterV2ContractAbi = require('../abi/PancakeSwapRouterV2.json')
const { PANCAKESWAP_ROUTER_CONTRACT_ADDRESS_V2 } = require('../constants/addresses')

const PancakeswapRouterV2Contract = new Web3Client.eth.Contract(
	PancakeswapRouterV2ContractAbi.abi,
	PANCAKESWAP_ROUTER_CONTRACT_ADDRESS_V2
)

module.exports = {
	PancakeswapRouterV2Contract,
}
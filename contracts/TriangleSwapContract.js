const { Web3Client } = require('../src/utils/client')
const TriangleSwapContractAbi = require('../abi/TriangleSwap.json')

const TRIANGLESWAP_CONTRACT_ADDRESS = '0x829b445Ba1dAA1eC5cF6C2855dADF88Ad923F85C'

const TriangleSwapContract = new Web3Client.eth.Contract(
	TriangleSwapContractAbi,
	TRIANGLESWAP_CONTRACT_ADDRESS
)

module.exports = { TriangleSwapContract }
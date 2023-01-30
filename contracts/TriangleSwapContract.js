const { Web3Client } = require('../src/utils/client')
const TriangleSwapContractAbi = require('../abi/TriangleSwap.json')

const TRIANGLESWAP_CONTRACT_ADDRESS = '0x008e367fEF9455f2981FC499D772d885d2d8013B'

const TriangleSwapContract = new Web3Client.eth.Contract(
	TriangleSwapContractAbi,
	TRIANGLESWAP_CONTRACT_ADDRESS
)

module.exports = {
	TriangleSwapContract,
	TRIANGLESWAP_CONTRACT_ADDRESS,
}

// gasPrice 10 GWEI
// Gas Limit 77691 WEI
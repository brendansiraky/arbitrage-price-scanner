const { Web3Client } = require('../src/utils/client')
const TriangleSwapContractAbi = require('../abi/TriangleSwap.json')

const TRIANGLESWAP_CONTRACT_ADDRESS = '0x7a3474a680ECD84a69149279E11cC3879914D46F'
const TriangleSwapContract = new Web3Client.eth.Contract(
	TriangleSwapContractAbi,
	TRIANGLESWAP_CONTRACT_ADDRESS
)

module.exports = {
	TriangleSwapContract,
	TRIANGLESWAP_CONTRACT_ADDRESS,
}
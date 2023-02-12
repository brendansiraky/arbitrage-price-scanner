const { Web3Client } = require('../src/utils/client')
const MultiExchangeSwap = require('../abi/MultiExchangeSwap.json')

const MULTIEXCHANGESWAP_CONTRACT_ADDRESS = '0x3f6df0d0B48674e3b679435521dA73227300305B'
const MultiExchangeSwapContract = new Web3Client.eth.Contract(
	MultiExchangeSwap,
	MULTIEXCHANGESWAP_CONTRACT_ADDRESS
)

module.exports = {
	MultiExchangeSwapContract,
	MULTIEXCHANGESWAP_CONTRACT_ADDRESS,
}
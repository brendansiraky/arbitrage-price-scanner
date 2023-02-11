const { Web3Client } = require('../src/utils/client')
const MultiExchangeSwap = require('../abi/MultiExchangeSwap.json')

const MULTIEXCHANGESWAP_CONTRACT_ADDRESS = '0xD92FA73234E6A1C4eCb9c5E1237345a735A68B14'
const MultiExchangeSwapContract = new Web3Client.eth.Contract(
	MultiExchangeSwap,
	MULTIEXCHANGESWAP_CONTRACT_ADDRESS
)

module.exports = {
	MultiExchangeSwapContract,
	MULTIEXCHANGESWAP_CONTRACT_ADDRESS,
}
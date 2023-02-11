const { Web3Client } = require('../src/utils/client')
const TokenReservesContractAbi = require('../abi/TokenReserves.json')

const PANCAKESWAP_TOKEN_RESERVES_CONTRACT_ADDRESS = '0xAf3cdAbA1B917c9bB729BD2cD68a3caBcC9A0d55'
const BISWAP_TOKEN_RESERVES_CONTRACT_ADDRESS = '0x64aaa894eD1b76CeEA2358D13a32b2f3F4A9e850'

const PancakeswapTokenReservesContract = new Web3Client.eth.Contract(
    TokenReservesContractAbi,
    PANCAKESWAP_TOKEN_RESERVES_CONTRACT_ADDRESS
)

const BiswapTokenReservesContract = new Web3Client.eth.Contract(
    TokenReservesContractAbi,
    BISWAP_TOKEN_RESERVES_CONTRACT_ADDRESS
)

module.exports = {
    PancakeswapTokenReservesContract,
    BiswapTokenReservesContract,
}
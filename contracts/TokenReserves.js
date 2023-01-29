const { Web3Client } = require('../src/utils/client')
const TokenReservesContractAbi = require('../abi/TokenReserves.json')

const TOKEN_RESERVES_CONTRACT_ADDRESS = '0xAf3cdAbA1B917c9bB729BD2cD68a3caBcC9A0d55'

const TokenReservesContract = new Web3Client.eth.Contract(
    TokenReservesContractAbi,
    TOKEN_RESERVES_CONTRACT_ADDRESS
)

module.exports = { TokenReservesContract }
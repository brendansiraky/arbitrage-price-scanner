const dotenv =  require('dotenv')
const { parseAddressCase } = require('./src/helpers/parseAddressCase')

dotenv.config()

const {
    BASE_TICKER,
    STARTING_BALANCE,
    NETWORK,
    BSC_RPC_URL,
    BSC_TESTNET_RPC_URL,
    ETH_RPC_URL,
    GOERLI_ETH_RPC_URL,
    PRIVATE_KEY,
} = process.env


module.exports = {
    BASE_TICKER,
    STARTING_BALANCE,
    RPC_URL: getRpcUrl(NETWORK),
    BASE_TOKEN_ADDRESS: NETWORK === 'BSC' 
        ? parseAddressCase('0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c') // WBNB
        : parseAddressCase('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'), // WETH
    NETWORK,
    PRIVATE_KEY,
}

function getRpcUrl(network) {
    switch (network) {
        case 'BSC':
            return BSC_RPC_URL;
        case 'BSC_TESTNET':
            return BSC_TESTNET_RPC_URL;
        case 'ETH_TESTNET':
            return GOERLI_ETH_RPC_URL;
        default:
            return ETH_RPC_URL;
    }
}
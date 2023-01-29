const dotenv =  require('dotenv')
const { parseAddressCase } = require('./src/helpers/parseAddressCase')
dotenv.config()

const {
    BASE_TICKER,
    NETWORK,
    BSC_RPC_URL,
    ETH_RPC_URL,
    GOERLI_ETH_RPC_URL,
    PRIVATE_KEY,
    ACCOUNT_ADDRESS,
} = process.env

module.exports = {
    BASE_TICKER,
    RPC_URL: NETWORK === 'BSC' 
        ? BSC_RPC_URL 
        : NETWORK === 'GOERLI_ETH' 
            ? GOERLI_ETH_RPC_URL 
            : ETH_RPC_URL, // Default to ETH if nothing is specified
    BASE_TOKEN_ADDRESS: NETWORK === 'BSC' 
        ? parseAddressCase('0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c') // WBNB
        : parseAddressCase('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'), // WETH
    NETWORK,
    PRIVATE_KEY,
    ACCOUNT_ADDRESS,
}
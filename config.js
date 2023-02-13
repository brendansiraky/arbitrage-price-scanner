const dotenv =  require('dotenv')
const { TOKENS } = require('./constants/addresses')
const { parseAddressCase } = require('./src/helpers/parseAddressCase')

dotenv.config()
let BASE_TICKER_FROM_ARGV = null;
let STARTING_BALANCE_FROM_ARGV = null;

process.argv.forEach(argument => {
    if (argument.includes('BASE_TICKER')) {
        BASE_TICKER_FROM_ARGV = argument.split("=")[1]
    }
    if (argument.includes('STARTING_BALANCE')) {
        STARTING_BALANCE_FROM_ARGV = argument.split("=")[1]
    }
})

const {
    BASE_TICKER: BASE_TICKER_FROM_ENV,
    STARTING_BALANCE: STARTING_BALANCE_FROM_ENV,
    NETWORK,
    BSC_RPC_URL,
    BSC_TESTNET_RPC_URL,
    ETH_RPC_URL,
    GOERLI_ETH_RPC_URL,
    PRIVATE_KEY,
} = process.env

const BASE_TICKER = BASE_TICKER_FROM_ARGV || BASE_TICKER_FROM_ENV

module.exports = {
    BASE_TICKER,
    STARTING_BALANCE: STARTING_BALANCE_FROM_ARGV || STARTING_BALANCE_FROM_ENV,
    RPC_URL: getRpcUrl(NETWORK),
    BASE_TOKEN_ADDRESS: getBaseTokenAddress(BASE_TICKER, NETWORK),
    NETWORK,
    PRIVATE_KEY,
}

console.log({
    BASE_TICKER,
    STARTING_BALANCE: STARTING_BALANCE_FROM_ARGV || STARTING_BALANCE_FROM_ENV,
    RPC_URL: getRpcUrl(NETWORK),
    BASE_TOKEN_ADDRESS: getBaseTokenAddress(BASE_TICKER, NETWORK),
    NETWORK,
    PRIVATE_KEY,
})

function getBaseTokenAddress(baseTicker, network) {
    if (network === 'BSC') {
        switch (baseTicker) {
            case 'BUSD':
                return parseAddressCase(TOKENS.bsc.mainnet.BUSD);
            case 'CAKE':
                return parseAddressCase(TOKENS.bsc.mainnet.CAKE);
            default:
                return parseAddressCase(TOKENS.bsc.mainnet.WBNB);
        }
    } else if (network == 'BSC_TESTNET') {
        switch (baseTicker) {
            case 'BUSD':
                return parseAddressCase(TOKENS.bsc.testnet.BUSD);
            case 'CAKE':
                return parseAddressCase(TOKENS.bsc.testnet.CAKE);
            default:
                return parseAddressCase(TOKENS.bsc.testnet.WBNB);
        }
    }
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
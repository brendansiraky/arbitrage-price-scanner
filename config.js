const dotenv =  require('dotenv')
dotenv.config()

const {
    BASE_TICKER,
    NETWORK,
    BSC_RPC_URL,
    ETH_RPC_URL,
} = process.env

module.exports = {
    BASE_TICKER,
    RPC_URL: NETWORK === 'BSC' ? BSC_RPC_URL : ETH_RPC_URL, // Default to ETH if nothing is specified
}
const { Web3Client } = require('../utils/client')
const IUniswapV2Pair = require('../../abi/IUniswapV2Pair.json')

// UniswapV2PairContract
const getV2TokenPairContract = (tokenAddress) => new Web3Client.eth.Contract(
    IUniswapV2Pair.abi,
    tokenAddress,
)

module.exports = { getV2TokenPairContract }
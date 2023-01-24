const { getV2TokenPairContract } = require('./getV2TokenPairContract')

async function getTokenDecimals(tokenAddress) {
    const baseTokenContract = getV2TokenPairContract(tokenAddress)
    const decimals = await baseTokenContract.methods.decimals().call()
    return decimals
}

module.exports = { getTokenDecimals }
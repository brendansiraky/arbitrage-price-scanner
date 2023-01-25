const { Web3Client } = require('../utils/client')
const bscTokens = require('../tokens/bsc.json')
const ethTokens = require('../tokens/eth.json')
const config = require('../../config')

const tokensLookup = config.BASE_TICKER === 'BSC' 
    ? bscTokens 
    : ethTokens

function convertToWei(amount) {
    return Web3Client.utils.toWei(amount, 'ether')
}

function convertFromWei(amountInWei) {
    return Web3Client.utils.fromWei(amountInWei)
}

function toWei(value, decimals) {
    return (value * 10**decimals).toString()  
}

function fromWei(value, decimals) {
    return (value / 10**decimals).toString()
}

module.exports = {
    convertToWei,
    convertFromWei,
    fromWei,
    toWei,
}
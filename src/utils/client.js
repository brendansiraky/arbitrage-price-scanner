const Web3 = require('web3')

const RPC_URL = 'https://bsc-dataseed1.binance.org'
const Web3Client = new Web3(RPC_URL)

module.exports = { Web3Client }
const Web3 = require('web3')
const { RPC_URL } = require('../../config')

const Web3Client = new Web3(RPC_URL)

module.exports = { Web3Client }
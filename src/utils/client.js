const Web3 = require('web3')
const { RPC_URL } = require('../../config')

console.log({RPC_URL})

const Web3Client = new Web3(RPC_URL)

module.exports = {
    Web3Client,
}
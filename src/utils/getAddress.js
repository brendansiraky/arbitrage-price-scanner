const { PRIVATE_KEY } = require('../../config')
const { Web3Client } = require('./client')

const getAddress = () => {
    const { address } = Web3Client.eth.accounts.privateKeyToAccount(PRIVATE_KEY)
    return address
}

module.exports = { getAddress }
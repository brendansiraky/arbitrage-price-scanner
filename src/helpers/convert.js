const { Web3Client } =  require('./client')

function convertToWei(amount) {
    return Web3Client.utils.toWei(amount, 'ether')
}

function convertFromWei(amountInWei) {
    return Web3Client.utils.fromWei(amountInWei)
}

module.exports = {
    convertToWei,
    convertFromWei,
}
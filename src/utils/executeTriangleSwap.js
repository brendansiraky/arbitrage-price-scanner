const { ACCOUNT_ADDRESS, PRIVATE_KEY } = require('../../config')
const { TriangleSwapContract } = require('../../contracts/TriangleSwapContract')
const { Web3Client } = require('./client')

async function executeTriangleSwap(amountIn, pathAddresses) {
    try {
		// // Establishing the nonce and gas price
		const nonce = await Web3Client.eth.getTransactionCount(ACCOUNT_ADDRESS);
	
		// // Retrieve the current gas price
		const gasPrice = await Web3Client.eth.getGasPrice()
	
		// Encoding the function call
		const encodedFunction = TriangleSwapContract.methods.swapTokens(
			amountIn,
			pathAddresses,
		).encodeABI()

		// // build the transction
		const transaction = {
			nonce,
			gasPrice,
			gasLimit: 3000000,
			to: contractAddr,
			data: encodedFunction,
		};

		const signedTransaction = await Web3Client.eth.accounts.signTransaction(transaction, PRIVATE_KEY)
		const transactionReceipt = await Web3Client.eth.sendSignedTransaction(signedTransaction.rawTransaction)
        return transactionReceipt
	
	} catch (err) {
		console.error(err)
	}
}

module.exports = { executeTriangleSwap }
const { PRIVATE_KEY } = require('../../config')
const { TriangleSwapContract, TRIANGLESWAP_CONTRACT_ADDRESS } = require('../../contracts/TriangleSwapContract')
const { Web3Client } = require('./client')
const { getAddress } = require('../utils/getAddress')

async function executeTriangleSwap(amountIn, pathAddresses) {
    try {
		const address = getAddress()
		// // Establishing the nonce and gas price
		console.log('Getting the nonce')
		const nonce = await Web3Client.eth.getTransactionCount(address);
		
		// Encoding the function call
		console.log('Getting the encoded method')
		const encodedFunction = await TriangleSwapContract.methods.swapTokens(
			amountIn,
			pathAddresses,
		).encodeABI()

		// Get the estimated gas price
		console.log('Estimating the gas')
		const estimatedGas = await TriangleSwapContract.methods.swapTokens(
			amountIn,
			pathAddresses,
		).estimateGas({
			from: address
		})
		
		// build the transction
		console.log('Building the transaction')
		const transaction = {
			nonce,
			gas: estimatedGas.toString(),
			// gas: '739190',
			to: TRIANGLESWAP_CONTRACT_ADDRESS,
			data: encodedFunction,
		}

		console.log(`Signing Transaction`)
		const signedTransaction = await Web3Client.eth.accounts.signTransaction(transaction, PRIVATE_KEY)

		console.log(`Sending Transaction`)
		const transactionReceipt = await Web3Client.eth.sendSignedTransaction(signedTransaction.rawTransaction)
		console.log(transactionReceipt)
	
	} catch (err) {
		console.error(err)
	}
}

module.exports = { executeTriangleSwap }
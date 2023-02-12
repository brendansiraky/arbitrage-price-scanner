const { PRIVATE_KEY } = require('../../config')
const { MultiExchangeSwapContract, MULTIEXCHANGESWAP_CONTRACT_ADDRESS } = require('../../contracts/MultiExchangeSwapContract')
const { Web3Client } = require('./client')
const { getAddress } = require('../utils/getAddress')

async function executeMultiExchangeSwap(amountIn, tokenOne, tokenTwo, routerAddressOne, routerAddressTwo, onSuccess) {
	console.log('executeMultiExchangeSwap was called')
    try {
		console.log('getting the address')
		const address = getAddress()
		// // Establishing the nonce and gas price
		console.log('Getting the nonce')
		const nonce = await Web3Client.eth.getTransactionCount(address);
		
		// Encoding the function call
		console.log('Getting the encoded method')
		const encodedFunction = await MultiExchangeSwapContract.methods.swapTokens(
			amountIn,
			tokenOne,
			tokenTwo,
            routerAddressOne,
            routerAddressTwo,
		).encodeABI()

		// Get the estimated gas price
		console.log('Estimating the gas')
		const estimatedGas = await MultiExchangeSwapContract.methods.swapTokens(
			amountIn,
			tokenOne,
			tokenTwo,
            routerAddressOne,
            routerAddressTwo,
		).estimateGas({
			from: address
		})
		
		// build the transction
		console.log('Building the transaction')
		const transaction = {
			nonce,
			gas: estimatedGas.toString(),
			to: MULTIEXCHANGESWAP_CONTRACT_ADDRESS,
			data: encodedFunction,
		}

		console.log(`Signing Transaction`)
		const signedTransaction = await Web3Client.eth.accounts.signTransaction(transaction, PRIVATE_KEY)

		console.log(`Sending Transaction`)
		const transactionReceipt = await Web3Client.eth.sendSignedTransaction(signedTransaction.rawTransaction)
		onSuccess(transactionReceipt)
	
	} catch (err) {
		console.error(err.message)
	}
}

module.exports = { executeMultiExchangeSwap }
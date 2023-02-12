const { PRIVATE_KEY } = require('./config')

const { Web3Client } = require('./src/utils/client')
const { getAddress } = require('./src/utils/getAddress')

const MultiExchangeSwap = require('./abi/MultiExchangeSwap.json')

const MULTIEXCHANGESWAP_CONTRACT_ADDRESS = '0xc58E2A28E016E1e70895266Ab42C622edCeEC3Bd'
const MultiExchangeSwapContract = new Web3Client.eth.Contract(
	MultiExchangeSwap,
	MULTIEXCHANGESWAP_CONTRACT_ADDRESS
)

async function executeMultiExchangeSwap(amountIn, pathAddresses, startingRouterAddress, endingRouterAddress, onSuccess) {
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
			pathAddresses,
            startingRouterAddress,
            endingRouterAddress
		).encodeABI()

		// Get the estimated gas price
		console.log('Estimating the gas')
		const estimatedGas = await MultiExchangeSwapContract.methods.swapTokens(
			amountIn,
			pathAddresses,
            startingRouterAddress,
            endingRouterAddress
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

		console.log(transactionReceipt)
	
	} catch (err) {
		console.error(err.message)
	}
}

executeMultiExchangeSwap(
	'900000000000000',
	[
		"0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd", // WBNB
		"0xFa60D973F7642B748046464e165A65B7323b0DEE",
	],
	"0xD99D1c33F9fC3444f8101754aBC46c52416550D1", // startingRouter
	"0xD99D1c33F9fC3444f8101754aBC46c52416550D1" // endingRouter
)


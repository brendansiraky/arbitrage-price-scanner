const fs = require('fs');
const { ACCOUNT_ADDRESS, PRIVATE_KEY, BASE_TOKEN_ADDRESS } = require("./config")
const { getProfitablePath } = require("./src/utils/getProfitablePath")
const { executeTriangleSwap } = require("./src/utils/executeTriangleSwap")
const { toWei } = require("./src/helpers/convert")
const { getTokenLookup } = require("./src/utils/tokenLookup")

const tokenLookup = getTokenLookup()
const startingAmount = 1 // WBNB

getProfitablePath(startingAmount)
	.then(path => {
		if (!path) {
			console.log(`No profitable paths found`)
		} else {
			console.log(`Found a profitable trade!`)
			const jsonToWrite = {
				...path,
				gain: `${(((path.finalLiquidity - startingAmount) / startingAmount) * 100).toFixed(6)}%`
			}
			fs.writeFileSync(`${__dirname}/logs/${Date()}.json`, JSON.stringify(jsonToWrite, null, 2))

			// const startingAmount = toWei(1, tokenLookup[BASE_TOKEN_ADDRESS].decimals)
			// executeTriangleSwap(
			// 	startingAmount,
			// 	path.tokenPath
			// )
		}
	})

setInterval(() => {

}, 30000)

// const DAI = '0xDF1742fE5b0bFc12331D8EAec6b478DfDbD31464'
// const USDC = '0xA2025B15a1757311bfD68cb14eaeFCc237AF5b43'
// const WBNB = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'
// const BUSD = '0xe9e7cea3dedca5984780bafc599bd69add087d56'

// makeTrade(
// 	'40000000000000000000', // 10 DAI
// 	[DAI, USDC, DAI] // DAI -> USDC
// )

// getReserves()
// getTradingPairs()
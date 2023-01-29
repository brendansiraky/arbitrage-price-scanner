const fs = require('fs');
const { ACCOUNT_ADDRESS, PRIVATE_KEY, BASE_TOKEN_ADDRESS } = require("./config")
const { getProfitablePath } = require("./src/utils/getProfitablePath")
const { executeTriangleSwap } = require("./src/utils/executeTriangleSwap")
const { toWei } = require("./src/helpers/convert")
const { getTokenLookup } = require("./src/utils/tokenLookup")

const tokenLookup = getTokenLookup()
const startingAmount = 1 // WBNB

setInterval(() => {
	try {
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
		
					// FOR WHEN WE START ACTUALLY EXECUTING TRADES
					// const startingAmount = toWei(1, tokenLookup[BASE_TOKEN_ADDRESS].decimals)
					// executeTriangleSwap(
					// 	startingAmount,
					// 	path.tokenPath
					// )
				}
			})
			// Every 30 seconds
	} catch (err) {
		console.error(`Error caught in setInterval`)
	}
}, 30000)
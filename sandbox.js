const { PRIVATE_KEY, ACCOUNT_ADDRESS } = require("./config")
const { Web3Client } = require("./src/utils/client")
const { getAddress } = require("./src/utils/getAddress")

const WBNB_PRICE = 300
const etherCost = 0.00088
const finalLiquidity = 1.0049779685177045
const startingBalance = 1

// console.log(`${(((finalLiquidity - startingBalance) / startingBalance) * 100).toFixed(6)}%`)
// console.log(finalLiquidity > startingBalance * 1.0008)

// console.log((finalLiquidity * 300))

// console.log(Web3Client.utils.)

// Add 0.4% on
console.log((startingBalance * 1.004) > finalLiquidity)

// execute()

// Web3Client.eth.getBlock("latest").then(block => console.log(block.gasLimit / block.transactions.length))
// console.log("gasLimit: " + block.gasLimit);


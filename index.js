const fs = require('fs');
const { BASE_TOKEN_ADDRESS } = require("./config")
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
        
                    const startingAmount = toWei(1, tokenLookup[BASE_TOKEN_ADDRESS].decimals)
        
                    // executeTriangleSwap(
                    // 	startingAmount,
                    // 	path.tokenPath
                    // )
                }
            })
    } catch (err) {
        console.error(`Something went wrong inside the setInterval - ${err}`)
    }
    // Every 30 Seconds
}, 30000)



const fs = require('fs');
const { BASE_TOKEN_ADDRESS } = require("./config")
const { getProfitablePath } = require("./src/utils/getProfitablePath")
const { executeTriangleSwap } = require("./src/utils/executeTriangleSwap")
const { toWei } = require("./src/helpers/convert")
const { getTokenLookup } = require("./src/utils/tokenLookup")

const tokenLookup = getTokenLookup()
const startingBalance = 1 // WBNB

setInterval(() => {
    try {
        
    } catch (err) {
        console.error(`Something went wrong inside the setInterval - ${err}`)
    }
    // Every 30 Seconds
}, 30000)


getProfitablePath(startingBalance)
        .then(path => {
            if (!path) {
                console.log(`No profitable paths found`)
            } else {
                console.log(`Found a profitable trade!`)

                const gain = `${(((path.finalLiquidity - startingBalance) / startingBalance) * 100).toFixed(6)}%`

                const onSuccess = (receipt) => {
                    console.log('Successfully Executed Trade! Logging trade details and receipt!')
                    const jsonToWrite = {
                        ...path,
                        gain,
                        receipt
                    }

                    fs.writeFileSync(`${__dirname}/logs/${Date()}.json`, JSON.stringify(jsonToWrite, null, 2))
                    console.log(jsonToWrite)
                }
                
                const startingAmount = toWei(1, tokenLookup[BASE_TOKEN_ADDRESS].decimals)
                
                console.log(`Attempting to execute profitable trade!`)
                console.log(JSON.stringify({
                    gain,
                    path: path.cycleNodes
                }, null, 2))

                executeTriangleSwap(
                    startingAmount,
                    path.tokenPath,
                    onSuccess
                )
            }
        })
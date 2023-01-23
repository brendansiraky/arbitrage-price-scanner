const fs = require('fs');
const { convertToWei, convertFromWei } = require('../helpers/convert');

async function executeMultiExchangeSwap(
    firstTradeFunction,
    secondTradeFunction,
    startBalanceNotInWei,
    tokenSwapArray
) {
    try {

        const { tradingPair, basePairName } = tokenSwapArray

        // Convert the starting balance to wei as this is what the trading function expects as the amount value.
        const startingBalanceInWei = convertToWei(startBalanceNotInWei)
    
        // Execute the trade and convert the first element of the tradingPair to the second.
        const outputTokenBalance = await firstTradeFunction(startingBalanceInWei, tradingPair)
        if (!outputTokenBalance) throw new Error('The outputTokenBalance was undefined, probably meaning that this trade was unable to take place on this exchange due to no liquidity or not existing')

        // Reverse the tradingPair to trade it back.
        const finalOutputTokenBalance = await secondTradeFunction(outputTokenBalance, tradingPair.reverse())
        if (!finalOutputTokenBalance) throw new Error('The finalOutputTokenBalance was undefined, probably meaning that this trade was unable to take place on this exchange due to no liquidity or not existing')
        
        const endingBalanceAsANumber = Number(((finalOutputTokenBalance - startingBalanceInWei) / startingBalanceInWei))
        const endingBalanceAsAPercentage = `${(((finalOutputTokenBalance - startingBalanceInWei) / startingBalanceInWei) * 100).toFixed(4)}%`
        const endingBalanceNoInWei = convertFromWei(finalOutputTokenBalance)
    
        if (endingBalanceAsANumber > 0) {
            const date = new Date()
            const jsonToLog = JSON.stringify(
                {
                    date,
                    fromAddress: tradingPair[0],
                    toAddress: tradingPair[1],
                    basePairName, 
                    inputAmount: startBalanceNotInWei,
                    outputAmount: endingBalanceNoInWei,
                    gainOrLoss: endingBalanceNoInWei - startBalanceNotInWei
                },
                null,
                2
            )
    
            // Technically this trade will be profitable.
            // For now, let's just save it as a log in a json file.
            const dateName = `${date.toString()}`
            fs.writeFile(`${__dirname}/src/logs/trades/${dateName}.json`, jsonToLog, function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            }); 
        }
    
        console.log(`
            Pair Name: ${basePairName} \n

            Starting Balance: ${convertFromWei(startingBalanceInWei)} \n
            Ending Balance ${convertFromWei(finalOutputTokenBalance)} \n
    
            Ending Difference in percentage: ${endingBalanceAsAPercentage}
            Ending Difference: ${endingBalanceAsANumber}
        `)
    } catch (err) {
        console.error(`Error from executeMultiExchangeSwap - ${err}`)   
    }
}

module.exports = { executeMultiExchangeSwap }
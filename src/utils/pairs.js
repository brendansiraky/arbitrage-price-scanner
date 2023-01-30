const fs = require('fs')

const { getTradingPairs } = require('./getTradingPairs')

const PATH_TO_FILE = `${__dirname}/../../tokenPairs.json`

// Responsible for fetching pairs from Coingecko and saving them into a JSON file.
// Probably try periodically try and call this function to make the json file
async function savePairsToJson(pages) {
    const tradingPairs = await getTradingPairs(pages)
    fs.writeFileSync(PATH_TO_FILE, JSON.stringify(tradingPairs, null, 2))
    return tradingPairs
}

async function readSavedPairs(pages) {
    try {
        let parsedTokenPairs;
    
        if (!fs.existsSync(PATH_TO_FILE)) {
            const tokenPairs = await savePairsToJson(pages)
            parsedTokenPairs = tokenPairs
        } else {
            const tokenPairs = fs.readFileSync(PATH_TO_FILE)
            parsedTokenPairs = JSON.parse(tokenPairs)
        }
    
        return parsedTokenPairs
    } catch (err) {
        console.error(`Error when calling readSavedPairs with - ${err}`)
    }
}

module.exports = {
    readSavedPairs,
    savePairsToJson,
}
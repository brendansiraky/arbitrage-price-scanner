const fs = require('fs')

const { fetchTradingPairs } = require('./fetchTradingPairs')

// Responsible for fetching pairs from Coingecko and saving them into a JSON file.
// Probably try periodically try and call this function to make the json file
async function savePairsToJson(pages, path, exchange) {
    const tradingPairs = await fetchTradingPairs(pages, exchange)
    fs.writeFileSync(path, JSON.stringify(tradingPairs, null, 2))
    return tradingPairs
}

async function getTradingPairs(pages, exchange = 'pancakeswap_new') {
    const path = `${__dirname}/../../pairs/${exchange}/tokenPairs.json`

    try {
        let parsedTokenPairs;
    
        if (!fs.existsSync(path)) {
            const tokenPairs = await savePairsToJson(pages, path, exchange)
            parsedTokenPairs = tokenPairs
        } else {
            const tokenPairs = fs.readFileSync(path)
            parsedTokenPairs = JSON.parse(tokenPairs)
        }
    
        return parsedTokenPairs
    } catch (err) {
        console.error(`Error when calling getTradingPairs with - ${err}`)
    }
}


function generateTradingPairs() {
    const exchange = 'biswap'
    const path = `${__dirname}/../../pairs/${exchange}/tokenPairs.json`
    savePairsToJson(5, path, exchange)
}
// generateTradingPairs()

module.exports = { getTradingPairs }
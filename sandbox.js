const fetch = require('node-fetch')
const { COINMARKET_CAP_API_KEY } = require('./config')

const fs = require('fs');

// https://api.coingecko.com/api/v3/exchanges/pancakeswap_new

async function fetchData() {
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/exchanges/pancakeswap_new/tickers`, {
            method: 'GET',
        })

        const result = await response.json()

        const tickers = JSON.stringify(result.tickers, null, 2)

        fs.writeFile(`${__dirname}/tickers.json`, tickers, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        }); 

    } catch (error) {
        console.error(error)
    }
}

fetchData()
const Big = require('big.js')

const getReserves = async (ContractObj) => {
    // call getReserves function of Pair contract
    const reserves = await ContractObj.methods.getReserves().call()

    /*
        // To get exchange rate
        console.log(
            `Price: ${Big(reserves._reserve0).div(Big(reserves._reserve1)).toString()}`
        );
    */

    // return data in Big Number
    return [Big(reserves._reserve0), Big(reserves._reserve1)]
}

module.exports = { getReserves }
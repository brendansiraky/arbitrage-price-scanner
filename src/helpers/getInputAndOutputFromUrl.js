const { parseAddressCase } = require('../helpers/parseAddressCase')

function getInputAndOutputFromUrl(url) {
    const inputSubString = 'inputCurrency='
    const outputSubString = 'outputCurrency='
    const indexOfInputCurrency = url.indexOf(inputSubString)
    const indexOfOutputCurrency = url.indexOf(outputSubString)

    const inputCurrency = parseAddressCase(url.slice(indexOfInputCurrency + inputSubString.length, indexOfOutputCurrency - 1))
    const outputCurrency = parseAddressCase(url.slice(indexOfOutputCurrency + outputSubString.length))

    return parseInt(inputCurrency, 16) < parseInt(outputCurrency, 16) ? [inputCurrency, outputCurrency] : [outputCurrency, inputCurrency]
}

module.exports = { getInputAndOutputFromUrl }

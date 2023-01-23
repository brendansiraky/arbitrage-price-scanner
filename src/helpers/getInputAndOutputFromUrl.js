function getInputAndOutputFromUrl(url) {
    const inputSubString = 'inputCurrency='
    const outputSubString = 'outputCurrency='
    const indexOfInputCurrency = url.indexOf(inputSubString)
    const indexOfOutputCurrency = url.indexOf(outputSubString)

    const inputCurrency = url.slice(indexOfInputCurrency + inputSubString.length, indexOfOutputCurrency - 1)
    const outputCurrency = url.slice(indexOfOutputCurrency + outputSubString.length)

    return [
        inputCurrency,
        outputCurrency
    ]
}

module.exports = { getInputAndOutputFromUrl }
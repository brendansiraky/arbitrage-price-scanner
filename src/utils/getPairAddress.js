async function getPairAddress(
    factoryAbi,
    factoryContractAddress,
    token1,
    token2
) {
    try {
        // We use the factory contract to get the pair address
        const FactoryContract = new Web3Client.eth.Contract(factoryAbi, factoryContractAddress)

        const address = await FactoryContract.methods.getPair(token1, token2).call()
        return address
    } catch (err) {
        console.err(`Error when calling getPairAddress with error - ${err}`)
    }
}

module.exports = { getPairAddress }
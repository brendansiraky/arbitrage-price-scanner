function toWei(value, decimals) {
    return (value * 10**decimals).toString()  
}

function fromWei(value, decimals) {
    return (value / 10**decimals).toString()
}

module.exports = {
    fromWei,
    toWei,
}
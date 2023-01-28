function parseAddressCase(address) {
    const rest = address.slice(2).toUpperCase();
    return `0x${rest}`
}

module.exports = { parseAddressCase }
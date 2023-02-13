const { executeMultiExchangeScan } = require('./src/utils/executeMultiExchangeScan')
const { executeTriangleScan } = require('./src/utils/executeTriangleScan')

setInterval(() => {
    executeMultiExchangeScan()
    // Every 10 Seconds
}, 10000)
// executeTriangleScan()

const { executeMultiExchangeScan } = require('./src/utils/executeMultiExchangeScan')
const { executeTriangleScan } = require('./src/utils/executeTriangleScan')

setInterval(() => {
    executeMultiExchangeScan()
    // Every 20 Seconds
}, 20000)
// executeTriangleScan()

const { getTradingPairs } = require("./src/utils/pairs")

async function execute() {
	const tradingPairs = await getTradingPairs(2, 'biswap')
}

execute()


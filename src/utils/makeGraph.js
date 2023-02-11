const { fromWei } = require('../helpers/convert')
const { getReserves } = require('../utils/getReserves')
const { getTradingPairs } = require('./pairs')
const { getTokenLookup } = require('./tokenLookup')

function calculateExchange(liquidity, fromNode) {

	const toNode = this.node0 === fromNode ? this.node1 : this.node0
	const toReserve = this.node0 === fromNode ? this.reserve1 : this.reserve0
	
	const fromReserve = this.node0 === fromNode ? this.reserve0 : this.reserve1

	const token0Decimals = fromNode.decimals
	const token1Decimals = toNode.decimals
	
	// USDC 49,651,433
	const reserve0 = fromWei(fromReserve, token0Decimals)
	
	// ETH 31,300
	const reserve1 = fromWei(toReserve, token1Decimals)

	// USDC per ETH = 0.0006
	const exchangeRate = (reserve1 / reserve0)

	return (exchangeRate * liquidity) * (1 - 0.0025) // 0.25% is the LP fee that is taken from most Dex's
}

function createEdge(node0, node1, reserve0, reserve1, pairAddress) {
	return {
		node0,
		node1,
		reserve0,
		reserve1,
		pairAddress,
		calculateExchange
	}
}

const tokenLookup = getTokenLookup()

const PAGES = 2
const EXCHANGE = 'pancakeswap_new'

async function makeGraph() {
    // A graph is an array of nodes, each node having an ID, and an array of edges, each edge has 2 nodes.
	
	const tradingPairs = await getTradingPairs(PAGES, EXCHANGE)
	const reserves = await getReserves(tradingPairs)

    const createNode = (address) => ({
        address,
		decimals: tokenLookup[address].decimals,
        edges: []
    })

    const buildNodes = reserves.reduce((acc, { token0, token1, reserve0, reserve1, pairAddress }) => {
        // make the nodes for the current coin ids if they haven't already been made
        if (!acc[token0]) {
            acc[token0] = createNode(token0)
        }
    
        if (!acc[token1]) {
            acc[token1] = createNode(token1)
        }
    
        // now make the edge that holds the two nodes
        const edge = createEdge(
			acc[token0], 
			acc[token1],
			reserve0,
			reserve1,
			pairAddress
		)
    
        // now push this edge onto the list of edges for each node
        acc[token0].edges.push(edge)
        acc[token1].edges.push(edge)

        return acc
    }, {})

	return buildNodes	
}

module.exports = { makeGraph }
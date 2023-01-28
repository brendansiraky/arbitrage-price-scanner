const { Web3Client } = require("./src/utils/client")
const Big = require('big.js')
const IUniswapV2Pair = require('./abi/IUniswapV2Pair.json')
const { uniqBy } = require('lodash')

const { fromWei } = require('./src/helpers/convert')
const { getInputAndOutputFromUrl } = require('./src/helpers/getInputAndOutputFromUrl')
const { getTokenLookup } = require('./src/utils/tokenLookup')
const { parseAddressCase } = require("./src/helpers/parseAddressCase")

/// 0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc

// const Contract = new Web3Client.eth.Contract(
	// 	IUniswapV2Pair.abi,
	// 	'0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc' // ETH/USDC on MAINNET
	// )

const abi = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_factory",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "token0",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "token1",
						"type": "address"
					}
				],
				"internalType": "struct TokenReserves.Tokens[]",
				"name": "inputTokens",
				"type": "tuple[]"
			}
		],
		"name": "getPairAddresses",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "token0",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "reserve0",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "token1",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "reserve1",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "pairAddress",
						"type": "address"
					}
				],
				"internalType": "struct TokenReserves.Reserves[]",
				"name": "reserves",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

const contractAddress = '0xAf3cdAbA1B917c9bB729BD2cD68a3caBcC9A0d55'

const TokenReserves = new Web3Client.eth.Contract(
    abi,
    contractAddress
)

const tokenLookup = getTokenLookup()

async function getTradingPairs(pages = 1) {
    let pairs = []

    for (let i = 0; i < pages; i++) {
        const response = await fetch(`https://api.coingecko.com/api/v3/exchanges/pancakeswap_new/tickers?page=${i + 1}`)
        const result = await response.json()
        pairs.push(...result.tickers)
	}

	const mapped = pairs.map(pair => getInputAndOutputFromUrl(pair.trade_url))

	const filteredMapped = mapped.filter((entry) => {
		const token0 = entry[0]
		const token1 = entry[1]
		return tokenLookup[token0] && tokenLookup[token1]
	})

	if (filteredMapped.length < mapped.length) {
		console.log('Had to remove pairs because they werent contained in the token Lookup. Consider updating the json file')
	}

	return uniqBy(filteredMapped, (x) => `${x[0]}${x[1]}`)
}

async function getReserves() {
	const tradingPairs = await getTradingPairs(2)
    try {
        const reserves = await TokenReserves.methods.getPairAddresses(
			tradingPairs,
		).call()
		return reserves.map(r => ({
			...r,
			token0: parseAddressCase(r.token0),
			token1: parseAddressCase(r.token1),
			pairAddress: parseAddressCase(r.pairAddress)
		}))
		
    } catch (err) {
        console.error(`Caught error in getReserves: ${err}`)
    }
}

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

	return (exchangeRate * liquidity) * (1 - 0.0025)
}

const createEdge = (node0, node1, reserve0, reserve1, pairAddress) => {
	return {
		node0,
		node1,
		reserve0,
		reserve1,
		pairAddress,
		calculateExchange
	}
}

async function makeGraph() {
    // A graph is an array of nodes, each node having an ID, and an array of edges, each edge has 2 nodes.
	const reserves = await getReserves()

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

	// console.log(JSON.stringify(Object.values(buildNodes).map(nodeToString), null, 2))

	return buildNodes	
}

function edgeToString(edge) {
	return `pairAddress - ${edge.pairAddress} node0 - ${edge.node0.address} node1 - ${edge.node1.address}`
	return edge
}

function nodeToString(node) {
	return `address - ${node.address} edges - ${node.edges.map(edgeToString)}`
}

function findCycles(startingNode, initialLiquidity) {
	let cycles = [];

	function findCyclesInner(currentNode, previousEdge, pathSoFar, currentLiquidity) {
		for (const edge of currentNode.edges) {
			if (edge === previousEdge) {
				continue;
			}

			const nextNode = edge.node0 === currentNode ? edge.node1 : edge.node0

			const nextLiquidity = edge.calculateExchange(currentLiquidity, currentNode)

			if (nextNode === startingNode) {
				cycles.push({
					cycle: {
						nodes: [
							...pathSoFar.nodes,
							nextNode,
						],
						edges: [
							...pathSoFar.edges,
							edge,
						]
					},
					finalLiquidity: nextLiquidity
				})
				return
			}

			if (!pathSoFar.nodes.includes(nextNode)) {
				findCyclesInner(
					nextNode, 
					edge,
					{
						nodes: [
							...pathSoFar.nodes,
							nextNode,
						],
						edges: [
							...pathSoFar.edges,
							edge,
						]
					},
					nextLiquidity
				)
			}

		}

	}
	
	findCyclesInner(
		startingNode,
		null,
		{
			nodes: [startingNode],
			edges: []
		},
		initialLiquidity
	)

	return cycles
}

makeGraph()
	.then(nodes => {
		const startingNode = nodes[parseAddressCase('0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c')]
		if (!startingNode) {
			console.error(`Could not initialise findCycles with our startingNode address`)
		} else {
			const cycles = findCycles(startingNode, 1)

			const mapped = cycles.map(({ cycle, finalLiquidity }) => {
				return {
					finalLiquidity,
					cycleNodes: cycle.nodes.map(n => tokenLookup[n.address].symbol),
					cycleEdges: cycle.edges.map(n => n.pairAddress)
				}
			})

			console.log(mapped)
		}
	})

// getReserves()
// getTradingPairs()
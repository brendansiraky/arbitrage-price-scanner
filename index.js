const { Web3Client } =  require('./src/utils/client.js')
const BigNumber = require('big.js')
const { getRandomEntryFromArray } = require('./src/helpers/getRandomEntryFromArray')
const { executeMultiExchangeSwap } = require('./src/utils/executeMultiExchangeSwap')
const { simulateSimpleSwap } = require('./src/utils/simulateSimpleSwap')

const _ = require('lodash')

const { getV2TokenPairContract } = require('./src/utils/getV2TokenPairContract')

const { PancakeSwapRouter, UniswapRouter } = require('./src/contracts/routers')

const { getPairs } = require('./src/utils/getPairs.js');
const { convertToWei, convertFromWei } = require('./src/helpers/convert.js')
const { simulateTriangleSwap } = require('./src/utils/simulateTriangleSwap.js')
const { getTokenDecimals } = require('./src/utils/getTokenDecimals.js')
const config = require('./config.js')

// // Closure function that wraps over the UNISWAP router 
// async function uniswapTrade(amount, pairsArray) {
//     return executeTrade(UniswapRouter, amount, pairsArray)
// }

// // Closure function that wraps over the PANCAKESWAP router 
// async function pancakeTrade(amount, pairsArray) {
//     return executeTrade(PancakeSwapRouter, amount, pairsArray)
// }

// // Closure function that wraps over the BISWAP router
// async function biswapTrade(amount, pairsArray) {
//     return executeTrade(BiswapRouter, amount, pairsArray)
// }

// const amountInUSDC = '100' / 10**6 // $100

async function executeScan() {
    // Get the pairs that crossover between these 2 exchanges
    // const pairs = await getPairs(['pancakeswap_new'], baseTokenInfo)

    // const randomPair = getRandomEntryFromArray(pairs)

    // executeSimpleTrade(
    //     pancakeTrade,
    //     '1',
    //     randomPair
    // )


    try {
        // const amountsOutFirst = await UniswapRouter.methods.getAmountsOut(amountInEth, [USDC, WETH]).call()
        // const amountsOutSecond = await UniswapRouter.methods.getAmountsOut(amountsOutFirst[1], [WETH, USDC]).call()

        // console.log(amountsOutSecond[1] / 10**6)

        // const bigNumber = new BigNumber()
        // console.log(amountsOut)

        // const num = convertFromWei(amountsOut[1] / 10**6)
        // const usdcOutput = new BigNumber(amountsOut[1]).div(10 ** 6)
        // console.log(usdcOutput.toFixed(2))

    } catch (err) {
        console.error(`Error from getAmountsOut - ${err}`)
    }
}

async function getTradingPairs(pages = 1) {
    let pairs = []

    for (let i = 0; i < pages; i++) {
        const response = await fetch(`https://api.coingecko.com/api/v3/exchanges/pancakeswap_new/tickers?page=${i + 1}`)
        const result = await response.json()
        pairs.push(...result.tickers)
    }

    return pairs
}


/*
    [
        BNB,
        CAKE,
        BUSD,
    ]

{
    base: '0X0E09FABB73BD3ADE0A17ECC321FD13A19E81CE82',
    target: 'WBNB',
    market: {
        name: 'PancakeSwap (v2)',
        identifier: 'pancakeswap_new',
        has_trading_incentive: false
    },
    last: 0.0129225414917392,
    volume: 748453.3375587577,
    converted_last: { btc: 0.00017107, eth: 0.00250167, usd: 3.86 },
    converted_volume: { btc: 128.562, eth: 1880, usd: 2904288 },
    trust_score: 'green',
    bid_ask_spread_percentage: 0.602713,
    timestamp: '2023-01-25T03:31:10+00:00',
    last_traded_at: '2023-01-25T03:31:10+00:00',
    last_fetch_at: '2023-01-25T03:31:10+00:00',
    is_anomaly: false,
    is_stale: false,
    trade_url: 'https://pancakeswap.finance/swap?inputCurrency=0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82&outputCurrency=0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    token_info_url: null,
    coin_id: 'pancakeswap-token',
    target_coin_id: 'wbnb'
}

*/



async function makeGraph() {
    // A graph is an array of nodes, each node having an ID, and an array of edges, each edge has 2 nodes.

    const tradingPairs = await getTradingPairs()

    const createNode = id => ({
        id,
        edges: []
    })

    const createEdge = (node1, node2) => ({
        node1,
        node2
    })

    const buildNodes = tradingPairs.reduce((acc, { coin_id, target_coin_id }) => {
        // make the nodes for the current coin ids if they haven't already been made
        if (!acc[coin_id]) {
            acc[coin_id] = createNode(coin_id)
        }
    
        if (!acc[target_coin_id]) {
            acc[target_coin_id] = createNode(target_coin_id)
        }
    
        // now make the edge that holds the two nodes
        const edge = createEdge(acc[coin_id], acc[target_coin_id])
    
        // now push this edge onto the list of edges for each node
        acc[coin_id].edges.push(edge)
        acc[target_coin_id].edges.push(edge)
    
        return acc
    }, {})

    return buildNodes
}




// A node will have any number of edges
// Don't go backwards
// Edges will only ever have 2 noes
function findPath(startingNode) {

    function searchEdges({ output, previousNode }, edge) {

        const nodeWeCareAbout = edge.node1.id !== previousNode.id ? edge.node1 : edge.node2

        const accValue = {
            output: [
                ...output,
                nodeWeCareAbout.id,
            ],
            previousNode: nodeWeCareAbout
        }

        if (nodeWeCareAbout.id === startingNode.id) {
            return accValue
        }
        
        return nodeWeCareAbout.edges.filter(e => e !== edge).reduce(searchEdges, accValue)
    }

    return searchEdges({
        output: [startingNode.id],
        previousNode: startingNode
    }, startingNode.edges[0])
}

makeGraph().then(nodes => {
    const wbnbNode = nodes.wbnb

    const reduced = wbnbNode.edges.reduce((acc, { node1, node2 }, idx) => {
        if (idx > 1) return acc
        const randomNode1 = getRandomEntryFromArray(node1.edges).node1
        const nodeWeCareAbout = randomNode1 !== acc.previousNode.id ? randomNode1 : node2

        return {
            output: [
                ...acc.output,
                nodeWeCareAbout.id
            ],
            previousNode: nodeWeCareAbout
        }
    }, {
        output: [wbnbNode.id],
        previousNode: wbnbNode
    })

    console.log(reduced)

})


// const bnbNode = {
//     id: 'wbnb',
//     edges: []
// }

// const pooNode = {
//     id: 'poo',
//     edges: []
// }

// const busdNode = {
//     id: 'busd',
//     edges: []
// }

// const bnbPooEdge = {
//     node1: bnbNode,
//     node2: pooNode,
// }

// const pooBusdEdge = {
//     node1: pooNode,
//     node2: busdNode,
// }

// const busdBnbEdge = {
//     node1: busdNode,
//     node2: bnbNode,
// }

// bnbNode.edges = [
//     bnbPooEdge,
//     busdBnbEdge,
// ]

// pooNode.edges = [
//     bnbPooEdge,
//     pooBusdEdge,
// ]

// busdNode.edges = [
//     pooBusdEdge,
//     busdBnbEdge,
// ]

// makeGraph()

/*
    [
        'WBNB',
        'POO',
        'BUSD',
        'WBNB',
    ]
*/

// executeTriangleArbitrageScan()
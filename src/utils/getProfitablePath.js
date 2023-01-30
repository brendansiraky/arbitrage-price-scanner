const { parseAddressCase } = require('../helpers/parseAddressCase')
const { findCycles } = require('./findCycles')
const { makeGraph } = require('./makeGraph')
const { getTokenLookup } = require('./tokenLookup')

const tokenLookup = getTokenLookup()

async function getProfitablePath(startingBalance) {
    if (!startingBalance) throw new Error('Need to supply a starting balance')
    const nodes = await makeGraph()
    
    const startingNode = nodes[parseAddressCase('0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c')]
        if (!startingNode) {
            console.error(`Could not initialise findCycles with our startingNode address`)
        } else {
            const cycles = findCycles(startingNode, startingBalance)

            const mappedPath = cycles.map(({ cycle, finalLiquidity }) => {
                return {
                    finalLiquidity,
                    cycleNodes: cycle.nodes.map(n => tokenLookup[n.address].symbol),
                    cycleEdges: cycle.edges.map(n => n.pairAddress),
                    tokenPath: cycle.nodes.map(n => tokenLookup[n.address].address)
                }
            }).sort((a, b) => a.finalLiquidity - b.finalLiquidity)

            const filteredPath = mappedPath.filter(path => path.finalLiquidity > (startingBalance * 1.004)) // 0.4%

            return filteredPath[mappedPath.length - 1]
        }
}

module.exports = { getProfitablePath }
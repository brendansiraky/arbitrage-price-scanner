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

module.exports = { findCycles }
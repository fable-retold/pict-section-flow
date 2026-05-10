const libCoerce = require('../layouts/Layout-Coerce.js');

/**
 * Edge-OrthogonalSnap
 *
 * Demonstrates the "edge theme can affect node placement" axis. Same
 * right-angle routing as Edge-Orthogonal, but with an `AdjustLayout`
 * pass that snaps every node's X/Y to a grid so corner segments line
 * up cleanly across the diagram.
 *
 * Trade-off: nodes shift slightly from the layout's natural positions
 * to gain visual alignment. The user opts into this by picking the
 * theme — the layout algorithm itself is unaware.
 */
module.exports =
{
	Name: 'OrthogonalSnap',
	Label: 'Orthogonal (snap to grid)',
	Description: 'Right-angle routing; snaps node positions to a grid for cleaner corner alignment. Demonstrates an edge theme that adjusts node placement.',

	GeneratePath: function (pContext)
	{
		let tmpHelpers = pContext.Helpers;
		let tmpSrc = pContext.Source;
		let tmpTgt = pContext.Target;
		let tmpData = (pContext.Connection && pContext.Connection.Data) || {};

		let tmpCorners = null;
		if (tmpData.HandleCustomized && tmpData.OrthoCorner1X != null)
		{
			tmpCorners =
			{
				corner1: { x: tmpData.OrthoCorner1X, y: tmpData.OrthoCorner1Y },
				corner2: { x: tmpData.OrthoCorner2X, y: tmpData.OrthoCorner2Y }
			};
		}

		return tmpHelpers.generateOrthogonal(tmpSrc, tmpTgt, tmpCorners, tmpData.OrthoMidOffset || 0);
	},

	/**
	 * Snap each node's (X, Y) to the configured grid after the layout
	 * has run. Mutates pNodes in place.
	 *
	 * @param {Array} pNodes
	 * @param {Array} pConnections
	 * @param {Object} pParameters
	 */
	AdjustLayout: function (pNodes, pConnections, pParameters)
	{
		let tmpGridSize = libCoerce.toFloat((pParameters || {}).GridSize, 20);
		if (tmpGridSize <= 0) return;

		for (let i = 0; i < pNodes.length; i++)
		{
			let tmpNode = pNodes[i];
			if (typeof tmpNode.X !== 'number' || typeof tmpNode.Y !== 'number') continue;
			tmpNode.X = Math.round(tmpNode.X / tmpGridSize) * tmpGridSize;
			tmpNode.Y = Math.round(tmpNode.Y / tmpGridSize) * tmpGridSize;
		}
	},

	DefaultParameters:
	{
		GridSize: 20
	},

	ParameterSchema:
	{
		GridSize: { Type: 'PreciseNumber', Label: 'Grid size', Default: 20, Min: 1, Max: 200 }
	}
};

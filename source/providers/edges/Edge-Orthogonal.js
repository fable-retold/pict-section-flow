/**
 * Edge-Orthogonal
 *
 * Right-angle (Manhattan) routing between source and target. Reads
 * cleanly for layered DAGs and grid-shaped layouts. Per-connection
 * `OrthoMidOffset` and customized corner overrides are preserved.
 */
module.exports =
{
	Name: 'Orthogonal',
	Label: 'Orthogonal (right-angle)',
	Description: 'Right-angle routing — reads well for DAGs and grids.',

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

	DefaultParameters: {},

	ParameterSchema: {}
};

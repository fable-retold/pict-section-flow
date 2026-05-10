const libPerimeterMath = require('./Edge-PerimeterMath.js');

/**
 * Edge-Perimeter-Orthogonal
 *
 * Perimeter attachment + right-angle (Manhattan) routing between
 * the two resolved exit points. Best when the layout already has
 * grid-like structure (Grid, Mesh) and you want connections to
 * leave from whichever side faces the partner.
 */
module.exports =
{
	Name: 'Perimeter-Orthogonal',
	Label: 'Perimeter (orthogonal)',
	Description: 'Each connection exits the node at the perimeter, then routes via right-angle segments to the other end.',

	GeneratePath: function (pContext)
	{
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
		return pContext.Helpers.generateOrthogonal(pContext.Source, pContext.Target, tmpCorners, tmpData.OrthoMidOffset || 0);
	},

	ResolveAttachment: function (pContext)
	{
		return libPerimeterMath.resolvePerimeterAttachment(pContext);
	},

	DefaultParameters: {},
	ParameterSchema: {}
};

const libPerimeterMath = require('./Edge-PerimeterMath.js');

/**
 * Edge-Perimeter (Bezier)
 *
 * "Smart exit" routing with smooth bezier curves. Each connection
 * exits the node at the perimeter point closest to its target —
 * solves star/hub topologies where many connections share one port.
 *
 * Renders the path as a side-aware bezier (uses the side returned by
 * `ResolveAttachment` so the curve departs in the right direction).
 *
 * See `Edge-Perimeter-Linear` and `Edge-Perimeter-Orthogonal` for the
 * straight-line and right-angle variants.
 */
module.exports =
{
	Name: 'Perimeter',
	Label: 'Perimeter (bezier)',
	Description: 'Each connection exits the node at the perimeter point closest to its target, with smooth bezier curves. Fixes star/hub topologies where many lines share one port.',

	GeneratePath: function (pContext)
	{
		// Honor user-edited bezier handles when the connection is selected
		// and dragged. Without this, the drag handles render but moving
		// them does nothing because Perimeter would always re-emit a
		// fresh side-aware bezier.
		let tmpHelpers = pContext.Helpers;
		let tmpData = (pContext.Connection && pContext.Connection.Data) || {};
		if (tmpData.HandleCustomized)
		{
			let tmpHandles = tmpHelpers.getBezierHandles(tmpData);
			if (tmpHandles.length > 0)
			{
				return tmpHelpers.generateMultiBezier(pContext.Source, pContext.Target, tmpHandles);
			}
		}
		return tmpHelpers.generateBezier(pContext.Source, pContext.Target);
	},

	ResolveAttachment: function (pContext)
	{
		return libPerimeterMath.resolvePerimeterAttachment(pContext);
	},

	DefaultParameters: {},
	ParameterSchema: {}
};

const libPerimeterMath = require('./Edge-PerimeterMath.js');

/**
 * Edge-Perimeter-Linear
 *
 * Perimeter attachment + literal straight line between the two
 * resolved exit points. Reads cleanly for force-directed and circular
 * layouts where the topology already determines edge angles, and the
 * curves of bezier add visual noise.
 */
module.exports =
{
	Name: 'Perimeter-Linear',
	Label: 'Perimeter (linear)',
	Description: 'Each connection exits the node at the perimeter, then runs as a straight line to the other end.',

	GeneratePath: function (pContext)
	{
		let tmpS = pContext.Source;
		let tmpT = pContext.Target;
		return `M ${tmpS.x} ${tmpS.y} L ${tmpT.x} ${tmpT.y}`;
	},

	ResolveAttachment: function (pContext)
	{
		return libPerimeterMath.resolvePerimeterAttachment(pContext);
	},

	DefaultParameters: {},
	ParameterSchema: {}
};

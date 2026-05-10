/**
 * Edge-Straight
 *
 * Literal straight line from source port to target port. Useful for
 * dense clusters where curves add visual noise, and for force-directed
 * layouts where the topology already determines edge angles.
 */
module.exports =
{
	Name: 'Straight',
	Label: 'Straight line',
	Description: 'Plain straight line between ports.',

	GeneratePath: function (pContext)
	{
		let tmpSrc = pContext.Source;
		let tmpTgt = pContext.Target;
		return `M ${tmpSrc.x} ${tmpSrc.y} L ${tmpTgt.x} ${tmpTgt.y}`;
	},

	DefaultParameters: {},

	ParameterSchema: {}
};

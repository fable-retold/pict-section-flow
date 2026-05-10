/**
 * Layout-Custom
 *
 * No-op layout algorithm. Preserves the X/Y values currently on each
 * node so users can hand-place nodes without an algorithm clobbering
 * positions on the next render.
 *
 * Selecting "Custom" with auto-apply enabled is effectively a no-op
 * on every structural change — useful as a way to disable the
 * configured algorithm without unsetting it.
 */
module.exports =
{
	Name: 'Custom',
	Label: 'Custom (Hand-placed)',
	Description: 'Preserve hand-placed positions. No automatic arrangement.',
	DefaultEdgeTheme: 'Bezier',

	Apply: function (pNodes, pConnections, pParameters)
	{
		// Intentionally empty — Custom is a no-op.
	},

	DefaultParameters: {},

	ParameterSchema: {}
};

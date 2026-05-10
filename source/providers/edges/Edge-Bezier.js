/**
 * Edge-Bezier
 *
 * Default edge theme: smooth cubic bezier between source and target ports,
 * with departure/approach geometry derived from each port's `Side`. This
 * is a thin wrapper around the renderer's pre-existing bezier path
 * generator — selecting it is equivalent to the historical default.
 *
 * Honors per-connection multi-handle waypoints (BezierHandles) when
 * present so user-edited curves still survive.
 */
module.exports =
{
	Name: 'Bezier',
	Label: 'Bezier (smooth)',
	Description: 'Smooth cubic curves with side-aware departures.',

	GeneratePath: function (pContext)
	{
		let tmpHelpers = pContext.Helpers;
		let tmpSrc = pContext.Source;
		let tmpTgt = pContext.Target;
		let tmpData = (pContext.Connection && pContext.Connection.Data) || {};

		// Preserve user-customized multi-handle bezier waypoints.
		if (tmpData.HandleCustomized)
		{
			let tmpHandles = tmpHelpers.getBezierHandles(tmpData);
			if (tmpHandles.length > 0)
			{
				return tmpHelpers.generateMultiBezier(tmpSrc, tmpTgt, tmpHandles);
			}
		}

		return tmpHelpers.generateBezier(tmpSrc, tmpTgt);
	},

	DefaultParameters: {},

	ParameterSchema: {}
};

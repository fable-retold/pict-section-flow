const libCoerce = require('./Layout-Coerce.js');

/**
 * Layout-Tabular
 *
 * Vertical single-column flow. Nodes are stacked top-to-bottom with
 * VerticalSpacing between successive rows.
 */
module.exports =
{
	Name: 'Tabular',
	Label: 'Tabular (Top-to-Bottom)',
	Description: 'Single column, top-to-bottom.',
	DefaultEdgeTheme: 'Orthogonal',

	Apply: function (pNodes, pConnections, pParameters)
	{
		if (!pNodes || pNodes.length === 0) return;

		let tmpParams = pParameters || {};
		let tmpSpacing         = libCoerce.toFloat(tmpParams.Spacing, 1.0);
		let tmpStartX          = libCoerce.toFloat(tmpParams.StartX, 100);
		let tmpStartY          = libCoerce.toFloat(tmpParams.StartY, 100);
		let tmpVerticalSpacing = libCoerce.toFloat(tmpParams.VerticalSpacing, 40) * tmpSpacing;
		let tmpRowHeightParam  = tmpParams.RowHeight;
		let tmpOrderBy         = tmpParams.OrderBy || 'index';

		let tmpOrdered = pNodes.slice();
		if (tmpOrderBy === 'hash')
		{
			tmpOrdered.sort((pA, pB) => String(pA.Hash).localeCompare(String(pB.Hash)));
		}
		else if (tmpOrderBy === 'title')
		{
			tmpOrdered.sort((pA, pB) => String(pA.Title || pA.Hash).localeCompare(String(pB.Title || pB.Hash)));
		}

		let tmpY = tmpStartY;
		for (let i = 0; i < tmpOrdered.length; i++)
		{
			let tmpNode = tmpOrdered[i];
			tmpNode.X = tmpStartX;
			tmpNode.Y = tmpY;
			let tmpRowHeight = (tmpRowHeightParam == null) ? (tmpNode.Height || 80) : libCoerce.toFloat(tmpRowHeightParam, tmpNode.Height || 80);
			tmpY += tmpRowHeight + tmpVerticalSpacing;
		}
	},

	DefaultParameters:
	{
		Spacing: 1.0,
		StartX: 100,
		StartY: 100,
		VerticalSpacing: 40,
		OrderBy: 'index'
	},

	ParameterSchema:
	{
		Spacing:         { Type: 'PreciseNumber', Label: 'Spacing (multiplier)', Default: 1.0, Min: 0.1, Max: 5 },
		StartX:          { Type: 'PreciseNumber', Label: 'Start X',          Default: 100, Min: -10000, Max: 10000 },
		StartY:          { Type: 'PreciseNumber', Label: 'Start Y',          Default: 100, Min: -10000, Max: 10000 },
		VerticalSpacing: { Type: 'PreciseNumber', Label: 'Vertical spacing', Default: 40,  Min: 0, Max: 1000 },
		RowHeight:       { Type: 'PreciseNumber', Label: 'Row height',       Description: 'Defaults to each node\'s own height', Min: 1, Max: 5000 },
		OrderBy:         { Type: 'enum',          Label: 'Order by',         Default: 'index', Options: ['index', 'hash', 'title'] }
	},

	ParameterManifest:
	{
		Scope: 'PictFlowLayout-Tabular',
		Sections:
		[
			{ Name: 'Tabular Parameters', Hash: 'PFLTabularSection', Groups: [{ Name: 'Defaults', Hash: 'PFLTabularGroup' }] }
		],
		Descriptors:
		{
			'PictFlowLayoutEditor.Parameters.Spacing':
			{ Name: 'Spacing (multiplier)', Hash: 'Spacing', DataType: 'PreciseNumber', Default: 1.0, PictForm: { Section: 'PFLTabularSection', Group: 'PFLTabularGroup', Row: 0, Width: 12, Min: 0.1, Max: 5 } },
			'PictFlowLayoutEditor.Parameters.StartX':
			{ Name: 'Start X', Hash: 'StartX', DataType: 'PreciseNumber', Default: 100, PictForm: { Section: 'PFLTabularSection', Group: 'PFLTabularGroup', Row: 1, Width: 6, Min: -10000, Max: 10000 } },
			'PictFlowLayoutEditor.Parameters.StartY':
			{ Name: 'Start Y', Hash: 'StartY', DataType: 'PreciseNumber', Default: 100, PictForm: { Section: 'PFLTabularSection', Group: 'PFLTabularGroup', Row: 1, Width: 6, Min: -10000, Max: 10000 } },
			'PictFlowLayoutEditor.Parameters.VerticalSpacing':
			{ Name: 'Vertical spacing', Hash: 'VerticalSpacing', DataType: 'PreciseNumber', Default: 40, PictForm: { Section: 'PFLTabularSection', Group: 'PFLTabularGroup', Row: 2, Width: 6, Min: 0, Max: 1000 } },
			'PictFlowLayoutEditor.Parameters.RowHeight':
			{ Name: 'Row height (auto = blank)', Hash: 'RowHeight', DataType: 'PreciseNumber', PictForm: { Section: 'PFLTabularSection', Group: 'PFLTabularGroup', Row: 2, Width: 6, Min: 1, Max: 5000 } },
			'PictFlowLayoutEditor.Parameters.OrderBy':
			{
				Name: 'Order by', Hash: 'OrderBy', DataType: 'String', Default: 'index',
				PictForm: { Section: 'PFLTabularSection', Group: 'PFLTabularGroup', Row: 3, Width: 12, InputType: 'Option', SelectOptions: [{ Value: 'index', Name: 'Index' }, { Value: 'hash', Name: 'Hash' }, { Value: 'title', Name: 'Title' }] }
			}
		}
	}
};

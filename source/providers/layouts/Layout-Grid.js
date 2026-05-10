const libCoerce = require('./Layout-Coerce.js');

/**
 * Layout-Grid
 *
 * Auto-arrange nodes in a roughly-square grid. Cell width and height
 * default to the largest node dimensions plus margins. Column count
 * defaults to ceil(sqrt(n)) when `Columns` is 'auto'.
 *
 * Continuous params (margins, cell sizes, origin) are typed
 * `PreciseNumber` so they survive solver chains; the integer column
 * count and the categorical OrderBy stay `Number` / enum.
 */
module.exports =
{
	Name: 'Grid',
	Label: 'Grid',
	Description: 'Auto-arrange in a roughly-square grid.',
	DefaultEdgeTheme: 'Orthogonal',

	Apply: function (pNodes, pConnections, pParameters)
	{
		if (!pNodes || pNodes.length === 0) return;

		let tmpParams = pParameters || {};
		let tmpSpacing          = libCoerce.toFloat(tmpParams.Spacing, 1.0);
		let tmpColumnsParam     = tmpParams.Columns;
		let tmpCellWidthParam   = tmpParams.CellWidth;
		let tmpCellHeightParam  = tmpParams.CellHeight;
		let tmpHorizontalMargin = libCoerce.toFloat(tmpParams.HorizontalMargin, 40) * tmpSpacing;
		let tmpVerticalMargin   = libCoerce.toFloat(tmpParams.VerticalMargin, 40) * tmpSpacing;
		let tmpStartX           = libCoerce.toFloat(tmpParams.StartX, 100);
		let tmpStartY           = libCoerce.toFloat(tmpParams.StartY, 100);
		let tmpOrderBy          = tmpParams.OrderBy || 'index';

		let tmpColumns;
		if (tmpColumnsParam === 'auto' || tmpColumnsParam == null || tmpColumnsParam === '')
		{
			tmpColumns = Math.max(1, Math.ceil(Math.sqrt(pNodes.length)));
		}
		else
		{
			tmpColumns = Math.max(1, libCoerce.toInt(tmpColumnsParam, Math.max(1, Math.ceil(Math.sqrt(pNodes.length)))));
		}

		// Compute cell dimensions from largest node if not specified
		let tmpMaxWidth = 0;
		let tmpMaxHeight = 0;
		for (let i = 0; i < pNodes.length; i++)
		{
			tmpMaxWidth = Math.max(tmpMaxWidth, pNodes[i].Width || 180);
			tmpMaxHeight = Math.max(tmpMaxHeight, pNodes[i].Height || 80);
		}

		let tmpCellWidth  = (tmpCellWidthParam == null)  ? tmpMaxWidth + tmpHorizontalMargin  : libCoerce.toFloat(tmpCellWidthParam,  tmpMaxWidth + tmpHorizontalMargin);
		let tmpCellHeight = (tmpCellHeightParam == null) ? tmpMaxHeight + tmpVerticalMargin : libCoerce.toFloat(tmpCellHeightParam, tmpMaxHeight + tmpVerticalMargin);

		// Ordered iteration
		let tmpOrdered = pNodes.slice();
		if (tmpOrderBy === 'hash')
		{
			tmpOrdered.sort((pA, pB) => String(pA.Hash).localeCompare(String(pB.Hash)));
		}
		else if (tmpOrderBy === 'title')
		{
			tmpOrdered.sort((pA, pB) => String(pA.Title || pA.Hash).localeCompare(String(pB.Title || pB.Hash)));
		}

		for (let i = 0; i < tmpOrdered.length; i++)
		{
			let tmpRow = Math.floor(i / tmpColumns);
			let tmpCol = i % tmpColumns;
			tmpOrdered[i].X = tmpStartX + tmpCol * tmpCellWidth;
			tmpOrdered[i].Y = tmpStartY + tmpRow * tmpCellHeight;
		}
	},

	DefaultParameters:
	{
		Spacing: 1.0,
		Columns: 'auto',
		HorizontalMargin: 40,
		VerticalMargin: 40,
		StartX: 100,
		StartY: 100,
		OrderBy: 'index'
	},

	ParameterSchema:
	{
		Spacing:          { Type: 'PreciseNumber', Label: 'Spacing (multiplier)', Default: 1.0, Min: 0.1, Max: 5 },
		Columns:          { Type: 'string',        Label: 'Columns',          Default: 'auto', Description: '"auto" or an integer' },
		CellWidth:        { Type: 'PreciseNumber', Label: 'Cell width',       Description: 'Defaults to largest node width + horizontal margin', Min: 1, Max: 5000 },
		CellHeight:       { Type: 'PreciseNumber', Label: 'Cell height',      Description: 'Defaults to largest node height + vertical margin', Min: 1, Max: 5000 },
		HorizontalMargin: { Type: 'PreciseNumber', Label: 'Horizontal margin', Default: 40, Min: 0, Max: 1000 },
		VerticalMargin:   { Type: 'PreciseNumber', Label: 'Vertical margin',   Default: 40, Min: 0, Max: 1000 },
		StartX:           { Type: 'PreciseNumber', Label: 'Start X',          Default: 100, Min: -10000, Max: 10000 },
		StartY:           { Type: 'PreciseNumber', Label: 'Start Y',          Default: 100, Min: -10000, Max: 10000 },
		OrderBy:          { Type: 'enum',          Label: 'Order by',         Default: 'index', Options: ['index', 'hash', 'title'] }
	},

	ParameterManifest:
	{
		Scope: 'PictFlowLayout-Grid',
		Sections:
		[
			{ Name: 'Grid Parameters', Hash: 'PFLGridSection', Groups: [{ Name: 'Defaults', Hash: 'PFLGridGroup' }] }
		],
		Descriptors:
		{
			'PictFlowLayoutEditor.Parameters.Spacing':
			{ Name: 'Spacing (multiplier)', Hash: 'Spacing', DataType: 'PreciseNumber', Default: 1.0, PictForm: { Section: 'PFLGridSection', Group: 'PFLGridGroup', Row: 0, Width: 12, Min: 0.1, Max: 5 } },
			'PictFlowLayoutEditor.Parameters.Columns':
			{ Name: 'Columns ("auto" or integer)', Hash: 'Columns', DataType: 'String', Default: 'auto', PictForm: { Section: 'PFLGridSection', Group: 'PFLGridGroup', Row: 1, Width: 6 } },
			'PictFlowLayoutEditor.Parameters.OrderBy':
			{
				Name: 'Order by', Hash: 'OrderBy', DataType: 'String', Default: 'index',
				PictForm: { Section: 'PFLGridSection', Group: 'PFLGridGroup', Row: 1, Width: 6, InputType: 'Option', SelectOptions: [{ Value: 'index', Name: 'Index' }, { Value: 'hash', Name: 'Hash' }, { Value: 'title', Name: 'Title' }] }
			},
			'PictFlowLayoutEditor.Parameters.CellWidth':
			{ Name: 'Cell width (auto = blank)', Hash: 'CellWidth', DataType: 'PreciseNumber', PictForm: { Section: 'PFLGridSection', Group: 'PFLGridGroup', Row: 2, Width: 6, Min: 1, Max: 5000 } },
			'PictFlowLayoutEditor.Parameters.CellHeight':
			{ Name: 'Cell height (auto = blank)', Hash: 'CellHeight', DataType: 'PreciseNumber', PictForm: { Section: 'PFLGridSection', Group: 'PFLGridGroup', Row: 2, Width: 6, Min: 1, Max: 5000 } },
			'PictFlowLayoutEditor.Parameters.HorizontalMargin':
			{ Name: 'Horizontal margin', Hash: 'HorizontalMargin', DataType: 'PreciseNumber', Default: 40, PictForm: { Section: 'PFLGridSection', Group: 'PFLGridGroup', Row: 3, Width: 6, Min: 0, Max: 1000 } },
			'PictFlowLayoutEditor.Parameters.VerticalMargin':
			{ Name: 'Vertical margin', Hash: 'VerticalMargin', DataType: 'PreciseNumber', Default: 40, PictForm: { Section: 'PFLGridSection', Group: 'PFLGridGroup', Row: 3, Width: 6, Min: 0, Max: 1000 } },
			'PictFlowLayoutEditor.Parameters.StartX':
			{ Name: 'Start X', Hash: 'StartX', DataType: 'PreciseNumber', Default: 100, PictForm: { Section: 'PFLGridSection', Group: 'PFLGridGroup', Row: 4, Width: 6, Min: -10000, Max: 10000 } },
			'PictFlowLayoutEditor.Parameters.StartY':
			{ Name: 'Start Y', Hash: 'StartY', DataType: 'PreciseNumber', Default: 100, PictForm: { Section: 'PFLGridSection', Group: 'PFLGridGroup', Row: 4, Width: 6, Min: -10000, Max: 10000 } }
		}
	}
};

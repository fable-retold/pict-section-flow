const libCoerce = require('./Layout-Coerce.js');

/**
 * Layout-Columnar
 *
 * N-column layout with deterministic fill order. Distinct from Grid in
 * two ways:
 *   - Columns is always explicit (no 'auto')
 *   - FillOrder controls whether nodes flow row-first or column-first
 *
 * The column count is `Number` (integer index); spacing/origin values
 * are `PreciseNumber` so they survive solver chains.
 */
module.exports =
{
	Name: 'Columnar',
	Label: 'Columnar (N Columns)',
	Description: 'Explicit N columns; flow row-first or column-first.',
	DefaultEdgeTheme: 'Orthogonal',

	Apply: function (pNodes, pConnections, pParameters)
	{
		if (!pNodes || pNodes.length === 0) return;

		let tmpParams = pParameters || {};
		let tmpSpacing         = libCoerce.toFloat(tmpParams.Spacing, 1.0);
		let tmpColumns         = Math.max(1, libCoerce.toInt(tmpParams.Columns, 3));
		let tmpColumnSpacing   = libCoerce.toFloat(tmpParams.ColumnSpacing, 40) * tmpSpacing;
		let tmpRowSpacing      = libCoerce.toFloat(tmpParams.RowSpacing, 40) * tmpSpacing;
		let tmpStartX          = libCoerce.toFloat(tmpParams.StartX, 100);
		let tmpStartY          = libCoerce.toFloat(tmpParams.StartY, 100);
		let tmpFillOrder       = (tmpParams.FillOrder === 'column') ? 'column' : 'row';
		let tmpOrderBy         = tmpParams.OrderBy || 'index';

		// Compute cell dimensions from largest node
		let tmpMaxWidth = 0;
		let tmpMaxHeight = 0;
		for (let i = 0; i < pNodes.length; i++)
		{
			tmpMaxWidth = Math.max(tmpMaxWidth, pNodes[i].Width || 180);
			tmpMaxHeight = Math.max(tmpMaxHeight, pNodes[i].Height || 80);
		}
		let tmpCellWidth  = tmpMaxWidth + tmpColumnSpacing;
		let tmpCellHeight = tmpMaxHeight + tmpRowSpacing;

		let tmpOrdered = pNodes.slice();
		if (tmpOrderBy === 'hash')
		{
			tmpOrdered.sort((pA, pB) => String(pA.Hash).localeCompare(String(pB.Hash)));
		}
		else if (tmpOrderBy === 'title')
		{
			tmpOrdered.sort((pA, pB) => String(pA.Title || pA.Hash).localeCompare(String(pB.Title || pB.Hash)));
		}

		let tmpRows = Math.ceil(tmpOrdered.length / tmpColumns);

		for (let i = 0; i < tmpOrdered.length; i++)
		{
			let tmpRow;
			let tmpCol;
			if (tmpFillOrder === 'column')
			{
				tmpCol = Math.floor(i / tmpRows);
				tmpRow = i % tmpRows;
			}
			else
			{
				tmpRow = Math.floor(i / tmpColumns);
				tmpCol = i % tmpColumns;
			}
			tmpOrdered[i].X = tmpStartX + tmpCol * tmpCellWidth;
			tmpOrdered[i].Y = tmpStartY + tmpRow * tmpCellHeight;
		}
	},

	DefaultParameters:
	{
		Spacing: 1.0,
		Columns: 3,
		ColumnSpacing: 40,
		RowSpacing: 40,
		StartX: 100,
		StartY: 100,
		FillOrder: 'row',
		OrderBy: 'index'
	},

	ParameterSchema:
	{
		Spacing:       { Type: 'PreciseNumber', Label: 'Spacing (multiplier)', Default: 1.0, Min: 0.1, Max: 5 },
		Columns:       { Type: 'Number',        Label: 'Columns',        Default: 3,   Min: 1, Max: 50 },
		ColumnSpacing: { Type: 'PreciseNumber', Label: 'Column spacing', Default: 40,  Min: 0, Max: 1000 },
		RowSpacing:    { Type: 'PreciseNumber', Label: 'Row spacing',    Default: 40,  Min: 0, Max: 1000 },
		StartX:        { Type: 'PreciseNumber', Label: 'Start X',        Default: 100, Min: -10000, Max: 10000 },
		StartY:        { Type: 'PreciseNumber', Label: 'Start Y',        Default: 100, Min: -10000, Max: 10000 },
		FillOrder:     { Type: 'enum',          Label: 'Fill order',     Default: 'row', Options: ['row', 'column'] },
		OrderBy:       { Type: 'enum',          Label: 'Order by',       Default: 'index', Options: ['index', 'hash', 'title'] }
	},

	ParameterManifest:
	{
		Scope: 'PictFlowLayout-Columnar',
		Sections:
		[
			{ Name: 'Columnar Parameters', Hash: 'PFLColumnarSection', Groups: [{ Name: 'Defaults', Hash: 'PFLColumnarGroup' }] }
		],
		Descriptors:
		{
			'PictFlowLayoutEditor.Parameters.Spacing':
			{ Name: 'Spacing (multiplier)', Hash: 'Spacing', DataType: 'PreciseNumber', Default: 1.0, PictForm: { Section: 'PFLColumnarSection', Group: 'PFLColumnarGroup', Row: 0, Width: 12, Min: 0.1, Max: 5 } },
			'PictFlowLayoutEditor.Parameters.Columns':
			{ Name: 'Columns', Hash: 'Columns', DataType: 'Number', Default: 3, PictForm: { Section: 'PFLColumnarSection', Group: 'PFLColumnarGroup', Row: 1, Width: 6, Min: 1, Max: 50 } },
			'PictFlowLayoutEditor.Parameters.FillOrder':
			{
				Name: 'Fill order', Hash: 'FillOrder', DataType: 'String', Default: 'row',
				PictForm: { Section: 'PFLColumnarSection', Group: 'PFLColumnarGroup', Row: 1, Width: 6, InputType: 'Option', SelectOptions: [{ Value: 'row', Name: 'Row-first' }, { Value: 'column', Name: 'Column-first' }] }
			},
			'PictFlowLayoutEditor.Parameters.ColumnSpacing':
			{ Name: 'Column spacing', Hash: 'ColumnSpacing', DataType: 'PreciseNumber', Default: 40, PictForm: { Section: 'PFLColumnarSection', Group: 'PFLColumnarGroup', Row: 2, Width: 6, Min: 0, Max: 1000 } },
			'PictFlowLayoutEditor.Parameters.RowSpacing':
			{ Name: 'Row spacing', Hash: 'RowSpacing', DataType: 'PreciseNumber', Default: 40, PictForm: { Section: 'PFLColumnarSection', Group: 'PFLColumnarGroup', Row: 2, Width: 6, Min: 0, Max: 1000 } },
			'PictFlowLayoutEditor.Parameters.StartX':
			{ Name: 'Start X', Hash: 'StartX', DataType: 'PreciseNumber', Default: 100, PictForm: { Section: 'PFLColumnarSection', Group: 'PFLColumnarGroup', Row: 3, Width: 6, Min: -10000, Max: 10000 } },
			'PictFlowLayoutEditor.Parameters.StartY':
			{ Name: 'Start Y', Hash: 'StartY', DataType: 'PreciseNumber', Default: 100, PictForm: { Section: 'PFLColumnarSection', Group: 'PFLColumnarGroup', Row: 3, Width: 6, Min: -10000, Max: 10000 } },
			'PictFlowLayoutEditor.Parameters.OrderBy':
			{
				Name: 'Order by', Hash: 'OrderBy', DataType: 'String', Default: 'index',
				PictForm: { Section: 'PFLColumnarSection', Group: 'PFLColumnarGroup', Row: 4, Width: 12, InputType: 'Option', SelectOptions: [{ Value: 'index', Name: 'Index' }, { Value: 'hash', Name: 'Hash' }, { Value: 'title', Name: 'Title' }] }
			}
		}
	}
};

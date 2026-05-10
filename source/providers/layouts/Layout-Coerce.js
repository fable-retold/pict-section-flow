/**
 * Layout-Coerce
 *
 * Tiny coercion helpers for layout-algorithm parameters. Manyfest's
 * `PreciseNumber` DataType stores values as strings (so big.js /
 * fable.ExpressionParser can do arbitrary-precision math on them
 * without float drift). The simulation code in each layout algorithm
 * uses native JS Math, so we coerce at the entry point.
 *
 * Apply functions accept either format (number or string) and use
 * these helpers to normalize.
 */

function _toFloat(pValue, pDefault)
{
	if (typeof pValue === 'number' && !isNaN(pValue)) return pValue;
	if (typeof pValue === 'string' && pValue !== '')
	{
		let tmpNum = parseFloat(pValue);
		if (!isNaN(tmpNum)) return tmpNum;
	}
	return pDefault;
}

function _toInt(pValue, pDefault)
{
	if (typeof pValue === 'number' && !isNaN(pValue)) return Math.floor(pValue);
	if (typeof pValue === 'string' && pValue !== '')
	{
		let tmpNum = parseInt(pValue, 10);
		if (!isNaN(tmpNum)) return tmpNum;
	}
	return pDefault;
}

module.exports =
{
	toFloat: _toFloat,
	toInt: _toInt
};

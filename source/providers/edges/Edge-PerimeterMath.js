/**
 * Edge-PerimeterMath
 *
 * Shared geometry helper for the Perimeter family of edge themes
 * (Perimeter, Perimeter-Linear, Perimeter-Orthogonal). Solves the
 * "where on this node's bounding box should the line attach so it
 * points at the other end" question.
 *
 * The themes themselves only differ in how they render the path
 * between the two attachment points; the attachment math is identical.
 */

/**
 * Resolve a perimeter attachment point for one end of a connection.
 * Traces a line from the node's center toward the other end and returns
 * the first crossing of the node's bounding-box perimeter, plus the
 * `side` of that crossing (so the bezier helper departs in the right
 * direction).
 *
 * @param {Object} pContext - the same shape the renderer passes into
 *        ResolveAttachment (Node, OtherNode, OtherDefaultPosition,
 *        DefaultPosition, …).
 * @returns {{x: number, y: number, side: string}|Object|null}
 *        Returns null when node geometry is missing; returns
 *        DefaultPosition (verbatim) for degenerate same-center cases.
 */
function _resolvePerimeterAttachment(pContext)
{
	let tmpNode = pContext.Node;
	if (!tmpNode || typeof tmpNode.X !== 'number' || typeof tmpNode.Y !== 'number') return null;

	let tmpW = tmpNode.Width || 180;
	let tmpH = tmpNode.Height || 80;
	let tmpCx = tmpNode.X + tmpW / 2;
	let tmpCy = tmpNode.Y + tmpH / 2;

	let tmpAimX, tmpAimY;
	if (pContext.OtherNode && typeof pContext.OtherNode.X === 'number')
	{
		let tmpOW = pContext.OtherNode.Width || 180;
		let tmpOH = pContext.OtherNode.Height || 80;
		tmpAimX = pContext.OtherNode.X + tmpOW / 2;
		tmpAimY = pContext.OtherNode.Y + tmpOH / 2;
	}
	else if (pContext.OtherDefaultPosition)
	{
		tmpAimX = pContext.OtherDefaultPosition.x;
		tmpAimY = pContext.OtherDefaultPosition.y;
	}
	else
	{
		return null;
	}

	let tmpDX = tmpAimX - tmpCx;
	let tmpDY = tmpAimY - tmpCy;

	if (tmpDX === 0 && tmpDY === 0) return pContext.DefaultPosition || null;

	let tmpHalfW = tmpW / 2;
	let tmpHalfH = tmpH / 2;

	let tmpTX = (tmpDX > 0) ? tmpHalfW / tmpDX
		: (tmpDX < 0) ? -tmpHalfW / tmpDX
		: Infinity;
	let tmpTY = (tmpDY > 0) ? tmpHalfH / tmpDY
		: (tmpDY < 0) ? -tmpHalfH / tmpDY
		: Infinity;

	let tmpT, tmpSide;
	if (tmpTX < tmpTY)
	{
		tmpT = tmpTX;
		tmpSide = (tmpDX > 0) ? 'right' : 'left';
	}
	else
	{
		tmpT = tmpTY;
		tmpSide = (tmpDY > 0) ? 'bottom' : 'top';
	}

	return {
		x: tmpCx + tmpT * tmpDX,
		y: tmpCy + tmpT * tmpDY,
		side: tmpSide
	};
}

module.exports =
{
	resolvePerimeterAttachment: _resolvePerimeterAttachment
};

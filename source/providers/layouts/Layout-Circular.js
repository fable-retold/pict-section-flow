const libCoerce = require('./Layout-Coerce.js');

/**
 * Layout-Circular
 *
 * Concentric-ring layout.
 *
 * Two modes, decided by the presence of connections:
 *
 *   With connections: BFS from the root nodes (in-degree 0; or all
 *   nodes if every node has incoming edges). Each BFS depth becomes
 *   one ring. Roots cluster near the center, leaves on the outer rings.
 *
 *   Without connections: all nodes share a single ring with equal
 *   angular spacing.
 *
 * Within each ring, nodes are placed at equal angles starting from
 * `StartAngle` (in degrees, 0 = +X axis), going clockwise or
 * counter-clockwise per `Direction`.
 */
module.exports =
{
	Name: 'Circular',
	Label: 'Circular',
	Description: 'Concentric rings; uses connections for ring assignment when available.',
	DefaultEdgeTheme: 'Perimeter',

	Apply: function (pNodes, pConnections, pParameters)
	{
		if (!pNodes || pNodes.length === 0) return;

		let tmpParams = pParameters || {};
		let tmpSpacing     = libCoerce.toFloat(tmpParams.Spacing, 1.0);
		let tmpCenterX     = libCoerce.toFloat(tmpParams.CenterX, 1000);
		let tmpCenterY     = libCoerce.toFloat(tmpParams.CenterY, 750);
		let tmpRingSpacing = libCoerce.toFloat(tmpParams.RingSpacing, 220) * tmpSpacing;
		let tmpInnerRadius = libCoerce.toFloat(tmpParams.InnerRadius, 0) * tmpSpacing;
		let tmpStartAngle  = libCoerce.toFloat(tmpParams.StartAngle, -90);
		let tmpDirection   = (tmpParams.Direction === 'ccw') ? 'ccw' : 'cw';

		let tmpConnections = Array.isArray(pConnections) ? pConnections : [];

		// Build in-degree map and adjacency
		let tmpInDegree = {};
		let tmpAdjacency = {};
		let tmpNodeMap = {};
		for (let i = 0; i < pNodes.length; i++)
		{
			tmpNodeMap[pNodes[i].Hash] = pNodes[i];
			tmpInDegree[pNodes[i].Hash] = 0;
			tmpAdjacency[pNodes[i].Hash] = [];
		}
		for (let i = 0; i < tmpConnections.length; i++)
		{
			let tmpConn = tmpConnections[i];
			if (tmpInDegree.hasOwnProperty(tmpConn.TargetNodeHash))
			{
				tmpInDegree[tmpConn.TargetNodeHash]++;
			}
			if (tmpAdjacency.hasOwnProperty(tmpConn.SourceNodeHash))
			{
				tmpAdjacency[tmpConn.SourceNodeHash].push(tmpConn.TargetNodeHash);
			}
		}

		// Identify roots
		let tmpRoots = [];
		for (let i = 0; i < pNodes.length; i++)
		{
			if (tmpInDegree[pNodes[i].Hash] === 0)
			{
				tmpRoots.push(pNodes[i].Hash);
			}
		}

		let tmpRings = [];

		if (tmpConnections.length === 0 || tmpRoots.length === 0)
		{
			tmpRings.push(pNodes.map((pNode) => pNode.Hash));
		}
		else
		{
			// BFS by depth
			let tmpVisited = {};
			let tmpCurrent = tmpRoots.slice();
			while (tmpCurrent.length > 0)
			{
				let tmpRing = [];
				let tmpNext = [];
				for (let i = 0; i < tmpCurrent.length; i++)
				{
					let tmpHash = tmpCurrent[i];
					if (tmpVisited[tmpHash]) continue;
					tmpVisited[tmpHash] = true;
					tmpRing.push(tmpHash);

					let tmpChildren = tmpAdjacency[tmpHash] || [];
					for (let j = 0; j < tmpChildren.length; j++)
					{
						if (!tmpVisited[tmpChildren[j]])
						{
							tmpNext.push(tmpChildren[j]);
						}
					}
				}
				if (tmpRing.length > 0) tmpRings.push(tmpRing);
				tmpCurrent = tmpNext;
			}

			let tmpRemaining = [];
			for (let i = 0; i < pNodes.length; i++)
			{
				if (!tmpVisited[pNodes[i].Hash]) tmpRemaining.push(pNodes[i].Hash);
			}
			if (tmpRemaining.length > 0) tmpRings.push(tmpRemaining);
		}

		// Place nodes
		let tmpAngleSign = (tmpDirection === 'cw') ? 1 : -1;
		let tmpStartRad = tmpStartAngle * Math.PI / 180;

		for (let tmpRingIdx = 0; tmpRingIdx < tmpRings.length; tmpRingIdx++)
		{
			let tmpRing = tmpRings[tmpRingIdx];
			let tmpRadius = tmpInnerRadius + tmpRingIdx * tmpRingSpacing;

			if (tmpRing.length === 1 && tmpRingIdx === 0 && tmpInnerRadius === 0)
			{
				let tmpNode = tmpNodeMap[tmpRing[0]];
				if (tmpNode)
				{
					tmpNode.X = tmpCenterX - (tmpNode.Width || 180) / 2;
					tmpNode.Y = tmpCenterY - (tmpNode.Height || 80) / 2;
				}
				continue;
			}

			let tmpAngleStep = (2 * Math.PI) / tmpRing.length;
			for (let i = 0; i < tmpRing.length; i++)
			{
				let tmpNode = tmpNodeMap[tmpRing[i]];
				if (!tmpNode) continue;
				let tmpAngle = tmpStartRad + tmpAngleSign * i * tmpAngleStep;
				let tmpW = tmpNode.Width || 180;
				let tmpH = tmpNode.Height || 80;
				tmpNode.X = tmpCenterX + Math.cos(tmpAngle) * tmpRadius - tmpW / 2;
				tmpNode.Y = tmpCenterY + Math.sin(tmpAngle) * tmpRadius - tmpH / 2;
			}
		}
	},

	DefaultParameters:
	{
		Spacing: 1.0,
		CenterX: 1000,
		CenterY: 750,
		RingSpacing: 220,
		InnerRadius: 0,
		StartAngle: -90,
		Direction: 'cw'
	},

	ParameterSchema:
	{
		Spacing:     { Type: 'PreciseNumber', Label: 'Spacing (multiplier)', Default: 1.0, Min: 0.1, Max: 5 },
		CenterX:     { Type: 'PreciseNumber', Label: 'Center X',     Default: 1000, Min: -10000, Max: 10000 },
		CenterY:     { Type: 'PreciseNumber', Label: 'Center Y',     Default: 750,  Min: -10000, Max: 10000 },
		RingSpacing: { Type: 'PreciseNumber', Label: 'Ring spacing', Default: 220,  Min: 1, Max: 5000 },
		InnerRadius: { Type: 'PreciseNumber', Label: 'Inner radius', Default: 0,    Min: 0, Max: 5000 },
		StartAngle:  { Type: 'PreciseNumber', Label: 'Start angle (deg)', Default: -90, Min: -360, Max: 360 },
		Direction:   { Type: 'enum',          Label: 'Direction',    Default: 'cw', Options: ['cw', 'ccw'] }
	},

	ParameterManifest:
	{
		Scope: 'PictFlowLayout-Circular',
		Sections:
		[
			{ Name: 'Circular Parameters', Hash: 'PFLCircularSection', Groups: [{ Name: 'Defaults', Hash: 'PFLCircularGroup' }] }
		],
		Descriptors:
		{
			'PictFlowLayoutEditor.Parameters.Spacing':
			{ Name: 'Spacing (multiplier)', Hash: 'Spacing', DataType: 'PreciseNumber', Default: 1.0, PictForm: { Section: 'PFLCircularSection', Group: 'PFLCircularGroup', Row: 0, Width: 12, Min: 0.1, Max: 5 } },
			'PictFlowLayoutEditor.Parameters.CenterX':
			{ Name: 'Center X', Hash: 'CenterX', DataType: 'PreciseNumber', Default: 1000, PictForm: { Section: 'PFLCircularSection', Group: 'PFLCircularGroup', Row: 1, Width: 6, Min: -10000, Max: 10000 } },
			'PictFlowLayoutEditor.Parameters.CenterY':
			{ Name: 'Center Y', Hash: 'CenterY', DataType: 'PreciseNumber', Default: 750, PictForm: { Section: 'PFLCircularSection', Group: 'PFLCircularGroup', Row: 1, Width: 6, Min: -10000, Max: 10000 } },
			'PictFlowLayoutEditor.Parameters.RingSpacing':
			{ Name: 'Ring spacing', Hash: 'RingSpacing', DataType: 'PreciseNumber', Default: 220, PictForm: { Section: 'PFLCircularSection', Group: 'PFLCircularGroup', Row: 2, Width: 6, Min: 1, Max: 5000 } },
			'PictFlowLayoutEditor.Parameters.InnerRadius':
			{ Name: 'Inner radius', Hash: 'InnerRadius', DataType: 'PreciseNumber', Default: 0, PictForm: { Section: 'PFLCircularSection', Group: 'PFLCircularGroup', Row: 2, Width: 6, Min: 0, Max: 5000 } },
			'PictFlowLayoutEditor.Parameters.StartAngle':
			{ Name: 'Start angle (deg)', Hash: 'StartAngle', DataType: 'PreciseNumber', Default: -90, PictForm: { Section: 'PFLCircularSection', Group: 'PFLCircularGroup', Row: 3, Width: 6, Min: -360, Max: 360 } },
			'PictFlowLayoutEditor.Parameters.Direction':
			{
				Name: 'Direction', Hash: 'Direction', DataType: 'String', Default: 'cw',
				PictForm: { Section: 'PFLCircularSection', Group: 'PFLCircularGroup', Row: 3, Width: 6, InputType: 'Option', SelectOptions: [{ Value: 'cw', Name: 'Clockwise' }, { Value: 'ccw', Name: 'Counter-clockwise' }] }
			}
		}
	}
};

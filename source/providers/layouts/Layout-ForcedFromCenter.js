const libCoerce = require('./Layout-Coerce.js');

/**
 * Layout-ForcedFromCenter
 *
 * Force-directed simulation in the Fruchterman-Reingold style:
 *   - Spring (attractive) forces along each connection
 *   - Coulomb-style repulsion between every pair of nodes
 *   - Center-attraction force pulling all nodes toward (CenterX, CenterY)
 *   - Cooling schedule: max displacement per iteration shrinks over time
 *
 * Deterministic by default — initial positions for unplaced nodes are
 * generated from a seedable Mulberry32 PRNG (inline implementation, no
 * new dependencies). Tests pin `Seed` to assert byte-identical output.
 *
 * Performance: O(n^2) per iteration. With Iterations=200 this is fine
 * for ~100 nodes; keep ForcedFromCenter for moderate-sized graphs.
 *
 * Numeric parameters (other than Iterations and Seed) are typed
 * `PreciseNumber` so they round-trip cleanly through the
 * ExpressionParser; the simulation coerces back to JS floats via
 * Layout-Coerce. Iterations and Seed stay `Number` because they're
 * loop counters / bitwise-PRNG state.
 */
module.exports =
{
	Name: 'ForcedFromCenter',
	Label: 'Forced from Center',
	Description: 'Spring + repulsion simulation pulling toward a center point.',
	DefaultEdgeTheme: 'Bezier',

	Apply: function (pNodes, pConnections, pParameters)
	{
		if (!pNodes || pNodes.length === 0) return;

		let tmpParams = pParameters || {};
		let tmpSpacing            = libCoerce.toFloat(tmpParams.Spacing,            1.0);
		let tmpIterations         = libCoerce.toInt(tmpParams.Iterations,         200);
		let tmpCenterX            = libCoerce.toFloat(tmpParams.CenterX,            1000);
		let tmpCenterY            = libCoerce.toFloat(tmpParams.CenterY,            750);
		let tmpSpringLength       = libCoerce.toFloat(tmpParams.SpringLength,       200) * tmpSpacing;
		let tmpSpringStiffness    = libCoerce.toFloat(tmpParams.SpringStiffness,    0.05);
		let tmpRepulsion          = libCoerce.toFloat(tmpParams.Repulsion,          8000);
		let tmpCenterAttraction   = libCoerce.toFloat(tmpParams.CenterAttraction,   0.01);
		let tmpCoolingFactor      = libCoerce.toFloat(tmpParams.CoolingFactor,      0.95);
		let tmpInitialTemperature = libCoerce.toFloat(tmpParams.InitialTemperature, 100);
		let tmpSeed               = libCoerce.toInt(tmpParams.Seed,               42);
		let tmpPreservePositions  = !!tmpParams.PreservePositions;
		let tmpInitialSpread      = libCoerce.toFloat(tmpParams.InitialSpread,      400);

		let tmpConnections = Array.isArray(pConnections) ? pConnections : [];

		// Mulberry32 seeded PRNG — deterministic initial-position generator.
		let tmpRand = _makeMulberry32(tmpSeed >>> 0);

		// Initial positions
		for (let i = 0; i < pNodes.length; i++)
		{
			let tmpNode = pNodes[i];
			let tmpHasPosition = (typeof tmpNode.X === 'number' && typeof tmpNode.Y === 'number');
			if (tmpPreservePositions && tmpHasPosition) continue;
			tmpNode.X = tmpCenterX + (tmpRand() - 0.5) * tmpInitialSpread;
			tmpNode.Y = tmpCenterY + (tmpRand() - 0.5) * tmpInitialSpread;
		}

		// Index nodes by hash for connection lookup
		let tmpNodeMap = {};
		for (let i = 0; i < pNodes.length; i++)
		{
			tmpNodeMap[pNodes[i].Hash] = pNodes[i];
		}

		let tmpTemperature = tmpInitialTemperature;

		for (let tmpIter = 0; tmpIter < tmpIterations; tmpIter++)
		{
			// Force accumulators
			let tmpForceX = new Array(pNodes.length).fill(0);
			let tmpForceY = new Array(pNodes.length).fill(0);

			// Repulsion between every pair of nodes
			for (let i = 0; i < pNodes.length; i++)
			{
				let tmpA = pNodes[i];
				for (let j = i + 1; j < pNodes.length; j++)
				{
					let tmpB = pNodes[j];
					let tmpDX = tmpA.X - tmpB.X;
					let tmpDY = tmpA.Y - tmpB.Y;
					let tmpDistSq = tmpDX * tmpDX + tmpDY * tmpDY;
					if (tmpDistSq < 1) tmpDistSq = 1; // avoid singularities
					let tmpDist = Math.sqrt(tmpDistSq);
					let tmpForce = tmpRepulsion / tmpDistSq;
					let tmpFX = (tmpDX / tmpDist) * tmpForce;
					let tmpFY = (tmpDY / tmpDist) * tmpForce;
					tmpForceX[i] += tmpFX;
					tmpForceY[i] += tmpFY;
					tmpForceX[j] -= tmpFX;
					tmpForceY[j] -= tmpFY;
				}
			}

			// Spring forces along connections
			for (let i = 0; i < tmpConnections.length; i++)
			{
				let tmpConn = tmpConnections[i];
				let tmpSource = tmpNodeMap[tmpConn.SourceNodeHash];
				let tmpTarget = tmpNodeMap[tmpConn.TargetNodeHash];
				if (!tmpSource || !tmpTarget) continue;

				let tmpSourceIdx = pNodes.indexOf(tmpSource);
				let tmpTargetIdx = pNodes.indexOf(tmpTarget);
				if (tmpSourceIdx < 0 || tmpTargetIdx < 0) continue;

				let tmpDX = tmpTarget.X - tmpSource.X;
				let tmpDY = tmpTarget.Y - tmpSource.Y;
				let tmpDist = Math.sqrt(tmpDX * tmpDX + tmpDY * tmpDY);
				if (tmpDist < 0.0001) tmpDist = 0.0001;

				let tmpDelta = tmpDist - tmpSpringLength;
				let tmpForce = tmpSpringStiffness * tmpDelta;
				let tmpFX = (tmpDX / tmpDist) * tmpForce;
				let tmpFY = (tmpDY / tmpDist) * tmpForce;

				tmpForceX[tmpSourceIdx] += tmpFX;
				tmpForceY[tmpSourceIdx] += tmpFY;
				tmpForceX[tmpTargetIdx] -= tmpFX;
				tmpForceY[tmpTargetIdx] -= tmpFY;
			}

			// Center attraction
			for (let i = 0; i < pNodes.length; i++)
			{
				let tmpNode = pNodes[i];
				tmpForceX[i] += (tmpCenterX - tmpNode.X) * tmpCenterAttraction;
				tmpForceY[i] += (tmpCenterY - tmpNode.Y) * tmpCenterAttraction;
			}

			// Apply forces with temperature clamp
			for (let i = 0; i < pNodes.length; i++)
			{
				let tmpNode = pNodes[i];
				let tmpFX = tmpForceX[i];
				let tmpFY = tmpForceY[i];
				let tmpMag = Math.sqrt(tmpFX * tmpFX + tmpFY * tmpFY);
				if (tmpMag > tmpTemperature)
				{
					tmpFX = (tmpFX / tmpMag) * tmpTemperature;
					tmpFY = (tmpFY / tmpMag) * tmpTemperature;
				}
				tmpNode.X += tmpFX;
				tmpNode.Y += tmpFY;
			}

			tmpTemperature *= tmpCoolingFactor;
		}

		// Round to whole pixels for stable rendering and predictable tests
		for (let i = 0; i < pNodes.length; i++)
		{
			pNodes[i].X = Math.round(pNodes[i].X);
			pNodes[i].Y = Math.round(pNodes[i].Y);
		}
	},

	DefaultParameters:
	{
		Spacing: 1.0,
		Iterations: 200,
		CenterX: 1000,
		CenterY: 750,
		SpringLength: 200,
		SpringStiffness: 0.05,
		Repulsion: 8000,
		CenterAttraction: 0.01,
		CoolingFactor: 0.95,
		InitialTemperature: 100,
		Seed: 42,
		PreservePositions: false,
		InitialSpread: 400
	},

	ParameterSchema:
	{
		Spacing:            { Type: 'PreciseNumber', Label: 'Spacing (multiplier)', Default: 1.0, Min: 0.1, Max: 5 },
		Iterations:         { Type: 'Number',        Label: 'Iterations',         Default: 200,   Min: 1,    Max: 2000  },
		CenterX:            { Type: 'PreciseNumber', Label: 'Center X',           Default: 1000,  Min: -10000, Max: 10000 },
		CenterY:            { Type: 'PreciseNumber', Label: 'Center Y',           Default: 750,   Min: -10000, Max: 10000 },
		SpringLength:       { Type: 'PreciseNumber', Label: 'Spring length',      Default: 200,   Min: 1,    Max: 2000  },
		SpringStiffness:    { Type: 'PreciseNumber', Label: 'Spring stiffness',   Default: 0.05,  Min: 0,    Max: 1     },
		Repulsion:          { Type: 'PreciseNumber', Label: 'Repulsion',          Default: 8000,  Min: 0,    Max: 100000 },
		CenterAttraction:   { Type: 'PreciseNumber', Label: 'Center attraction',  Default: 0.01,  Min: 0,    Max: 1     },
		CoolingFactor:      { Type: 'PreciseNumber', Label: 'Cooling factor',     Default: 0.95,  Min: 0.5,  Max: 1     },
		InitialTemperature: { Type: 'PreciseNumber', Label: 'Initial temperature', Default: 100,  Min: 1,    Max: 1000  },
		Seed:               { Type: 'Number',        Label: 'Random seed',        Default: 42,    Min: 0,    Max: 2147483647 },
		PreservePositions:  { Type: 'boolean',       Label: 'Preserve positions', Default: false },
		InitialSpread:      { Type: 'PreciseNumber', Label: 'Initial spread',     Default: 400,   Min: 0,    Max: 5000  }
	},

	ParameterManifest:
	{
		Scope: 'PictFlowLayout-ForcedFromCenter',
		Sections:
		[
			{ Name: 'Center', Hash: 'PFLCenterSection', Groups: [{ Name: 'Defaults', Hash: 'PFLCenterGroup' }] },
			{ Name: 'Forces', Hash: 'PFLForcesSection', Groups: [{ Name: 'Defaults', Hash: 'PFLForcesGroup' }] },
			{ Name: 'Simulation', Hash: 'PFLSimSection', Groups: [{ Name: 'Defaults', Hash: 'PFLSimGroup' }] },
			{ Name: 'Initialization', Hash: 'PFLInitSection', Groups: [{ Name: 'Defaults', Hash: 'PFLInitGroup' }] }
		],
		Descriptors:
		{
			'PictFlowLayoutEditor.Parameters.Spacing':
			{ Name: 'Spacing (multiplier)', Hash: 'Spacing', DataType: 'PreciseNumber', Default: 1.0, PictForm: { Section: 'PFLCenterSection', Group: 'PFLCenterGroup', Row: 0, Width: 12, Min: 0.1, Max: 5 } },
			'PictFlowLayoutEditor.Parameters.CenterX':
			{ Name: 'Center X', Hash: 'CenterX', DataType: 'PreciseNumber', Default: 1000, PictForm: { Section: 'PFLCenterSection', Group: 'PFLCenterGroup', Row: 1, Width: 6, Min: -10000, Max: 10000 } },
			'PictFlowLayoutEditor.Parameters.CenterY':
			{ Name: 'Center Y', Hash: 'CenterY', DataType: 'PreciseNumber', Default: 750, PictForm: { Section: 'PFLCenterSection', Group: 'PFLCenterGroup', Row: 1, Width: 6, Min: -10000, Max: 10000 } },
			'PictFlowLayoutEditor.Parameters.CenterAttraction':
			{ Name: 'Center attraction', Hash: 'CenterAttraction', DataType: 'PreciseNumber', Default: 0.01, PictForm: { Section: 'PFLCenterSection', Group: 'PFLCenterGroup', Row: 2, Width: 12, Min: 0, Max: 1 } },

			'PictFlowLayoutEditor.Parameters.SpringLength':
			{ Name: 'Spring length', Hash: 'SpringLength', DataType: 'PreciseNumber', Default: 200, PictForm: { Section: 'PFLForcesSection', Group: 'PFLForcesGroup', Row: 1, Width: 6, Min: 1, Max: 2000 } },
			'PictFlowLayoutEditor.Parameters.SpringStiffness':
			{ Name: 'Spring stiffness', Hash: 'SpringStiffness', DataType: 'PreciseNumber', Default: 0.05, PictForm: { Section: 'PFLForcesSection', Group: 'PFLForcesGroup', Row: 1, Width: 6, Min: 0, Max: 1 } },
			'PictFlowLayoutEditor.Parameters.Repulsion':
			{ Name: 'Repulsion', Hash: 'Repulsion', DataType: 'PreciseNumber', Default: 8000, PictForm: { Section: 'PFLForcesSection', Group: 'PFLForcesGroup', Row: 2, Width: 12, Min: 0, Max: 100000 } },

			'PictFlowLayoutEditor.Parameters.Iterations':
			{ Name: 'Iterations', Hash: 'Iterations', DataType: 'Number', Default: 200, PictForm: { Section: 'PFLSimSection', Group: 'PFLSimGroup', Row: 1, Width: 6, Min: 1, Max: 2000 } },
			'PictFlowLayoutEditor.Parameters.CoolingFactor':
			{ Name: 'Cooling factor', Hash: 'CoolingFactor', DataType: 'PreciseNumber', Default: 0.95, PictForm: { Section: 'PFLSimSection', Group: 'PFLSimGroup', Row: 1, Width: 6, Min: 0.5, Max: 1 } },
			'PictFlowLayoutEditor.Parameters.InitialTemperature':
			{ Name: 'Initial temperature', Hash: 'InitialTemperature', DataType: 'PreciseNumber', Default: 100, PictForm: { Section: 'PFLSimSection', Group: 'PFLSimGroup', Row: 2, Width: 12, Min: 1, Max: 1000 } },

			'PictFlowLayoutEditor.Parameters.Seed':
			{ Name: 'Random seed', Hash: 'Seed', DataType: 'Number', Default: 42, PictForm: { Section: 'PFLInitSection', Group: 'PFLInitGroup', Row: 1, Width: 6, Min: 0, Max: 2147483647 } },
			'PictFlowLayoutEditor.Parameters.InitialSpread':
			{ Name: 'Initial spread', Hash: 'InitialSpread', DataType: 'PreciseNumber', Default: 400, PictForm: { Section: 'PFLInitSection', Group: 'PFLInitGroup', Row: 1, Width: 6, Min: 0, Max: 5000 } },
			'PictFlowLayoutEditor.Parameters.PreservePositions':
			{ Name: 'Preserve existing positions', Hash: 'PreservePositions', DataType: 'Boolean', Default: false, PictForm: { Section: 'PFLInitSection', Group: 'PFLInitGroup', Row: 2, Width: 12, InputType: 'Boolean' } }
		}
	}
};

function _makeMulberry32(pSeed)
{
	let tmpState = pSeed >>> 0;
	return function ()
	{
		tmpState = (tmpState + 0x6D2B79F5) >>> 0;
		let tmpT = tmpState;
		tmpT = Math.imul(tmpT ^ (tmpT >>> 15), tmpT | 1);
		tmpT ^= tmpT + Math.imul(tmpT ^ (tmpT >>> 7), tmpT | 61);
		return ((tmpT ^ (tmpT >>> 14)) >>> 0) / 4294967296;
	};
}

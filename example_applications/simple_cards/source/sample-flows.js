/**
 * sample-flows.js
 *
 * Showcase graphs for trying out the seven layout algorithms in
 * pict-section-flow. Each sample is a small flow definition with
 * `Name`, `Description`, `Recommended` (layout that shines), and
 * `Flow` (a `_FlowData`-shaped object).
 *
 * Use the dropdown above the flow diagram to load a sample, then
 * open the Algorithm popup to compare layouts. The descriptions
 * call out which layouts shine and which struggle on each shape.
 *
 * All nodes use the 'default' card type with simple In/Out ports —
 * the focus is on graph topology, not on the cards themselves.
 */

// Ultravisor-flavored category palette — same families as
// Ultravisor-CardConfigGenerator's _CategoryColors so the per-node
// hint/border colors here read the same way they do in real flows.
const _CATEGORY_COLORS =
{
	'core':     { TitleBarColor: '#ab47bc', BodyStyle: { fill: '#f3e5f5', stroke: '#ab47bc' } },
	'flow':     { TitleBarColor: '#78909c', BodyStyle: { fill: '#eceff1', stroke: '#78909c' } },
	'data':     { TitleBarColor: '#ff9800', BodyStyle: { fill: '#fff3e0', stroke: '#ff9800' } },
	'file-io':  { TitleBarColor: '#42a5f5', BodyStyle: { fill: '#eaf2f8', stroke: '#42a5f5' } },
	'rest':     { TitleBarColor: '#29b6f6', BodyStyle: { fill: '#e1f5fe', stroke: '#29b6f6' } },
	'meadow':   { TitleBarColor: '#66bb6a', BodyStyle: { fill: '#e8f5e9', stroke: '#66bb6a' } },
	'pipeline': { TitleBarColor: '#ec407a', BodyStyle: { fill: '#fce4ec', stroke: '#ec407a' } },
	'llm':      { TitleBarColor: '#26a69a', BodyStyle: { fill: '#e0f7fa', stroke: '#26a69a' } },
	'ext':      { TitleBarColor: '#9c6afe', BodyStyle: { fill: '#ede9fe', stroke: '#9c6afe' } }
};

function _node(pHash, pTitle, pX, pY, pCategory)
{
	let tmpNode =
	{
		Hash: pHash,
		Type: 'default',
		X: pX,
		Y: pY,
		Width: 140,
		Height: 70,
		Title: pTitle,
		Ports:
		[
			{ Hash: `${pHash}-in`,  Direction: 'input',  Side: 'left',  Label: 'In' },
			{ Hash: `${pHash}-out`, Direction: 'output', Side: 'right', Label: 'Out' }
		],
		Data: {}
	};
	if (pCategory && _CATEGORY_COLORS[pCategory])
	{
		let tmpColors = _CATEGORY_COLORS[pCategory];
		tmpNode.TitleBarColor = tmpColors.TitleBarColor;
		tmpNode.BodyStyle = tmpColors.BodyStyle;
	}
	return tmpNode;
}

function _edge(pSourceHash, pTargetHash, pSuffix)
{
	let tmpHash = `c-${pSourceHash}-${pTargetHash}${pSuffix ? `-${pSuffix}` : ''}`;
	return {
		Hash: tmpHash,
		SourceNodeHash: pSourceHash,
		SourcePortHash: `${pSourceHash}-out`,
		TargetNodeHash: pTargetHash,
		TargetPortHash: `${pTargetHash}-in`,
		Data: {}
	};
}

function _emptyViewState()
{
	return { PanX: 0, PanY: 0, Zoom: 1, SelectedNodeHash: null, SelectedConnectionHash: null, SelectedTetherHash: null };
}

function _flow(pNodes, pConnections, pAlgorithm, pParameters, pAutoApply)
{
	return {
		Nodes: pNodes,
		Connections: pConnections || [],
		OpenPanels: [],
		SavedLayouts: [],
		ViewState: _emptyViewState(),
		LayoutAlgorithm: pAlgorithm || 'Custom',
		LayoutParameters: pParameters || {},
		LayoutAutoApply: !!pAutoApply
	};
}

// ── 1. Linear Chain ────────────────────────────────────────────────────
//   A → B → C → D → E → F
function _linearChain()
{
	let tmpCount = 6;
	let tmpNodes = [];
	let tmpEdges = [];
	for (let i = 0; i < tmpCount; i++)
	{
		let tmpHash = `lc-${String.fromCharCode(65 + i)}`;
		tmpNodes.push(_node(tmpHash, String.fromCharCode(65 + i), 100, 100 + i * 110));
		if (i > 0)
		{
			let tmpPrev = `lc-${String.fromCharCode(65 + i - 1)}`;
			tmpEdges.push(_edge(tmpPrev, tmpHash));
		}
	}
	return _flow(tmpNodes, tmpEdges);
}

// ── 2. Binary Tree (depth 3) ───────────────────────────────────────────
//   Root → 2 children → 4 grandchildren = 7 nodes
function _binaryTree()
{
	let tmpNodes = [];
	let tmpEdges = [];
	let tmpHashes = ['root', 'l', 'r', 'll', 'lr', 'rl', 'rr'];
	let tmpLabels = ['Root', 'L', 'R', 'LL', 'LR', 'RL', 'RR'];
	let tmpPositions = [
		[400, 100],         // root
		[250, 240], [550, 240],   // l, r
		[150, 380], [350, 380], [450, 380], [650, 380]  // ll lr rl rr
	];
	for (let i = 0; i < tmpHashes.length; i++)
	{
		tmpNodes.push(_node(`bt-${tmpHashes[i]}`, tmpLabels[i], tmpPositions[i][0], tmpPositions[i][1]));
	}
	tmpEdges.push(_edge('bt-root', 'bt-l'));
	tmpEdges.push(_edge('bt-root', 'bt-r'));
	tmpEdges.push(_edge('bt-l', 'bt-ll'));
	tmpEdges.push(_edge('bt-l', 'bt-lr'));
	tmpEdges.push(_edge('bt-r', 'bt-rl'));
	tmpEdges.push(_edge('bt-r', 'bt-rr'));
	return _flow(tmpNodes, tmpEdges);
}

// ── 3. Star Hub (1 hub + 8 spokes) ─────────────────────────────────────
// Each spoke gets a distinct Ultravisor-style category color so the
// hint beziers (which are colored by the *other end's* identity) fan
// out in 8 different colors when you hover the hub's "Out" badge.
function _starHub()
{
	let tmpNodes = [];
	let tmpEdges = [];
	let tmpSpokeKinds =
	[
		{ key: 'rest',     label: 'REST API'   },
		{ key: 'meadow',   label: 'Meadow'     },
		{ key: 'data',     label: 'Transform'  },
		{ key: 'file-io',  label: 'File I/O'   },
		{ key: 'pipeline', label: 'Pipeline'   },
		{ key: 'llm',      label: 'LLM'        },
		{ key: 'ext',      label: 'Extension'  },
		{ key: 'flow',     label: 'Control'    }
	];
	tmpNodes.push(_node('star-hub', 'Hub', 400, 350, 'core'));
	for (let i = 0; i < tmpSpokeKinds.length; i++)
	{
		let tmpAngle = (i / tmpSpokeKinds.length) * 2 * Math.PI;
		let tmpX = 400 + Math.round(Math.cos(tmpAngle) * 240);
		let tmpY = 350 + Math.round(Math.sin(tmpAngle) * 240);
		let tmpHash = `star-s${i}`;
		tmpNodes.push(_node(tmpHash, tmpSpokeKinds[i].label, tmpX, tmpY, tmpSpokeKinds[i].key));
		tmpEdges.push(_edge('star-hub', tmpHash));
	}
	return _flow(tmpNodes, tmpEdges);
}

// ── 4. Diamond Lattice ─────────────────────────────────────────────────
//   Start → {A,B,C} → {D,E,F} (cross-edges) → Merge → End. Nine nodes.
function _diamondLattice()
{
	let tmpNodes =
	[
		_node('dl-start',  'Start',  100, 200),
		_node('dl-a',      'A',      300, 100),
		_node('dl-b',      'B',      300, 250),
		_node('dl-c',      'C',      300, 400),
		_node('dl-d',      'D',      550, 100),
		_node('dl-e',      'E',      550, 250),
		_node('dl-f',      'F',      550, 400),
		_node('dl-merge',  'Merge',  800, 250),
		_node('dl-end',    'End',    1050, 250)
	];
	let tmpEdges =
	[
		_edge('dl-start', 'dl-a'),
		_edge('dl-start', 'dl-b'),
		_edge('dl-start', 'dl-c'),
		_edge('dl-a', 'dl-d'),
		_edge('dl-a', 'dl-e'), // cross
		_edge('dl-b', 'dl-e'),
		_edge('dl-c', 'dl-e'), // cross
		_edge('dl-c', 'dl-f'),
		_edge('dl-d', 'dl-merge'),
		_edge('dl-e', 'dl-merge'),
		_edge('dl-f', 'dl-merge'),
		_edge('dl-merge', 'dl-end')
	];
	return _flow(tmpNodes, tmpEdges);
}

// ── 5. Disconnected Components (3 chains × 4 nodes) ────────────────────
function _disconnectedComponents()
{
	let tmpNodes = [];
	let tmpEdges = [];
	let tmpClusters = ['α', 'β', 'γ'];
	for (let c = 0; c < tmpClusters.length; c++)
	{
		for (let i = 0; i < 4; i++)
		{
			let tmpHash = `dc-${tmpClusters[c]}-${i}`;
			tmpNodes.push(_node(tmpHash, `${tmpClusters[c]}${i}`, 150 + c * 350, 100 + i * 110));
			if (i > 0)
			{
				let tmpPrev = `dc-${tmpClusters[c]}-${i - 1}`;
				tmpEdges.push(_edge(tmpPrev, tmpHash));
			}
		}
	}
	return _flow(tmpNodes, tmpEdges);
}

// ── 6. Dense Cluster (7 nodes, ~15 edges, near-complete) ───────────────
function _denseCluster()
{
	let tmpNodes = [];
	let tmpEdges = [];
	let tmpCount = 7;
	for (let i = 0; i < tmpCount; i++)
	{
		let tmpAngle = (i / tmpCount) * 2 * Math.PI;
		let tmpX = 400 + Math.round(Math.cos(tmpAngle) * 200);
		let tmpY = 300 + Math.round(Math.sin(tmpAngle) * 200);
		tmpNodes.push(_node(`dn-${i}`, `N${i}`, tmpX, tmpY));
	}
	// Connect each node to ~3 others (skip-1 and skip-2 patterns) — yields ~14 edges
	for (let i = 0; i < tmpCount; i++)
	{
		tmpEdges.push(_edge(`dn-${i}`, `dn-${(i + 1) % tmpCount}`));
		tmpEdges.push(_edge(`dn-${i}`, `dn-${(i + 2) % tmpCount}`));
	}
	return _flow(tmpNodes, tmpEdges);
}

// ── 7. Cyclic Network (8 nodes, ring + chord) ──────────────────────────
function _cyclicNetwork()
{
	let tmpNodes = [];
	let tmpEdges = [];
	let tmpCount = 8;
	for (let i = 0; i < tmpCount; i++)
	{
		let tmpAngle = (i / tmpCount) * 2 * Math.PI;
		let tmpX = 400 + Math.round(Math.cos(tmpAngle) * 220);
		let tmpY = 300 + Math.round(Math.sin(tmpAngle) * 220);
		tmpNodes.push(_node(`cy-${i}`, `Z${i}`, tmpX, tmpY));
	}
	// Ring of forward edges 0→1→2→…→7→0 (back-edge creates the cycle)
	for (let i = 0; i < tmpCount; i++)
	{
		tmpEdges.push(_edge(`cy-${i}`, `cy-${(i + 1) % tmpCount}`));
	}
	// One chord across the ring
	tmpEdges.push(_edge('cy-0', 'cy-4'));
	return _flow(tmpNodes, tmpEdges);
}

// ── 8. Mesh 4×4 (16 nodes, 4-neighbor edges) ───────────────────────────
function _mesh4x4()
{
	let tmpNodes = [];
	let tmpEdges = [];
	let tmpRows = 4, tmpCols = 4;
	for (let r = 0; r < tmpRows; r++)
	{
		for (let c = 0; c < tmpCols; c++)
		{
			let tmpHash = `mesh-${r}-${c}`;
			tmpNodes.push(_node(tmpHash, `(${r},${c})`, 150 + c * 180, 100 + r * 130));
		}
	}
	for (let r = 0; r < tmpRows; r++)
	{
		for (let c = 0; c < tmpCols; c++)
		{
			if (c < tmpCols - 1) tmpEdges.push(_edge(`mesh-${r}-${c}`, `mesh-${r}-${c + 1}`));
			if (r < tmpRows - 1) tmpEdges.push(_edge(`mesh-${r}-${c}`, `mesh-${r + 1}-${c}`));
		}
	}
	return _flow(tmpNodes, tmpEdges);
}

// ── 9. Floating Widgets (12 isolated nodes, no edges) ──────────────────
function _floatingWidgets()
{
	let tmpNodes = [];
	let tmpLabels = ['Chart', 'Table', 'KPI', 'Gauge', 'Sparkline', 'Heatmap', 'Pie', 'Bar', 'Map', 'Timeline', 'Note', 'Image'];
	for (let i = 0; i < tmpLabels.length; i++)
	{
		let tmpRow = Math.floor(i / 4);
		let tmpCol = i % 4;
		tmpNodes.push(_node(`fw-${i}`, tmpLabels[i], 150 + tmpCol * 180, 100 + tmpRow * 130));
	}
	return _flow(tmpNodes, []);
}

// ── 10. Wide Fan-Out (1 root → 12 leaves) ──────────────────────────────
function _wideFanOut()
{
	let tmpNodes = [];
	let tmpEdges = [];
	tmpNodes.push(_node('fan-root', 'Source', 100, 400));
	for (let i = 0; i < 12; i++)
	{
		let tmpHash = `fan-leaf-${i}`;
		tmpNodes.push(_node(tmpHash, `L${i}`, 400 + (i % 4) * 160, 100 + Math.floor(i / 4) * 130));
		tmpEdges.push(_edge('fan-root', tmpHash));
	}
	return _flow(tmpNodes, tmpEdges);
}

const SAMPLE_FLOWS =
{
	'linear-chain':
	{
		Name: 'Linear Chain',
		Description: 'A → B → C → D → E → F. Six nodes, single path. Layered (left-to-right) and Tabular (top-to-bottom) read like a story; Circular wastes a ring on what should be a line; ForcedFromCenter is overkill.',
		Recommended: 'Layered',
		Flow: _linearChain()
	},
	'binary-tree':
	{
		Name: 'Binary Tree (depth 3)',
		Description: 'Root branches into 2 children, each into 2 grandchildren. Layered shows the hierarchy clearly (depth-by-depth); Circular puts the root at center with leaves on outer ring; Grid loses the parent-child relationships entirely.',
		Recommended: 'Layered',
		Flow: _binaryTree()
	},
	'star-hub':
	{
		Name: 'Star Hub (8 spokes)',
		Description: 'One hub connected to 8 leaves. Circular shines (root at center, spokes evenly around); Layered crowds all 8 spokes in a single second column; ForcedFromCenter does an OK job; Grid ignores the topology completely.',
		Recommended: 'Circular',
		Flow: _starHub()
	},
	'diamond-lattice':
	{
		Name: 'Diamond Lattice (DAG)',
		Description: 'Start fans out to 3 paths through 6 middle nodes (with cross-edges) and merges at End. Layered is in its element — the parallel depth structure becomes obvious. Tabular flattens it; Circular loses direction.',
		Recommended: 'Layered',
		Flow: _diamondLattice()
	},
	'disconnected-components':
	{
		Name: 'Disconnected Components',
		Description: 'Three independent chains of 4 nodes each, no cross-edges. Grid and Columnar give each chain equal real estate. Layered piles the 3 roots in one column. ForcedFromCenter clusters them naturally but with no separation guarantee.',
		Recommended: 'Columnar',
		Flow: _disconnectedComponents()
	},
	'dense-cluster':
	{
		Name: 'Dense Cluster (near-complete)',
		Description: 'Seven nodes with ~14 edges (each node connects to its two nearest neighbors in both directions). ForcedFromCenter shines — spring forces find a clean radial layout. Layered tries to topo-sort it and produces a wide-and-shallow mess. Circular is also pretty good here.',
		Recommended: 'ForcedFromCenter',
		Flow: _denseCluster()
	},
	'cyclic-network':
	{
		Name: 'Cyclic Network',
		Description: 'Eight nodes in a ring plus one chord. The cycle defeats Kahn topological sort — Layered falls back to a "remaining nodes" pass (correct but ugly). Circular renders the ring cleanly. ForcedFromCenter finds a relaxed equilibrium.',
		Recommended: 'Circular',
		Flow: _cyclicNetwork()
	},
	'mesh-4x4':
	{
		Name: 'Mesh 4×4',
		Description: '16 nodes in a 4×4 grid topology with right/down neighbor edges. Grid is the obvious win (the layout matches the data). Columnar (4 cols, FillOrder=row) also nails it. Layered produces a long zig-zag through 7 layers.',
		Recommended: 'Grid',
		Flow: _mesh4x4()
	},
	'floating-widgets':
	{
		Name: 'Floating Widgets (no edges)',
		Description: '12 unconnected nodes — exactly the dashboard-builder shape. Grid, Columnar, and Tabular all produce clean deterministic arrangements. Layered, Circular, and ForcedFromCenter degrade gracefully (single layer / single ring / random spread).',
		Recommended: 'Grid',
		Flow: _floatingWidgets()
	},
	'wide-fan-out':
	{
		Name: 'Wide Fan-Out (1 → 12)',
		Description: 'One source node connects to 12 leaves. Circular places the source at center with leaves on a single outer ring — clean and balanced. Layered makes the second column 12 nodes tall. Grid spreads leaves and loses the source-to-leaf relationship.',
		Recommended: 'Circular',
		Flow: _wideFanOut()
	}
};

module.exports =
{
	SAMPLE_FLOWS: SAMPLE_FLOWS,
	getSampleNames: function ()
	{
		return Object.keys(SAMPLE_FLOWS);
	},
	getSample: function (pKey)
	{
		return SAMPLE_FLOWS[pKey] || null;
	}
};

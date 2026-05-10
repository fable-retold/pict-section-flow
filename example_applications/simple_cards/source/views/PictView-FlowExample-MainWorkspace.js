const libPictView = require('pict-view');
const libPictSectionFlow = require('pict-section-flow');
const libSampleFlows = require('../sample-flows.js');

// FlowCard definitions
const libFlowCardIfThenElse = require('../cards/FlowCard-IfThenElse.js');
const libFlowCardSwitch = require('../cards/FlowCard-Switch.js');
const libFlowCardEach = require('../cards/FlowCard-Each.js');
const libFlowCardFileRead = require('../cards/FlowCard-FileRead.js');
const libFlowCardFileWrite = require('../cards/FlowCard-FileWrite.js');
const libFlowCardLogValues = require('../cards/FlowCard-LogValues.js');
const libFlowCardSetValue = require('../cards/FlowCard-SetValue.js');
const libFlowCardGetValue = require('../cards/FlowCard-GetValue.js');
const libFlowCardStatusMonitor = require('../cards/FlowCard-StatusMonitor.js');
const libFlowCardDataPreview = require('../cards/FlowCard-DataPreview.js');
const libFlowCardSparkline = require('../cards/FlowCard-Sparkline.js');
const libFlowCardComment = require('../cards/FlowCard-Comment.js');

const _ViewConfiguration =
{
	ViewIdentifier: "FlowExample-MainWorkspace",

	DefaultRenderable: "FlowExample-MainWorkspace-Content",
	DefaultDestinationAddress: "#FlowExample-Content-Container",

	AutoRender: false,

	CSS: /*css*/`
		.flowexample-workspace {
			padding: 0.75em;
			display: flex;
			flex-direction: column;
			flex: 1;
			min-height: 0;
		}
		.flowexample-workspace-header {
			flex-shrink: 0;
			margin: 0 0 0.75em 0;
			padding-bottom: 0.75em;
			border-bottom: 1px solid var(--theme-color-border-light, #eee);
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
		}
		.flowexample-workspace-header h1 {
			margin: 0 0 0.25em 0;
			font-size: 2em;
			font-weight: 300;
			color: #2c3e50;
		}
		.flowexample-workspace-header p {
			margin: 0;
			color: #7f8c8d;
			font-size: 1.1em;
		}
		.flowexample-help-toggle {
			flex-shrink: 0;
			margin-left: 1em;
			width: 36px;
			height: 36px;
			border-radius: 50%;
			border: 2px solid #3498db;
			background: var(--theme-color-background-panel, #fff);
			color: #3498db;
			font-size: 1.2em;
			font-weight: 700;
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			transition: background 0.15s, color 0.15s;
		}
		.flowexample-help-toggle:hover {
			background: #3498db;
			color: var(--theme-color-background-panel, #fff);
		}
		.flowexample-help-toggle.active {
			background: #3498db;
			color: var(--theme-color-background-panel, #fff);
		}
		#FlowExample-Flow-Container {
			flex: 1;
			min-height: 0;
		}
		.flowexample-sample-bar {
			flex-shrink: 0;
			margin: 0 0 0.75em 0;
			padding: 0.6em 0.75em;
			background: var(--theme-color-background-panel, #fff);
			border: 1px solid var(--theme-color-border-light, #dee2e6);
			border-radius: 6px;
			display: flex;
			align-items: center;
			gap: 0.6em;
			flex-wrap: wrap;
		}
		.flowexample-sample-bar label {
			font-weight: 600;
			color: #2c3e50;
			font-size: 0.9em;
		}
		.flowexample-sample-bar select {
			padding: 0.35em 0.55em;
			border: 1px solid #ced4da;
			border-radius: 4px;
			background: #fff;
			font-size: 0.95em;
			min-width: 220px;
		}
		.flowexample-sample-description {
			flex: 1;
			min-width: 280px;
			color: #5a6470;
			font-size: 0.85em;
			line-height: 1.4;
		}
		.flowexample-sample-recommended {
			padding: 0.2em 0.55em;
			background: #eaf6ee;
			color: #1f7a3f;
			border-radius: 4px;
			font-size: 0.8em;
			font-weight: 600;
			white-space: nowrap;
		}
		.flowexample-help-panel {
			flex-shrink: 0;
			display: none;
			margin-bottom: 0.75em;
			padding: 1.5em;
			background: #f8f9fa;
			border: 1px solid #dee2e6;
			border-radius: 8px;
		}
		.flowexample-help-panel.visible {
			display: block;
		}
		.flowexample-help-panel h3 {
			margin: 0 0 1em 0;
			font-size: 1.1em;
			font-weight: 600;
			color: #2c3e50;
		}
		.flowexample-hints {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
			gap: 1em;
		}
		.flowexample-hint {
			background: var(--theme-color-background-panel, #fff);
			border: 1px solid var(--theme-color-border-default, #e0e0e0);
			border-radius: 6px;
			padding: 1em 1.25em;
		}
		.flowexample-hint h4 {
			margin: 0 0 0.35em 0;
			font-size: 0.95em;
			color: #2c3e50;
		}
		.flowexample-hint p {
			margin: 0;
			color: var(--theme-color-text-secondary, #666);
			font-size: 0.85em;
			line-height: 1.5;
		}
		.flowexample-hint code {
			background: #f4f4f5;
			padding: 0.1em 0.3em;
			border-radius: 3px;
			font-size: 0.9em;
			color: var(--theme-color-status-error, #e74c3c);
		}
	`,

	Templates:
	[
		{
			Hash: "FlowExample-MainWorkspace-Template",
			Template: /*html*/`
<div class="flowexample-workspace">
	<div class="flowexample-workspace-header">
		<div>
			<h1>Flow Diagram</h1>
			<p>Build flow diagrams from cards. Open the Card Palette to browse available cards, or select a node type from the dropdown and click + Add Node.</p>
		</div>
		<button class="flowexample-help-toggle" id="FlowExample-HelpToggle" title="Toggle help">?</button>
	</div>
	<div class="flowexample-help-panel" id="FlowExample-HelpPanel">
		<h3>Quick Reference</h3>
		<div class="flowexample-hints">
			<div class="flowexample-hint">
				<h4>Add Nodes</h4>
				<p>Select a node type from the dropdown and click <code>+ Add Node</code> in the toolbar.</p>
			</div>
			<div class="flowexample-hint">
				<h4>Connect Nodes</h4>
				<p>Drag from a green output port to a blue input port to create a connection.</p>
			</div>
			<div class="flowexample-hint">
				<h4>Move Nodes</h4>
				<p>Click and drag any node to reposition it. Connections update automatically.</p>
			</div>
			<div class="flowexample-hint">
				<h4>Pan &amp; Zoom</h4>
				<p>Click and drag the background to pan. Use the mouse wheel to zoom in and out.</p>
			</div>
			<div class="flowexample-hint">
				<h4>Delete</h4>
				<p>Select a node or connection and press <code>Delete</code> or click the Delete button.</p>
			</div>
			<div class="flowexample-hint">
				<h4>Auto Layout</h4>
				<p>Click <code>Auto Layout</code> in the toolbar to automatically arrange nodes left to right.</p>
			</div>
			<div class="flowexample-hint">
				<h4>Properties Panel</h4>
				<p>Double-click a node to open its properties panel (if the card type defines one).</p>
			</div>
			<div class="flowexample-hint">
				<h4>Save Layouts</h4>
				<p>Use the Layouts toolbar to save, restore, and delete named arrangement snapshots.</p>
			</div>
		</div>
	</div>
	<div class="flowexample-sample-bar">
		<label for="FlowExample-SampleSelect">Sample graph:</label>
		<select id="FlowExample-SampleSelect"></select>
		<span class="flowexample-sample-recommended" id="FlowExample-SampleRecommended"></span>
		<span class="flowexample-sample-description" id="FlowExample-SampleDescription">Pick a sample, then open the <strong>Algorithm</strong> popup in the toolbar to compare layouts.</span>
	</div>
	<div id="FlowExample-Flow-Container"></div>
</div>
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: "FlowExample-MainWorkspace-Content",
			TemplateHash: "FlowExample-MainWorkspace-Template",
			DestinationAddress: "#FlowExample-Content-Container",
			RenderMethod: "replace"
		}
	]
};

class FlowExampleMainWorkspaceView extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		this._FlowView = null;
	}

	/**
	 * Build a map of FlowCard node type configurations keyed by hash.
	 * These are passed as NodeTypes in the FlowView options so they
	 * are available from the moment the NodeTypeProvider is created,
	 * before the toolbar renders.
	 */
	_buildFlowCardNodeTypes()
	{
		let tmpCardClasses =
		[
			libFlowCardIfThenElse,
			libFlowCardSwitch,
			libFlowCardEach,
			libFlowCardFileRead,
			libFlowCardFileWrite,
			libFlowCardLogValues,
			libFlowCardSetValue,
			libFlowCardGetValue,
			libFlowCardStatusMonitor,
			libFlowCardDataPreview,
			libFlowCardSparkline,
			libFlowCardComment
		];

		let tmpNodeTypes = {};

		for (let i = 0; i < tmpCardClasses.length; i++)
		{
			let tmpCard = new tmpCardClasses[i](this.fable, {}, `FlowCard-${i}`);
			let tmpConfig = tmpCard.getNodeTypeConfiguration();
			tmpNodeTypes[tmpConfig.Hash] = tmpConfig;
		}

		return tmpNodeTypes;
	}

	onAfterRender(pRenderable, pRenderDestinationAddress, pRecord, pContent)
	{
		// Create and render the flow section view into its container
		if (!this._FlowView)
		{
			this._FlowView = this.pict.addView('FlowExample-FlowDiagram',
				{
					ViewIdentifier: 'FlowExample-FlowDiagram',

					DefaultRenderable: 'Flow-Container',
					DefaultDestinationAddress: '#FlowExample-Flow-Container',

					AutoRender: false,

					FlowDataAddress: 'AppData.FlowExample.SampleFlow',

					TargetElementAddress: '#Flow-SVG-Container',

					EnableToolbar: true,
					EnablePanning: true,
					EnableZooming: true,
					EnableNodeDragging: true,
					EnableConnectionCreation: true,
					EnableGridSnap: false,
					GridSnapSize: 20,

					MinZoom: 0.1,
					MaxZoom: 5.0,
					ZoomStep: 0.1,

					DefaultNodeType: 'default',
					DefaultNodeWidth: 180,
					DefaultNodeHeight: 80,

					// Pre-register FlowCard node types so they are available
					// when the NodeTypeProvider is created, before toolbar renders
					NodeTypes: this._buildFlowCardNodeTypes(),

					Renderables:
					[
						{
							RenderableHash: 'Flow-Container',
							TemplateHash: 'Flow-Container-Template',
							DestinationAddress: '#FlowExample-Flow-Container',
							RenderMethod: 'replace'
						}
					]
				},
				libPictSectionFlow
			);
		}

		// Reset the flow view's render state so it re-initializes SVG elements
		// when re-rendered (e.g. after navigating away and back)
		this._FlowView.initialRenderComplete = false;
		this._FlowView.render();

		// Wire up the help toggle button
		let tmpHelpToggle = document.getElementById('FlowExample-HelpToggle');
		let tmpHelpPanel = document.getElementById('FlowExample-HelpPanel');
		if (tmpHelpToggle && tmpHelpPanel)
		{
			tmpHelpToggle.addEventListener('click', function ()
			{
				tmpHelpPanel.classList.toggle('visible');
				tmpHelpToggle.classList.toggle('active');
			});
		}

		// Populate the sample-graph selector and wire its change handler.
		this._populateSampleSelector();

		return super.onAfterRender(pRenderable, pRenderDestinationAddress, pRecord, pContent);
	}

	/**
	 * Populate the sample-graph dropdown above the flow diagram and wire
	 * the change handler. The first option ("Hello World") is the rich
	 * default flow that lives in AppData.FlowExample.SampleFlow; the rest
	 * come from sample-flows.js and showcase a different layout strength.
	 */
	_populateSampleSelector()
	{
		let tmpSelect = document.getElementById('FlowExample-SampleSelect');
		let tmpDesc   = document.getElementById('FlowExample-SampleDescription');
		let tmpReco   = document.getElementById('FlowExample-SampleRecommended');
		if (!tmpSelect || !tmpDesc || !tmpReco) return;

		// Clear pre-existing options
		while (tmpSelect.firstChild) tmpSelect.removeChild(tmpSelect.firstChild);

		let tmpHelloOpt = document.createElement('option');
		tmpHelloOpt.value = '__hello-world__';
		tmpHelloOpt.textContent = 'Hello World — multi-feature reference';
		tmpSelect.appendChild(tmpHelloOpt);

		let tmpKeys = libSampleFlows.getSampleNames();
		for (let i = 0; i < tmpKeys.length; i++)
		{
			let tmpSample = libSampleFlows.getSample(tmpKeys[i]);
			let tmpOpt = document.createElement('option');
			tmpOpt.value = tmpKeys[i];
			tmpOpt.textContent = tmpSample.Name;
			tmpSelect.appendChild(tmpOpt);
		}

		// Initial description (Hello World)
		tmpDesc.innerHTML = 'Pick a sample, then open the <strong>Algorithm</strong> popup in the toolbar to compare layouts.';
		tmpReco.style.display = 'none';

		let tmpView = this;
		tmpSelect.addEventListener('change', function ()
		{
			let tmpKey = tmpSelect.value;
			tmpView._loadSample(tmpKey, tmpDesc, tmpReco);
		});
	}

	/**
	 * Load a sample flow into the FlowView. `__hello-world__` reloads the
	 * original AppData-backed flow; everything else comes from sample-flows.
	 *
	 * @param {string} pKey
	 * @param {HTMLElement} pDescEl
	 * @param {HTMLElement} pRecoEl
	 */
	_loadSample(pKey, pDescEl, pRecoEl)
	{
		if (!this._FlowView) return;

		if (pKey === '__hello-world__')
		{
			this._FlowView.setFlowData(this.pict.AppData.FlowExample.SampleFlow);
			pDescEl.innerHTML = 'The full reference flow with all card types, properties panels, and an error branch. Originally designed by hand — set <code>LayoutAlgorithm</code> to <em>Layered</em> to see how the auto-layout compares.';
			pRecoEl.style.display = 'none';
			return;
		}

		let tmpSample = libSampleFlows.getSample(pKey);
		if (!tmpSample) return;

		// setFlowData expects a fresh _FlowData-shaped object — deep clone so
		// re-loading the same sample doesn't share mutated node references
		// with prior loads.
		this._FlowView.setFlowData(JSON.parse(JSON.stringify(tmpSample.Flow)));
		pDescEl.textContent = tmpSample.Description;
		if (tmpSample.Recommended)
		{
			pRecoEl.style.display = '';
			pRecoEl.textContent = `Try: ${tmpSample.Recommended}`;
		}
		else
		{
			pRecoEl.style.display = 'none';
		}
	}
}

module.exports = FlowExampleMainWorkspaceView;

module.exports.default_configuration = _ViewConfiguration;

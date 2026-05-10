const libPictView = require('pict-view');

const _DefaultConfiguration =
{
	ViewIdentifier: 'Flow-Toolbar',

	DefaultRenderable: 'Flow-Toolbar-Content',
	DefaultDestinationAddress: '#Flow-Toolbar-Container',

	AutoRender: false,

	FlowViewIdentifier: 'Pict-Flow',

	EnablePalette: true,
	EnableAddNode: true,
	EnableCardPalette: true,

	CSS: false,

	Templates:
	[
		{
			Hash: 'Flow-Toolbar-Template',
			Template: /*html*/`
<div class="pict-flow-toolbar" id="Flow-Toolbar-Bar-{~D:Record.FlowViewIdentifier~}">
	<div class="pict-flow-toolbar-group">
		<button class="pict-flow-toolbar-btn" data-flow-action="add-node" id="Flow-Toolbar-AddNode-{~D:Record.FlowViewIdentifier~}" title="Add Node">
			<span class="pict-flow-toolbar-btn-icon" id="Flow-Toolbar-Icon-plus-{~D:Record.FlowViewIdentifier~}"></span>
			<span class="pict-flow-toolbar-btn-text">Node</span>
		</button>
		<button class="pict-flow-toolbar-btn" data-flow-action="cards-popup" id="Flow-Toolbar-Cards-{~D:Record.FlowViewIdentifier~}" title="Card Palette">
			<span class="pict-flow-toolbar-btn-icon" id="Flow-Toolbar-Icon-cards-{~D:Record.FlowViewIdentifier~}"></span>
			<span class="pict-flow-toolbar-btn-text">Cards</span>
			<span class="pict-flow-toolbar-btn-chevron" id="Flow-Toolbar-CardsChevron-{~D:Record.FlowViewIdentifier~}"></span>
		</button>
		<button class="pict-flow-toolbar-btn" data-flow-action="delete-selected" title="Delete Node">
			<span class="pict-flow-toolbar-btn-icon" id="Flow-Toolbar-Icon-trash-{~D:Record.FlowViewIdentifier~}"></span>
		</button>
	</div>
	<div class="pict-flow-toolbar-group">
		<button class="pict-flow-toolbar-btn" data-flow-action="layout-popup" id="Flow-Toolbar-Layout-{~D:Record.FlowViewIdentifier~}" title="Manage saved layouts">
			<span class="pict-flow-toolbar-btn-icon" id="Flow-Toolbar-Icon-layout-{~D:Record.FlowViewIdentifier~}"></span>
			<span class="pict-flow-toolbar-btn-text">Layouts</span>
			<span class="pict-flow-toolbar-btn-chevron" id="Flow-Toolbar-LayoutChevron-{~D:Record.FlowViewIdentifier~}"></span>
		</button>
		<div class="pict-flow-toolbar-btn-split" id="Flow-Toolbar-Auto-{~D:Record.FlowViewIdentifier~}">
			<button class="pict-flow-toolbar-btn pict-flow-toolbar-btn-split-main" data-flow-action="apply-current-layout" title="Apply current layout algorithm">
				<span class="pict-flow-toolbar-btn-icon" id="Flow-Toolbar-Icon-auto-{~D:Record.FlowViewIdentifier~}"></span>
				<span class="pict-flow-toolbar-btn-text">Auto</span>
			</button>
			<button class="pict-flow-toolbar-btn pict-flow-toolbar-btn-split-chevron" data-flow-action="layout-algorithm-popup" title="Choose layout algorithm">
				<span class="pict-flow-toolbar-btn-chevron" id="Flow-Toolbar-AutoChevron-{~D:Record.FlowViewIdentifier~}"></span>
			</button>
		</div>
	</div>
	<div class="pict-flow-toolbar-group">
		<button class="pict-flow-toolbar-btn" data-flow-action="zoom-in" title="Zoom In">
			<span class="pict-flow-toolbar-btn-icon" id="Flow-Toolbar-Icon-zoom-in-{~D:Record.FlowViewIdentifier~}"></span>
		</button>
		<button class="pict-flow-toolbar-btn" data-flow-action="zoom-out" title="Zoom Out">
			<span class="pict-flow-toolbar-btn-icon" id="Flow-Toolbar-Icon-zoom-out-{~D:Record.FlowViewIdentifier~}"></span>
		</button>
		<button class="pict-flow-toolbar-btn" data-flow-action="zoom-fit" title="Fit to View">
			<span class="pict-flow-toolbar-btn-icon" id="Flow-Toolbar-Icon-zoom-fit-{~D:Record.FlowViewIdentifier~}"></span>
		</button>
	</div>
	<div class="pict-flow-toolbar-group pict-flow-toolbar-right">
		<button class="pict-flow-toolbar-btn" data-flow-action="settings-popup" id="Flow-Toolbar-Settings-{~D:Record.FlowViewIdentifier~}" title="Theme Settings">
			<span class="pict-flow-toolbar-btn-icon" id="Flow-Toolbar-Icon-settings-{~D:Record.FlowViewIdentifier~}"></span>
		</button>
		<button class="pict-flow-toolbar-btn" data-flow-action="fullscreen" id="Flow-Toolbar-Fullscreen-{~D:Record.FlowViewIdentifier~}" title="Toggle Fullscreen">
			<span class="pict-flow-toolbar-btn-icon" id="Flow-Toolbar-Fullscreen-Icon-{~D:Record.FlowViewIdentifier~}"></span>
		</button>
		<button class="pict-flow-toolbar-btn" data-flow-action="toggle-floating" title="Float">
			<span class="pict-flow-toolbar-btn-icon" id="Flow-Toolbar-Icon-grip-{~D:Record.FlowViewIdentifier~}"></span>
		</button>
		<button class="pict-flow-toolbar-btn" data-flow-action="collapse-toolbar" title="Collapse Toolbar">
			<span class="pict-flow-toolbar-btn-icon" id="Flow-Toolbar-Icon-collapse-{~D:Record.FlowViewIdentifier~}"></span>
		</button>
	</div>
</div>
<div class="pict-flow-toolbar-collapsed" id="Flow-Toolbar-Collapsed-{~D:Record.FlowViewIdentifier~}">
	<button class="pict-flow-toolbar-expand-btn" data-flow-action="expand-toolbar" title="Expand Toolbar" id="Flow-Toolbar-ExpandBtn-{~D:Record.FlowViewIdentifier~}">
		<span id="Flow-Toolbar-Icon-expand-{~D:Record.FlowViewIdentifier~}"></span>
	</button>
</div>
<div class="pict-flow-toolbar-popup-anchor" id="Flow-Toolbar-PopupAnchor-{~D:Record.FlowViewIdentifier~}">
</div>
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'Flow-Toolbar-Content',
			TemplateHash: 'Flow-Toolbar-Template',
			DestinationAddress: '#Flow-Toolbar-Container',
			RenderMethod: 'replace'
		}
	]
};

class PictViewFlowToolbar extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, JSON.parse(JSON.stringify(_DefaultConfiguration)), pOptions);
		super(pFable, tmpOptions, pServiceHash);

		this.serviceType = 'PictViewFlowToolbar';

		this._FlowView = null;

		// Toolbar mode state
		this._ToolbarMode = 'docked'; // 'docked' | 'floating' | 'collapsed'
		this._ActivePopup = null;     // 'add-node' | 'cards' | 'layout' | null
		this._FloatingPosition = { X: 80, Y: 80 };
		this._DocumentClickHandler = null;
		this._FloatingToolbarView = null;

		// Layout-algorithm parameter form (pict-section-form metacontroller).
		// Lazily created on first popup open; null until then. Falls back to
		// hand-rolled inputs when PictFormMetacontroller is not registered.
		this._LayoutFormMetacontroller = null;
		this._LayoutFormHostID = null;
		// Whether the parameter form is expanded inside the popup. Persists
		// across popup opens so a user who collapsed it doesn't have to
		// re-collapse on every reopen. Defaults to expanded.
		this._LayoutFormExpanded = true;
	}

	render(pRenderableHash, pRenderDestinationAddress, pTemplateRecordAddress)
	{
		// Pass this.options as the template record so {~D:Record.FlowViewIdentifier~}
		// resolves correctly in the toolbar template.
		return super.render(pRenderableHash, pRenderDestinationAddress, this.options);
	}

	onAfterRender(pRenderable, pRenderDestinationAddress, pRecord, pContent)
	{
		let tmpFlowViewIdentifier = this.options.FlowViewIdentifier;

		// Bind toolbar button events via event delegation
		let tmpToolbarBar = this.pict.ContentAssignment.getElement(`#Flow-Toolbar-Bar-${tmpFlowViewIdentifier}`);
		if (tmpToolbarBar.length > 0)
		{
			tmpToolbarBar[0].addEventListener('click', (pEvent) =>
			{
				let tmpTarget = pEvent.target;
				if (!tmpTarget) return;

				// Walk up to find the button with the action
				let tmpButton = tmpTarget.closest('[data-flow-action]');
				if (!tmpButton) return;

				let tmpAction = tmpButton.getAttribute('data-flow-action');
				this._handleToolbarAction(tmpAction);
			});
		}

		// Bind expand button click (it's outside the main toolbar bar)
		let tmpExpandBtn = this.pict.ContentAssignment.getElement(`#Flow-Toolbar-ExpandBtn-${tmpFlowViewIdentifier}`);
		if (tmpExpandBtn.length > 0)
		{
			tmpExpandBtn[0].addEventListener('click', () =>
			{
				this._setToolbarMode('docked');
			});
		}

		// Populate SVG icons for toolbar buttons
		this._populateToolbarIcons();

		// Remove buttons from DOM based on options
		if (this.options.EnableAddNode === false)
		{
			let tmpAddNodeBtn = this.pict.ContentAssignment.getElement(`#Flow-Toolbar-AddNode-${tmpFlowViewIdentifier}`);
			if (tmpAddNodeBtn.length > 0)
			{
				tmpAddNodeBtn[0].remove();
			}
		}
		if (this.options.EnableCardPalette === false)
		{
			let tmpCardsBtn = this.pict.ContentAssignment.getElement(`#Flow-Toolbar-Cards-${tmpFlowViewIdentifier}`);
			if (tmpCardsBtn.length > 0)
			{
				tmpCardsBtn[0].remove();
			}
		}
		if (this.options.EnableLayoutMenu === false)
		{
			let tmpAutoBtn = this.pict.ContentAssignment.getElement(`#Flow-Toolbar-Auto-${tmpFlowViewIdentifier}`);
			if (tmpAutoBtn.length > 0)
			{
				tmpAutoBtn[0].remove();
			}
		}

		return super.onAfterRender(pRenderable, pRenderDestinationAddress, pRecord, pContent);
	}

	// ── Icon Population ───────────────────────────────────────────────────

	/**
	 * Populate SVG icons for all toolbar buttons.
	 */
	_populateToolbarIcons()
	{
		let tmpIconProvider = this._FlowView ? this._FlowView._IconProvider : null;
		if (!tmpIconProvider) return;

		let tmpFlowViewIdentifier = this.options.FlowViewIdentifier;

		// Map of element ID suffix → icon key
		let tmpIconMap =
		{
			'plus': 'plus',
			'trash': 'trash',
			'zoom-in': 'zoom-in',
			'zoom-out': 'zoom-out',
			'zoom-fit': 'zoom-fit',
			'auto': 'auto-layout',
			'cards': 'cards',
			'layout': 'layout',
			'settings': 'settings',
			'grip': 'grip',
			'collapse': 'collapse',
			'expand': 'expand'
		};

		let tmpKeys = Object.keys(tmpIconMap);
		for (let i = 0; i < tmpKeys.length; i++)
		{
			let tmpElementId = `Flow-Toolbar-Icon-${tmpKeys[i]}-${tmpFlowViewIdentifier}`;
			let tmpElements = this.pict.ContentAssignment.getElement(`#${tmpElementId}`);
			if (tmpElements.length > 0)
			{
				tmpElements[0].innerHTML = tmpIconProvider.getIconSVGMarkup(tmpIconMap[tmpKeys[i]], 14);
			}
		}

		// Fullscreen icon
		let tmpFullscreenIcon = this.pict.ContentAssignment.getElement(`#Flow-Toolbar-Fullscreen-Icon-${tmpFlowViewIdentifier}`);
		if (tmpFullscreenIcon.length > 0)
		{
			tmpFullscreenIcon[0].innerHTML = tmpIconProvider.getIconSVGMarkup('fullscreen', 14);
		}

		// Chevrons (smaller)
		let tmpCardsChevron = this.pict.ContentAssignment.getElement(`#Flow-Toolbar-CardsChevron-${tmpFlowViewIdentifier}`);
		if (tmpCardsChevron.length > 0)
		{
			tmpCardsChevron[0].innerHTML = tmpIconProvider.getIconSVGMarkup('chevron-down', 8);
		}

		let tmpLayoutChevron = this.pict.ContentAssignment.getElement(`#Flow-Toolbar-LayoutChevron-${tmpFlowViewIdentifier}`);
		if (tmpLayoutChevron.length > 0)
		{
			tmpLayoutChevron[0].innerHTML = tmpIconProvider.getIconSVGMarkup('chevron-down', 8);
		}

		let tmpAutoChevron = this.pict.ContentAssignment.getElement(`#Flow-Toolbar-AutoChevron-${tmpFlowViewIdentifier}`);
		if (tmpAutoChevron.length > 0)
		{
			tmpAutoChevron[0].innerHTML = tmpIconProvider.getIconSVGMarkup('chevron-down', 8);
		}
	}

	// ── Popup Management ──────────────────────────────────────────────────

	/**
	 * Open a popup below a trigger button.
	 * @param {string} pType - 'add-node' | 'cards' | 'layout'
	 */
	_openPopup(pType)
	{
		// Toggle off if already open
		if (this._ActivePopup === pType)
		{
			this._closePopup();
			return;
		}

		// Close any existing popup first
		this._closePopup();

		let tmpFlowViewIdentifier = this.options.FlowViewIdentifier;
		let tmpAnchor = this.pict.ContentAssignment.getElement(`#Flow-Toolbar-PopupAnchor-${tmpFlowViewIdentifier}`);
		if (tmpAnchor.length < 1) return;

		// Create popup div
		let tmpPopup = document.createElement('div');
		tmpPopup.className = 'pict-flow-toolbar-popup';
		tmpPopup.setAttribute('id', `Flow-Toolbar-Popup-${tmpFlowViewIdentifier}`);

		// Build popup content
		switch (pType)
		{
			case 'add-node':
				this._buildAddNodePopup(tmpPopup);
				break;
			case 'cards':
				this._buildCardsPopup(tmpPopup);
				break;
			case 'layout':
				this._buildLayoutPopup(tmpPopup);
				break;
			case 'layout-algorithm':
				this._buildLayoutAlgorithmPopup(tmpPopup);
				break;
			case 'settings':
				this._buildSettingsPopup(tmpPopup);
				break;
		}

		tmpAnchor[0].appendChild(tmpPopup);
		this._ActivePopup = pType;

		// Position the popup below the trigger button
		this._positionPopup(tmpPopup, pType);

		// Click-outside-to-close handler (delayed to avoid catching the opening click)
		setTimeout(() =>
		{
			this._DocumentClickHandler = (pEvent) =>
			{
				if (!tmpPopup.contains(pEvent.target))
				{
					// Check if click was on the trigger button itself (toggle behavior)
					let tmpButton = pEvent.target.closest('[data-flow-action]');
					if (tmpButton)
					{
						let tmpAction = tmpButton.getAttribute('data-flow-action');
						if (tmpAction === pType || tmpAction === pType.replace('-popup', '') + '-popup')
						{
							return; // Let the toggle handle it
						}
					}
					this._closePopup();
				}
			};
			document.addEventListener('click', this._DocumentClickHandler, true);
		}, 0);

		// Focus search input if Add Node popup
		if (pType === 'add-node')
		{
			let tmpSearch = tmpPopup.querySelector('.pict-flow-popup-search');
			if (tmpSearch)
			{
				setTimeout(() => { tmpSearch.focus(); }, 50);
			}
		}
	}

	/**
	 * Close the active popup and clean up.
	 */
	_closePopup()
	{
		if (this._DocumentClickHandler)
		{
			document.removeEventListener('click', this._DocumentClickHandler, true);
			this._DocumentClickHandler = null;
		}

		let tmpFlowViewIdentifier = this.options.FlowViewIdentifier;
		let tmpPopup = this.pict.ContentAssignment.getElement(`#Flow-Toolbar-Popup-${tmpFlowViewIdentifier}`);
		if (tmpPopup.length > 0)
		{
			tmpPopup[0].parentNode.removeChild(tmpPopup[0]);
		}

		this._ActivePopup = null;
	}

	/**
	 * Position a popup below its trigger button.
	 * @param {HTMLElement} pPopupDiv
	 * @param {string} pType
	 */
	_positionPopup(pPopupDiv, pType)
	{
		let tmpFlowViewIdentifier = this.options.FlowViewIdentifier;

		// Determine which button triggered the popup
		let tmpTriggerSelector;
		switch (pType)
		{
			case 'add-node':
				tmpTriggerSelector = `#Flow-Toolbar-AddNode-${tmpFlowViewIdentifier}`;
				break;
			case 'cards':
				tmpTriggerSelector = `#Flow-Toolbar-Cards-${tmpFlowViewIdentifier}`;
				break;
			case 'layout':
				tmpTriggerSelector = `#Flow-Toolbar-Layout-${tmpFlowViewIdentifier}`;
				break;
			case 'layout-algorithm':
				tmpTriggerSelector = `#Flow-Toolbar-Auto-${tmpFlowViewIdentifier}`;
				break;
			case 'settings':
				tmpTriggerSelector = `#Flow-Toolbar-Settings-${tmpFlowViewIdentifier}`;
				break;
			default:
				return;
		}

		let tmpTriggerElements = this.pict.ContentAssignment.getElement(tmpTriggerSelector);
		if (tmpTriggerElements.length < 1) return;

		let tmpAnchor = this.pict.ContentAssignment.getElement(`#Flow-Toolbar-PopupAnchor-${tmpFlowViewIdentifier}`);
		if (tmpAnchor.length < 1) return;

		let tmpTriggerRect = tmpTriggerElements[0].getBoundingClientRect();
		let tmpAnchorRect = tmpAnchor[0].getBoundingClientRect();

		let tmpLeft = tmpTriggerRect.left - tmpAnchorRect.left;
		pPopupDiv.style.left = tmpLeft + 'px';
		pPopupDiv.style.top = '0px';
	}

	// ── Add Node Popup ────────────────────────────────────────────────────

	/**
	 * Build the searchable Add Node popup content.
	 * @param {HTMLElement} pContainer
	 */
	_buildAddNodePopup(pContainer)
	{
		// Search wrapper
		let tmpSearchWrapper = document.createElement('div');
		tmpSearchWrapper.className = 'pict-flow-popup-search-wrapper';

		let tmpSearchIcon = document.createElement('span');
		tmpSearchIcon.className = 'pict-flow-popup-search-icon';
		let tmpIconProvider = this._FlowView ? this._FlowView._IconProvider : null;
		if (tmpIconProvider)
		{
			tmpSearchIcon.innerHTML = tmpIconProvider.getIconSVGMarkup('search', 12);
		}
		tmpSearchWrapper.appendChild(tmpSearchIcon);

		let tmpSearchInput = document.createElement('input');
		tmpSearchInput.className = 'pict-flow-popup-search';
		tmpSearchInput.setAttribute('type', 'text');
		tmpSearchInput.setAttribute('placeholder', 'Search node types...');
		tmpSearchWrapper.appendChild(tmpSearchInput);
		pContainer.appendChild(tmpSearchWrapper);

		// Node list
		let tmpListDiv = document.createElement('div');
		tmpListDiv.className = 'pict-flow-popup-node-list';
		pContainer.appendChild(tmpListDiv);

		// Initial population
		this._populateNodeList(tmpListDiv, '');

		// Filter on input
		tmpSearchInput.addEventListener('input', () =>
		{
			this._populateNodeList(tmpListDiv, tmpSearchInput.value);
		});
	}

	/**
	 * Populate the node list in the Add Node popup, filtered by search text.
	 * @param {HTMLElement} pListDiv
	 * @param {string} pFilter
	 */
	_populateNodeList(pListDiv, pFilter)
	{
		if (!this._FlowView || !this._FlowView._NodeTypeProvider) return;

		// Clear
		while (pListDiv.firstChild)
		{
			pListDiv.removeChild(pListDiv.firstChild);
		}

		let tmpTypes = this._FlowView._NodeTypeProvider.getNodeTypes();
		let tmpTypeKeys = Object.keys(tmpTypes);
		let tmpFilter = (pFilter || '').toLowerCase().trim();
		let tmpIconProvider = this._FlowView._IconProvider;
		let tmpMatchCount = 0;

		for (let i = 0; i < tmpTypeKeys.length; i++)
		{
			let tmpTypeConfig = tmpTypes[tmpTypeKeys[i]];
			let tmpMeta = tmpTypeConfig.CardMetadata || {};

			// Skip disabled cards
			if (tmpMeta.Enabled === false) continue;

			// Filter match: label, code, or category
			if (tmpFilter)
			{
				let tmpLabel = (tmpTypeConfig.Label || '').toLowerCase();
				let tmpCode = (tmpMeta.Code || '').toLowerCase();
				let tmpCategory = (tmpMeta.Category || '').toLowerCase();
				if (tmpLabel.indexOf(tmpFilter) < 0 &&
					tmpCode.indexOf(tmpFilter) < 0 &&
					tmpCategory.indexOf(tmpFilter) < 0)
				{
					continue;
				}
			}

			tmpMatchCount++;

			let tmpRow = document.createElement('div');
			tmpRow.className = 'pict-flow-popup-list-item';
			tmpRow.setAttribute('data-node-type', tmpTypeKeys[i]);

			// Icon
			let tmpIconSpan = document.createElement('span');
			tmpIconSpan.className = 'pict-flow-popup-list-item-icon';
			if (tmpIconProvider)
			{
				let tmpResolvedKey = tmpIconProvider.resolveIconKey(tmpMeta);
				tmpIconSpan.innerHTML = tmpIconProvider.getIconSVGMarkup(tmpResolvedKey, 16);
			}
			tmpRow.appendChild(tmpIconSpan);

			// Label
			let tmpLabelSpan = document.createElement('span');
			tmpLabelSpan.className = 'pict-flow-popup-list-item-label';
			tmpLabelSpan.textContent = tmpTypeConfig.Label;
			tmpRow.appendChild(tmpLabelSpan);

			// Code badge
			if (tmpMeta.Code)
			{
				let tmpCodeSpan = document.createElement('span');
				tmpCodeSpan.className = 'pict-flow-popup-list-item-code';
				tmpCodeSpan.textContent = tmpMeta.Code;
				tmpRow.appendChild(tmpCodeSpan);
			}

			// Click handler
			tmpRow.addEventListener('click', () =>
			{
				this._addNodeAtCenter(tmpTypeKeys[i]);
				this._closePopup();
			});

			pListDiv.appendChild(tmpRow);
		}

		if (tmpMatchCount === 0)
		{
			let tmpEmpty = document.createElement('div');
			tmpEmpty.className = 'pict-flow-popup-list-empty';
			tmpEmpty.textContent = 'No matching node types';
			pListDiv.appendChild(tmpEmpty);
		}
	}

	// ── Cards Popup ───────────────────────────────────────────────────────

	/**
	 * Build the Cards popup content with search and categorized palette.
	 * @param {HTMLElement} pContainer
	 */
	_buildCardsPopup(pContainer)
	{
		// Search wrapper
		let tmpSearchWrapper = document.createElement('div');
		tmpSearchWrapper.className = 'pict-flow-popup-search-wrapper';

		let tmpSearchIcon = document.createElement('span');
		tmpSearchIcon.className = 'pict-flow-popup-search-icon';
		let tmpIconProvider = this._FlowView ? this._FlowView._IconProvider : null;
		if (tmpIconProvider)
		{
			tmpSearchIcon.innerHTML = tmpIconProvider.getIconSVGMarkup('search', 12);
		}
		tmpSearchWrapper.appendChild(tmpSearchIcon);

		let tmpSearchInput = document.createElement('input');
		tmpSearchInput.className = 'pict-flow-popup-search';
		tmpSearchInput.setAttribute('type', 'text');
		tmpSearchInput.setAttribute('placeholder', 'Search cards...');
		tmpSearchWrapper.appendChild(tmpSearchInput);
		pContainer.appendChild(tmpSearchWrapper);

		// Palette list container
		let tmpListDiv = document.createElement('div');
		tmpListDiv.className = 'pict-flow-popup-node-list';
		pContainer.appendChild(tmpListDiv);

		// Initial population
		this._renderPalette(tmpListDiv, '');

		// Filter on input
		tmpSearchInput.addEventListener('input', () =>
		{
			this._renderPalette(tmpListDiv, tmpSearchInput.value);
		});

		// Focus search input
		setTimeout(() => { tmpSearchInput.focus(); }, 50);
	}

	/**
	 * Render the card palette with categories and card chips into a container.
	 * @param {HTMLElement} pContainer - The target container element
	 * @param {string} [pFilter] - Optional search filter text
	 */
	_renderPalette(pContainer, pFilter)
	{
		if (!this._FlowView || !this._FlowView._NodeTypeProvider) return;

		// Clear existing content
		while (pContainer.firstChild)
		{
			pContainer.removeChild(pContainer.firstChild);
		}

		let tmpCategories = this._FlowView._NodeTypeProvider.getCardsByCategory();
		let tmpCategoryKeys = Object.keys(tmpCategories);
		let tmpFilter = (pFilter || '').toLowerCase().trim();
		let tmpTotalMatchCount = 0;

		for (let i = 0; i < tmpCategoryKeys.length; i++)
		{
			let tmpCategoryName = tmpCategoryKeys[i];
			let tmpCards = tmpCategories[tmpCategoryName];
			let tmpMatchingCards = [];

			// Filter cards within this category
			for (let j = 0; j < tmpCards.length; j++)
			{
				let tmpCardConfig = tmpCards[j];
				let tmpMeta = tmpCardConfig.CardMetadata || {};

				if (tmpFilter)
				{
					let tmpLabel = (tmpCardConfig.Label || '').toLowerCase();
					let tmpCode = (tmpMeta.Code || '').toLowerCase();
					let tmpCategory = tmpCategoryName.toLowerCase();
					if (tmpLabel.indexOf(tmpFilter) < 0 &&
						tmpCode.indexOf(tmpFilter) < 0 &&
						tmpCategory.indexOf(tmpFilter) < 0)
					{
						continue;
					}
				}

				tmpMatchingCards.push(tmpCardConfig);
			}

			if (tmpMatchingCards.length === 0) continue;

			tmpTotalMatchCount += tmpMatchingCards.length;

			let tmpCategoryDiv = document.createElement('div');
			tmpCategoryDiv.className = 'pict-flow-palette-category';
			tmpCategoryDiv.style.padding = '0.35em 0.5em';

			let tmpCategoryLabel = document.createElement('div');
			tmpCategoryLabel.className = 'pict-flow-palette-category-label';
			tmpCategoryLabel.textContent = tmpCategoryName;
			tmpCategoryDiv.appendChild(tmpCategoryLabel);

			let tmpCardsDiv = document.createElement('div');
			tmpCardsDiv.className = 'pict-flow-palette-cards';

			for (let j = 0; j < tmpMatchingCards.length; j++)
			{
				let tmpCardConfig = tmpMatchingCards[j];
				let tmpMeta = tmpCardConfig.CardMetadata || {};

				let tmpCardEl = document.createElement('div');
				tmpCardEl.className = 'pict-flow-palette-card';
				if (tmpMeta.Enabled === false)
				{
					tmpCardEl.classList.add('disabled');
				}
				tmpCardEl.setAttribute('data-card-type', tmpCardConfig.Hash);

				if (tmpMeta.Tooltip)
				{
					tmpCardEl.setAttribute('title', tmpMeta.Tooltip);
				}
				else if (tmpMeta.Description)
				{
					tmpCardEl.setAttribute('title', tmpMeta.Description);
				}

				// Icon or color swatch
				if (tmpMeta.Icon)
				{
					let tmpIconSpan = document.createElement('span');
					tmpIconSpan.className = 'pict-flow-palette-card-icon';
					let tmpIconProvider = this._FlowView._IconProvider;
					if (tmpIconProvider && !tmpIconProvider.isEmojiIcon(tmpMeta.Icon))
					{
						let tmpResolvedKey = tmpIconProvider.resolveIconKey(tmpMeta);
						tmpIconSpan.innerHTML = tmpIconProvider.getIconSVGMarkup(tmpResolvedKey, 14);
					}
					else
					{
						tmpIconSpan.textContent = tmpMeta.Icon;
					}
					tmpCardEl.appendChild(tmpIconSpan);
				}
				else if (this._FlowView._IconProvider)
				{
					let tmpIconSpan = document.createElement('span');
					tmpIconSpan.className = 'pict-flow-palette-card-icon';
					tmpIconSpan.innerHTML = this._FlowView._IconProvider.getIconSVGMarkup('default', 14);
					tmpCardEl.appendChild(tmpIconSpan);
				}
				else if (tmpCardConfig.TitleBarColor)
				{
					let tmpSwatch = document.createElement('span');
					tmpSwatch.className = 'pict-flow-palette-card-swatch';
					tmpSwatch.style.backgroundColor = tmpCardConfig.TitleBarColor;
					tmpCardEl.appendChild(tmpSwatch);
				}

				// Title
				let tmpTitleSpan = document.createElement('span');
				tmpTitleSpan.className = 'pict-flow-palette-card-title';
				tmpTitleSpan.textContent = tmpCardConfig.Label;
				tmpCardEl.appendChild(tmpTitleSpan);

				// Code badge
				if (tmpMeta.Code)
				{
					let tmpCodeSpan = document.createElement('span');
					tmpCodeSpan.className = 'pict-flow-palette-card-code';
					tmpCodeSpan.textContent = tmpMeta.Code;
					tmpCardEl.appendChild(tmpCodeSpan);
				}

				// Click handler
				tmpCardEl.addEventListener('click', () =>
				{
					this._addCardFromPalette(tmpCardConfig.Hash);
					this._closePopup();
				});

				tmpCardsDiv.appendChild(tmpCardEl);
			}

			tmpCategoryDiv.appendChild(tmpCardsDiv);
			pContainer.appendChild(tmpCategoryDiv);
		}

		if (tmpTotalMatchCount === 0)
		{
			let tmpEmpty = document.createElement('div');
			tmpEmpty.className = 'pict-flow-popup-list-empty';
			tmpEmpty.textContent = tmpFilter ? 'No matching cards' : 'No card types available';
			pContainer.appendChild(tmpEmpty);
		}
	}

	// ── Layout Popup ──────────────────────────────────────────────────────

	/**
	 * Build the Layout popup content.
	 * @param {HTMLElement} pContainer
	 */
	_buildLayoutPopup(pContainer)
	{
		let tmpIconProvider = this._FlowView ? this._FlowView._IconProvider : null;

		// Save Layout section at top
		let tmpSaveSection = document.createElement('div');
		tmpSaveSection.className = 'pict-flow-popup-layout-save-section';

		// Save input row (hidden initially)
		let tmpSaveInputRow = document.createElement('div');
		tmpSaveInputRow.className = 'pict-flow-popup-layout-save-input-row';
		tmpSaveInputRow.style.display = 'none';

		let tmpSaveInput = document.createElement('input');
		tmpSaveInput.className = 'pict-flow-popup-layout-save-input';
		tmpSaveInput.setAttribute('type', 'text');
		tmpSaveInput.setAttribute('placeholder', 'Layout name...');
		tmpSaveInputRow.appendChild(tmpSaveInput);

		let tmpSaveConfirmBtn = document.createElement('button');
		tmpSaveConfirmBtn.className = 'pict-flow-popup-layout-save-confirm';
		tmpSaveConfirmBtn.title = 'Save';
		if (tmpIconProvider)
		{
			tmpSaveConfirmBtn.innerHTML = tmpIconProvider.getIconSVGMarkup('save', 14);
		}
		else
		{
			tmpSaveConfirmBtn.textContent = '✓';
		}
		tmpSaveInputRow.appendChild(tmpSaveConfirmBtn);

		// "Save Current Layout" clickable row
		let tmpSaveRow = document.createElement('div');
		tmpSaveRow.className = 'pict-flow-popup-layout-save';

		let tmpSaveIcon = document.createElement('span');
		tmpSaveIcon.className = 'pict-flow-popup-layout-save-icon';
		if (tmpIconProvider)
		{
			tmpSaveIcon.innerHTML = tmpIconProvider.getIconSVGMarkup('save', 14);
		}
		tmpSaveRow.appendChild(tmpSaveIcon);

		let tmpSaveText = document.createElement('span');
		tmpSaveText.textContent = 'Save Current Layout';
		tmpSaveRow.appendChild(tmpSaveText);

		// Click "Save Current Layout" to reveal the input row
		tmpSaveRow.addEventListener('click', () =>
		{
			tmpSaveRow.style.display = 'none';
			tmpSaveInputRow.style.display = '';
			tmpSaveInput.value = '';
			setTimeout(() => { tmpSaveInput.focus(); }, 50);
		});

		// Confirm save via button click
		let tmpDoSave = () =>
		{
			let tmpName = tmpSaveInput.value.trim();
			if (tmpName === '') return;
			this._FlowView._LayoutProvider.saveLayout(tmpName);
			// Refresh the popup content
			while (pContainer.firstChild)
			{
				pContainer.removeChild(pContainer.firstChild);
			}
			this._buildLayoutPopup(pContainer);
		};

		tmpSaveConfirmBtn.addEventListener('click', tmpDoSave);

		// Confirm save via Enter key
		tmpSaveInput.addEventListener('keydown', (pEvent) =>
		{
			if (pEvent.key === 'Enter')
			{
				pEvent.preventDefault();
				tmpDoSave();
			}
			else if (pEvent.key === 'Escape')
			{
				// Cancel — hide input, show the save row again
				tmpSaveInputRow.style.display = 'none';
				tmpSaveRow.style.display = '';
			}
		});

		// Prevent clicks inside the input from closing the popup
		tmpSaveInput.addEventListener('click', (pEvent) =>
		{
			pEvent.stopPropagation();
		});

		tmpSaveSection.appendChild(tmpSaveRow);
		tmpSaveSection.appendChild(tmpSaveInputRow);
		pContainer.appendChild(tmpSaveSection);

		// Divider
		let tmpDivider = document.createElement('div');
		tmpDivider.className = 'pict-flow-popup-divider';
		pContainer.appendChild(tmpDivider);

		// Layout rows
		if (!this._FlowView || !this._FlowView._LayoutProvider)
		{
			let tmpEmpty = document.createElement('div');
			tmpEmpty.className = 'pict-flow-popup-list-empty';
			tmpEmpty.textContent = 'No saved layouts';
			pContainer.appendChild(tmpEmpty);
			return;
		}

		let tmpLayouts = this._FlowView._LayoutProvider.getLayouts();

		if (tmpLayouts.length === 0)
		{
			let tmpEmpty = document.createElement('div');
			tmpEmpty.className = 'pict-flow-popup-list-empty';
			tmpEmpty.textContent = 'No saved layouts';
			pContainer.appendChild(tmpEmpty);
			return;
		}

		for (let i = 0; i < tmpLayouts.length; i++)
		{
			let tmpLayout = tmpLayouts[i];

			let tmpRow = document.createElement('div');
			tmpRow.className = 'pict-flow-popup-layout-row';

			let tmpNameSpan = document.createElement('span');
			tmpNameSpan.className = 'pict-flow-popup-layout-name';
			tmpNameSpan.textContent = tmpLayout.Name;
			tmpRow.appendChild(tmpNameSpan);

			// Delete button (visible on hover via CSS)
			let tmpDeleteBtn = document.createElement('button');
			tmpDeleteBtn.className = 'pict-flow-popup-layout-delete';
			tmpDeleteBtn.title = 'Delete layout';
			if (tmpIconProvider)
			{
				tmpDeleteBtn.innerHTML = tmpIconProvider.getIconSVGMarkup('trash', 12);
			}
			else
			{
				tmpDeleteBtn.textContent = '×';
			}
			tmpRow.appendChild(tmpDeleteBtn);

			// Click row → restore layout
			tmpRow.addEventListener('click', (pEvent) =>
			{
				// Don't restore if they clicked the delete button
				if (pEvent.target.closest('.pict-flow-popup-layout-delete'))
				{
					return;
				}
				this._FlowView._LayoutProvider.restoreLayout(tmpLayout.Hash);
				this._closePopup();
			});

			// Click delete → delete layout and refresh popup
			tmpDeleteBtn.addEventListener('click', (pEvent) =>
			{
				pEvent.stopPropagation();
				this._FlowView._LayoutProvider.deleteLayout(tmpLayout.Hash);
				// Refresh the popup content
				while (pContainer.firstChild)
				{
					pContainer.removeChild(pContainer.firstChild);
				}
				this._buildLayoutPopup(pContainer);
			});

			pContainer.appendChild(tmpRow);
		}
	}

	// ── Layout Algorithm Popup ────────────────────────────────────────────

	/**
	 * Build the Layout Algorithm popup content. Distinct from the
	 * `_buildLayoutPopup` above which manages **saved layout snapshots**.
	 * This popup lets the user pick a layout algorithm, tune its
	 * parameters, and toggle auto-apply.
	 *
	 * @param {HTMLElement} pContainer
	 */
	_buildLayoutAlgorithmPopup(pContainer)
	{
		if (!this._FlowView || !this._FlowView._LayoutService) return;

		let tmpLayoutService = this._FlowView._LayoutService;
		let tmpCurrentSettings = this._FlowView.getLayoutAlgorithm();
		let tmpAlgoDescriptor = tmpLayoutService.getAlgorithm(tmpCurrentSettings.Algorithm);

		// ── Algorithm row: label + dropdown + collapse toggle ────
		let tmpAlgoSection = document.createElement('div');
		tmpAlgoSection.className = 'pict-flow-popup-settings-section pict-flow-popup-layout-algorithm-row';

		let tmpAlgoLabel = document.createElement('label');
		tmpAlgoLabel.className = 'pict-flow-popup-settings-label';
		tmpAlgoLabel.textContent = 'Algorithm';
		tmpAlgoSection.appendChild(tmpAlgoLabel);

		let tmpAlgoControls = document.createElement('div');
		tmpAlgoControls.className = 'pict-flow-popup-layout-algorithm-controls';

		let tmpAlgoSelect = document.createElement('select');
		tmpAlgoSelect.className = 'pict-flow-popup-settings-select pict-flow-popup-layout-algorithm-select';
		tmpAlgoSelect.setAttribute('data-layout-control', 'algorithm');

		let tmpAlgorithms = tmpLayoutService.listAlgorithms();
		for (let i = 0; i < tmpAlgorithms.length; i++)
		{
			let tmpOption = document.createElement('option');
			tmpOption.value = tmpAlgorithms[i].Name;
			tmpOption.textContent = tmpAlgorithms[i].Label || tmpAlgorithms[i].Name;
			if (tmpAlgorithms[i].Name === tmpCurrentSettings.Algorithm)
			{
				tmpOption.selected = true;
			}
			tmpAlgoSelect.appendChild(tmpOption);
		}

		tmpAlgoSelect.addEventListener('change', () =>
		{
			let tmpName = tmpAlgoSelect.value;
			let tmpAlgo = tmpLayoutService.getAlgorithm(tmpName);
			let tmpDefaults = (tmpAlgo && tmpAlgo.DefaultParameters) ? JSON.parse(JSON.stringify(tmpAlgo.DefaultParameters)) : {};
			this._FlowView.setLayoutAlgorithm(tmpName, tmpDefaults);
			// Refresh the popup so the parameter form reflects the new algorithm
			while (pContainer.firstChild)
			{
				pContainer.removeChild(pContainer.firstChild);
			}
			this._buildLayoutAlgorithmPopup(pContainer);
		});
		tmpAlgoSelect.addEventListener('click', (pEvent) => { pEvent.stopPropagation(); });

		tmpAlgoControls.appendChild(tmpAlgoSelect);

		// Collapse toggle for the parameter form. Only meaningful when
		// the algorithm actually has parameters (Custom doesn't).
		let tmpHasParameters = !!(tmpAlgoDescriptor && (
			(tmpAlgoDescriptor.ParameterManifest && tmpAlgoDescriptor.ParameterManifest.Descriptors) ||
			(tmpAlgoDescriptor.ParameterSchema && Object.keys(tmpAlgoDescriptor.ParameterSchema).length > 0)
		));
		let tmpFormToggle = null;
		if (tmpHasParameters)
		{
			tmpFormToggle = document.createElement('button');
			tmpFormToggle.type = 'button';
			tmpFormToggle.className = 'pict-flow-popup-collapse-toggle';
			tmpFormToggle.title = this._LayoutFormExpanded ? 'Hide parameters' : 'Show parameters';
			tmpFormToggle.setAttribute('aria-expanded', this._LayoutFormExpanded ? 'true' : 'false');
			let tmpIconProvider = this._FlowView ? this._FlowView._IconProvider : null;
			tmpFormToggle.innerHTML = tmpIconProvider
				? tmpIconProvider.getIconSVGMarkup('settings', 13)
				: '⚙';
			tmpAlgoControls.appendChild(tmpFormToggle);
		}

		tmpAlgoSection.appendChild(tmpAlgoControls);
		pContainer.appendChild(tmpAlgoSection);

		// ── Description (one-liner under the dropdown row) ───
		if (tmpAlgoDescriptor && tmpAlgoDescriptor.Description)
		{
			let tmpDescDiv = document.createElement('div');
			tmpDescDiv.className = 'pict-flow-popup-control-description';
			tmpDescDiv.textContent = tmpAlgoDescriptor.Description;
			pContainer.appendChild(tmpDescDiv);
		}

		// ── Parameter form (collapsible, sits right under the
		// algorithm row so the editor reads as part of the same
		// "this is the algorithm" section) ───────────────────
		this._buildLayoutParameterFormSection(pContainer, tmpAlgoDescriptor, tmpCurrentSettings);

		// Wire toggle now that the form host element exists
		if (tmpFormToggle)
		{
			tmpFormToggle.addEventListener('click', (pEvent) =>
			{
				pEvent.stopPropagation();
				this._LayoutFormExpanded = !this._LayoutFormExpanded;
				tmpFormToggle.setAttribute('aria-expanded', this._LayoutFormExpanded ? 'true' : 'false');
				tmpFormToggle.title = this._LayoutFormExpanded ? 'Hide parameters' : 'Show parameters';
				let tmpHost = this._LayoutFormHostID ? document.getElementById(this._LayoutFormHostID) : null;
				if (tmpHost)
				{
					tmpHost.setAttribute('data-collapsed', this._LayoutFormExpanded ? 'false' : 'true');
				}
			});
		}

		// ── Edge theme dropdown ──────────────────────────────
		let tmpEdgeDivider = document.createElement('div');
		tmpEdgeDivider.className = 'pict-flow-popup-divider';
		pContainer.appendChild(tmpEdgeDivider);

		let tmpEdgeSection = document.createElement('div');
		tmpEdgeSection.className = 'pict-flow-popup-settings-section';

		let tmpEdgeLabel = document.createElement('label');
		tmpEdgeLabel.className = 'pict-flow-popup-settings-label';
		tmpEdgeLabel.textContent = 'Edge theme';
		tmpEdgeSection.appendChild(tmpEdgeLabel);

		let tmpEdgeSelect = document.createElement('select');
		tmpEdgeSelect.className = 'pict-flow-popup-settings-select';
		tmpEdgeSelect.setAttribute('data-layout-control', 'edge-theme');

		let tmpEdgeSettings = this._FlowView.getEdgeTheme();
		let tmpResolvedEdge = tmpEdgeSettings.Theme;
		let tmpExplicitEdgeOverride = tmpEdgeSettings.Override;

		// Inherit option — falls back to the active layout's DefaultEdgeTheme
		let tmpInheritOpt = document.createElement('option');
		tmpInheritOpt.value = '__inherit__';
		let tmpDefaultThemeName = (tmpAlgoDescriptor && tmpAlgoDescriptor.DefaultEdgeTheme) || 'Bezier';
		tmpInheritOpt.textContent = `Inherit from layout (${tmpDefaultThemeName})`;
		if (!tmpExplicitEdgeOverride) tmpInheritOpt.selected = true;
		tmpEdgeSelect.appendChild(tmpInheritOpt);

		let tmpEdgeThemes = tmpLayoutService.listEdgeThemes();
		for (let i = 0; i < tmpEdgeThemes.length; i++)
		{
			let tmpOpt = document.createElement('option');
			tmpOpt.value = tmpEdgeThemes[i].Name;
			tmpOpt.textContent = tmpEdgeThemes[i].Label || tmpEdgeThemes[i].Name;
			if (tmpEdgeThemes[i].Name === tmpExplicitEdgeOverride)
			{
				tmpOpt.selected = true;
			}
			tmpEdgeSelect.appendChild(tmpOpt);
		}

		tmpEdgeSelect.addEventListener('change', () =>
		{
			let tmpVal = tmpEdgeSelect.value;
			if (tmpVal === '__inherit__')
			{
				this._FlowView.setEdgeTheme(null);
			}
			else
			{
				this._FlowView.setEdgeTheme(tmpVal);
			}
			// Rebuild the popup so the description and any theme-specific
			// controls reflect the new theme.
			while (pContainer.firstChild)
			{
				pContainer.removeChild(pContainer.firstChild);
			}
			this._buildLayoutAlgorithmPopup(pContainer);
		});
		tmpEdgeSelect.addEventListener('click', (pEvent) => { pEvent.stopPropagation(); });

		tmpEdgeSection.appendChild(tmpEdgeSelect);
		pContainer.appendChild(tmpEdgeSection);

		// Edge theme description (uses the *resolved* theme so users see
		// what's actually rendering, regardless of inherit/explicit choice)
		if (tmpResolvedEdge)
		{
			let tmpResolvedDescriptor = tmpLayoutService.getEdgeTheme(tmpResolvedEdge);
			if (tmpResolvedDescriptor && tmpResolvedDescriptor.Description)
			{
				let tmpEdgeDesc = document.createElement('div');
				tmpEdgeDesc.className = 'pict-flow-popup-control-description';
				tmpEdgeDesc.textContent = tmpResolvedDescriptor.Description;
				pContainer.appendChild(tmpEdgeDesc);
			}
		}

		// ── Auto-apply toggle ────────────────────────────────
		let tmpAutoApplyDivider = document.createElement('div');
		tmpAutoApplyDivider.className = 'pict-flow-popup-divider';
		pContainer.appendChild(tmpAutoApplyDivider);

		let tmpAutoApplySection = document.createElement('div');
		tmpAutoApplySection.className = 'pict-flow-popup-settings-section';
		tmpAutoApplySection.style.display = 'flex';
		tmpAutoApplySection.style.alignItems = 'center';
		tmpAutoApplySection.style.gap = '8px';

		let tmpAutoApplyCheckbox = document.createElement('input');
		tmpAutoApplyCheckbox.type = 'checkbox';
		tmpAutoApplyCheckbox.id = `Flow-Toolbar-AutoApply-${this.options.FlowViewIdentifier}`;
		tmpAutoApplyCheckbox.checked = !!tmpCurrentSettings.AutoApply;
		tmpAutoApplyCheckbox.addEventListener('change', () =>
		{
			this._FlowView.setLayoutAutoApply(tmpAutoApplyCheckbox.checked);
		});
		tmpAutoApplyCheckbox.addEventListener('click', (pEvent) => { pEvent.stopPropagation(); });

		let tmpAutoApplyLabel = document.createElement('label');
		tmpAutoApplyLabel.className = 'pict-flow-popup-settings-label';
		tmpAutoApplyLabel.setAttribute('for', tmpAutoApplyCheckbox.id);
		tmpAutoApplyLabel.textContent = 'Auto-apply on changes';
		tmpAutoApplyLabel.style.cursor = 'pointer';

		tmpAutoApplySection.appendChild(tmpAutoApplyCheckbox);
		tmpAutoApplySection.appendChild(tmpAutoApplyLabel);
		pContainer.appendChild(tmpAutoApplySection);

		// (Parameter form is rendered above, right under the algorithm row,
		// so it reads as part of the same "this is the algorithm" section.)

		// ── Apply Now button ─────────────────────────────────
		let tmpApplyDivider = document.createElement('div');
		tmpApplyDivider.className = 'pict-flow-popup-divider';
		pContainer.appendChild(tmpApplyDivider);

		let tmpApplyRow = document.createElement('div');
		tmpApplyRow.className = 'pict-flow-popup-settings-section';
		tmpApplyRow.style.padding = '4px 8px';

		let tmpApplyBtn = document.createElement('button');
		tmpApplyBtn.className = 'pict-flow-popup-layout-save-confirm';
		tmpApplyBtn.textContent = 'Apply Now';
		tmpApplyBtn.style.width = '100%';
		tmpApplyBtn.style.padding = '6px';
		if (tmpCurrentSettings.Algorithm === 'Custom')
		{
			tmpApplyBtn.disabled = true;
			tmpApplyBtn.title = 'Custom does not auto-position nodes';
		}
		tmpApplyBtn.addEventListener('click', () =>
		{
			if (tmpCurrentSettings.Algorithm === 'Custom') return;
			this._FlowView.applyCurrentLayout();
		});
		tmpApplyRow.appendChild(tmpApplyBtn);
		pContainer.appendChild(tmpApplyRow);
	}

	/**
	 * Render the parameter form section. When the host app has registered
	 * `PictFormMetacontroller` and the algorithm provides a
	 * `ParameterManifest`, we inject that manifest into a section-form so
	 * the user gets the same Manyfest-driven UX as the rest of the Pict
	 * ecosystem. Otherwise we fall back to schema-driven hand-rolled inputs.
	 *
	 * Data binding: `pict.AppData.PictFlowLayoutEditor.Parameters` is a
	 * mirror of `_FlowData.LayoutParameters`. The form's Informary writes
	 * directly into AppData; a `change`/`input` listener on the popup
	 * pushes those edits back into `_FlowData.LayoutParameters` and (when
	 * the active algorithm is non-Custom) re-applies the layout.
	 *
	 * @param {HTMLElement} pContainer
	 * @param {Object} pAlgoDescriptor - the descriptor for the active algorithm
	 * @param {{ Algorithm: string, Parameters: Object }} pCurrentSettings
	 */
	_buildLayoutParameterFormSection(pContainer, pAlgoDescriptor, pCurrentSettings)
	{
		if (!pAlgoDescriptor) return;

		let tmpHasManifest = !!(pAlgoDescriptor.ParameterManifest && pAlgoDescriptor.ParameterManifest.Descriptors);
		let tmpMetacontrollerType = this._resolveMetacontrollerServiceType();

		if (tmpHasManifest && tmpMetacontrollerType)
		{
			this._mountLayoutParameterMetacontroller(pContainer, pAlgoDescriptor, pCurrentSettings, tmpMetacontrollerType);
			return;
		}

		// Fallback path — schema-driven hand-rolled inputs.
		let tmpSchema = (pAlgoDescriptor.ParameterSchema) ? pAlgoDescriptor.ParameterSchema : {};
		let tmpParamKeys = Object.keys(tmpSchema);
		if (tmpParamKeys.length === 0) return;

		let tmpParamDivider = document.createElement('div');
		tmpParamDivider.className = 'pict-flow-popup-divider';
		pContainer.appendChild(tmpParamDivider);

		let tmpParamHeader = document.createElement('div');
		tmpParamHeader.className = 'pict-flow-popup-settings-label';
		tmpParamHeader.style.fontWeight = 'bold';
		tmpParamHeader.style.padding = '4px 8px';
		tmpParamHeader.textContent = 'Parameters';
		pContainer.appendChild(tmpParamHeader);

		for (let i = 0; i < tmpParamKeys.length; i++)
		{
			let tmpKey = tmpParamKeys[i];
			let tmpFieldSchema = tmpSchema[tmpKey];
			let tmpCurrentValue = (pCurrentSettings.Parameters && pCurrentSettings.Parameters.hasOwnProperty(tmpKey))
				? pCurrentSettings.Parameters[tmpKey]
				: tmpFieldSchema.Default;

			let tmpRow = document.createElement('div');
			tmpRow.className = 'pict-flow-popup-settings-section';
			tmpRow.style.display = 'flex';
			tmpRow.style.alignItems = 'center';
			tmpRow.style.gap = '8px';

			let tmpRowLabel = document.createElement('label');
			tmpRowLabel.className = 'pict-flow-popup-settings-label';
			tmpRowLabel.textContent = tmpFieldSchema.Label || tmpKey;
			tmpRowLabel.style.flex = '1';
			tmpRow.appendChild(tmpRowLabel);

			let tmpInput = this._buildLayoutParamInput(tmpKey, tmpFieldSchema, tmpCurrentValue);
			tmpRow.appendChild(tmpInput);
			pContainer.appendChild(tmpRow);
		}
	}

	/**
	 * Remove `PictSectionForm-*` views the layout-algorithm popup has
	 * previously registered on the host Pict. Without this, switching
	 * algorithms accumulates dead section views — the metatemplate
	 * generated by the next inject would still reference the old ones.
	 * Idempotent.
	 */
	_evictLayoutFormViews()
	{
		if (!this.pict || !this.pict.views) return;
		let tmpKeys = Object.keys(this.pict.views);
		for (let i = 0; i < tmpKeys.length; i++)
		{
			let tmpKey = tmpKeys[i];
			if (tmpKey.indexOf('PictSectionForm-') === 0 && tmpKey.indexOf('PictFlowLayout') > 0)
			{
				delete this.pict.views[tmpKey];
				continue;
			}
			// Match any previously-injected layout-algorithm section by hash
			// suffix (manifests use unique algorithm-suffixed section names).
			if (tmpKey.indexOf('PictSectionForm-PFL') === 0)
			{
				delete this.pict.views[tmpKey];
			}
		}
		this._LayoutFormMetacontroller = null;
	}

	/**
	 * Look up which form-metacontroller service is registered on the host
	 * Pict instance. pict-section-form has been published under both
	 * 'PictFormMetacontroller' and (older) 'PictViewFormMetacontroller'
	 * names; check both, in that order.
	 * @returns {string|null}
	 */
	_resolveMetacontrollerServiceType()
	{
		if (!this.fable || !this.fable.servicesMap) return null;
		if (this.fable.servicesMap.hasOwnProperty('PictFormMetacontroller'))     return 'PictFormMetacontroller';
		if (this.fable.servicesMap.hasOwnProperty('PictViewFormMetacontroller')) return 'PictViewFormMetacontroller';
		return null;
	}

	/**
	 * Build the parameter form section using a pict-section-form
	 * metacontroller. Creates a host div, binds the active layout
	 * parameters to `pict.AppData.PictFlowLayoutEditor.Parameters`, and
	 * injects the algorithm's `ParameterManifest`. Form-input changes
	 * propagate back to `_FlowData.LayoutParameters` via a single
	 * `change`/`input` listener on the popup container.
	 *
	 * @param {HTMLElement} pContainer
	 * @param {Object} pAlgoDescriptor
	 * @param {{ Algorithm: string, Parameters: Object }} pCurrentSettings
	 * @param {string} pMetacontrollerType - 'PictFormMetacontroller' or 'PictViewFormMetacontroller'
	 */
	_mountLayoutParameterMetacontroller(pContainer, pAlgoDescriptor, pCurrentSettings, pMetacontrollerType)
	{
		let tmpManifest = JSON.parse(JSON.stringify(pAlgoDescriptor.ParameterManifest));
		let tmpFlowViewIdentifier = this.options.FlowViewIdentifier;

		// Section header + divider
		let tmpDivider = document.createElement('div');
		tmpDivider.className = 'pict-flow-popup-divider';
		pContainer.appendChild(tmpDivider);

		// Form host div — the metacontroller renders into here
		let tmpHostID = `Flow-Toolbar-LayoutForm-${tmpFlowViewIdentifier}`;
		this._LayoutFormHostID = tmpHostID;

		let tmpHostDiv = document.createElement('div');
		tmpHostDiv.id = tmpHostID;
		tmpHostDiv.className = 'pict-flow-popup-layout-form-host';
		tmpHostDiv.setAttribute('data-collapsed', this._LayoutFormExpanded ? 'false' : 'true');
		// Clicks inside the form must NOT close the popup
		tmpHostDiv.addEventListener('click', (pEvent) => { pEvent.stopPropagation(); });
		pContainer.appendChild(tmpHostDiv);

		// Bind the layout parameters as the data source for the form.
		// `injectManifestAndRender(manifest, _, UUID)` calls
		// `createDistinctManifest` which prepends the UUID to every descriptor
		// address (so re-injecting the same manifest doesn't collide). We use
		// the algorithm name as the UUID, so the form's expected address is
		// `AppData.<Algorithm>.PictFlowLayoutEditor.Parameters.<Key>` —
		// bind there, not at the unprefixed root.
		let tmpScope = pCurrentSettings.Algorithm;
		this.pict.AppData[tmpScope] = this.pict.AppData[tmpScope] || {};
		this.pict.AppData[tmpScope].PictFlowLayoutEditor = this.pict.AppData[tmpScope].PictFlowLayoutEditor || {};
		this.pict.AppData[tmpScope].PictFlowLayoutEditor.Parameters = JSON.parse(JSON.stringify(pCurrentSettings.Parameters || {}));

		// Always recreate the metacontroller per mount. Reusing the same
		// metacontroller across algorithm switches accumulates section views
		// (each switch's manifest gets injected onto the existing roster) and
		// the metatemplate ends up wedging multiple sections into a single
		// shared destination — only the last one survives. Fresh instance per
		// mount keeps the DOM consistent; we also evict the prior
		// `PictSectionForm-*` views from `pict.views` so they GC cleanly.
		this._evictLayoutFormViews();
		try
		{
			this._LayoutFormMetacontroller = this.fable.instantiateServiceProviderWithoutRegistration(
				pMetacontrollerType,
				{
					ViewIdentifier: `Flow-Toolbar-LayoutForm-MC-${tmpFlowViewIdentifier}-${this.fable.getUUID()}`,
					DefaultDestinationAddress: `#${tmpHostID}`,
					AutoRender: false,
					AutoPopulateAfterRender: true,
					AutoSolveBeforeRender: false
				});
		}
		catch (pError)
		{
			this.log.warn(`Failed to instantiate ${pMetacontrollerType}: ${pError.message}`);
			this._LayoutFormMetacontroller = null;
		}

		if (!this._LayoutFormMetacontroller)
		{
			tmpHostDiv.innerHTML = '<em style="padding:8px;display:block;opacity:0.7;">pict-section-form not available; parameter form skipped.</em>';
			return;
		}

		// Establish the form-container div the metacontroller expects.
		let tmpFormContainerID = `Pict-${this._LayoutFormMetacontroller.UUID}-FormContainer`;
		tmpHostDiv.innerHTML = `<div id="${tmpFormContainerID}" class="pict-form pict-flow-popup-layout-form"></div>`;

		try
		{
			// Use `injectManifest` + explicit per-section destination divs +
			// per-section render. Don't use `injectManifestAndRender` —
			// its metatemplate flow ends up wedging multi-section manifests
			// into a single shared destination (each section's render call
			// uses RenderMethod=replace, blowing the others away). The
			// explicit path gives each section its own destination div and
			// renders them independently.
			let tmpInjectFn = (typeof this._LayoutFormMetacontroller.injectManifest === 'function')
				? this._LayoutFormMetacontroller.injectManifest.bind(this._LayoutFormMetacontroller)
				: null;
			if (!tmpInjectFn) throw new Error('Metacontroller exposes neither injectManifest nor injectManifestAndRender');

			// Pass the algorithm name as the section-hash discriminator so
			// re-injecting the same algorithm gets unique view registrations.
			// (createDistinctManifest does the address-prefixing too — see
			// the per-algorithm AppData binding above.)
			let tmpDistinct = (typeof this._LayoutFormMetacontroller.createDistinctManifest === 'function')
				? this._LayoutFormMetacontroller.createDistinctManifest(tmpManifest, pCurrentSettings.Algorithm)
				: tmpManifest;

			let tmpViews = tmpInjectFn(tmpDistinct);

			// Build a destination div per section view, in order, and render each.
			let tmpFormContainerEl = tmpHostDiv.querySelector(`#${tmpFormContainerID}`);
			if (tmpFormContainerEl)
			{
				let tmpInner = '';
				for (let i = 0; i < tmpViews.length; i++)
				{
					let tmpDest = tmpViews[i].options.DefaultDestinationAddress;
					if (tmpDest && tmpDest.charAt(0) === '#') tmpDest = tmpDest.substring(1);
					tmpInner += `<div id="${tmpDest}" class="pict-form-view"></div>`;
				}
				tmpFormContainerEl.innerHTML = tmpInner;
			}
			// Defer render() to the next microtask so the popup has been
			// appended to the DOM by `_openPopup` — pict-section-form
			// resolves destinations via `document.querySelector`, which
			// can't see detached subtrees. (Same workaround the
			// metacontroller's own `injectManifestAndRender` uses.)
			setTimeout(() =>
			{
				for (let i = 0; i < tmpViews.length; i++)
				{
					tmpViews[i].render();
					if (typeof tmpViews[i].marshalToView === 'function')
					{
						tmpViews[i].marshalToView();
					}
				}
			}, 0);
		}
		catch (pError)
		{
			this.log.warn(`PictViewFlowToolbar: layout-form injection failed: ${pError.message}`);
			tmpHostDiv.innerHTML = `<em style="padding:8px;display:block;opacity:0.7;">Form render error: ${pError.message}</em>`;
			return;
		}

		// Push form changes back into _FlowData.LayoutParameters and re-apply
		// the layout (when non-Custom). One listener at the host level catches
		// both `change` (for selects/numbers/checkboxes) and `input` (for the
		// live-update case). De-bounce via micro-task so multi-key edits
		// resolve to a single re-layout pass. Read from the algorithm-scoped
		// AppData branch (matches the UUID-prefixed descriptor addresses).
		let tmpScheduled = false;
		let tmpPushBack = () =>
		{
			if (tmpScheduled) return;
			tmpScheduled = true;
			Promise.resolve().then(() =>
			{
				tmpScheduled = false;
				let tmpScopedRoot = this.pict.AppData[tmpScope] || {};
				let tmpEditorParams = (tmpScopedRoot.PictFlowLayoutEditor || {}).Parameters || {};
				let tmpMerged = Object.assign({}, this._FlowView.getLayoutAlgorithm().Parameters || {}, tmpEditorParams);
				this._FlowView.setLayoutAlgorithm(pCurrentSettings.Algorithm, tmpMerged);
			});
		};
		tmpHostDiv.addEventListener('change', tmpPushBack);
		tmpHostDiv.addEventListener('input', tmpPushBack);
	}

	/**
	 * Build a single parameter input row for the layout-algorithm popup.
	 * Wires the input's change handler to update the flow's
	 * `LayoutParameters` and re-apply the layout if non-Custom.
	 *
	 * @param {string} pKey
	 * @param {Object} pSchema - { Type: 'number' | 'string' | 'boolean' | 'enum', Default, Options? }
	 * @param {*} pCurrentValue
	 * @returns {HTMLElement}
	 */
	_buildLayoutParamInput(pKey, pSchema, pCurrentValue)
	{
		let tmpInput;

		if (pSchema.Type === 'boolean')
		{
			tmpInput = document.createElement('input');
			tmpInput.type = 'checkbox';
			tmpInput.checked = !!pCurrentValue;
			tmpInput.addEventListener('change', () =>
			{
				this._updateLayoutParameter(pKey, tmpInput.checked);
			});
		}
		else if (pSchema.Type === 'enum' && Array.isArray(pSchema.Options))
		{
			tmpInput = document.createElement('select');
			tmpInput.className = 'pict-flow-popup-settings-select';
			for (let i = 0; i < pSchema.Options.length; i++)
			{
				let tmpOpt = document.createElement('option');
				tmpOpt.value = pSchema.Options[i];
				tmpOpt.textContent = pSchema.Options[i];
				if (pSchema.Options[i] === pCurrentValue) tmpOpt.selected = true;
				tmpInput.appendChild(tmpOpt);
			}
			tmpInput.addEventListener('change', () =>
			{
				this._updateLayoutParameter(pKey, tmpInput.value);
			});
		}
		else if (pSchema.Type === 'number' || pSchema.Type === 'Number' || pSchema.Type === 'PreciseNumber')
		{
			tmpInput = document.createElement('input');
			tmpInput.type = 'number';
			tmpInput.className = 'pict-flow-popup-settings-input';
			// PreciseNumber: arbitrary precision (string-stored, big.js / ExpressionParser-friendly).
			// Number: integer or simple float.
			let tmpIsPrecise = (pSchema.Type === 'PreciseNumber');
			if (typeof pSchema.Min === 'number') tmpInput.min = String(pSchema.Min);
			if (typeof pSchema.Max === 'number') tmpInput.max = String(pSchema.Max);
			tmpInput.step = tmpIsPrecise ? 'any' : '1';
			let tmpDisplayValue = (pCurrentValue == null) ? '' : String(pCurrentValue);
			tmpInput.value = tmpDisplayValue;
			tmpInput.style.width = '90px';
			tmpInput.addEventListener('change', () =>
			{
				let tmpRaw = tmpInput.value;
				if (tmpRaw === '') return;
				if (tmpIsPrecise)
				{
					// Preserve the user-entered string so big.js / ExpressionParser
					// can use it without float round-trip drift.
					this._updateLayoutParameter(pKey, tmpRaw);
				}
				else
				{
					let tmpNum = parseFloat(tmpRaw);
					if (isNaN(tmpNum)) return;
					this._updateLayoutParameter(pKey, tmpNum);
				}
			});
		}
		else
		{
			tmpInput = document.createElement('input');
			tmpInput.type = 'text';
			tmpInput.className = 'pict-flow-popup-settings-input';
			tmpInput.value = (pCurrentValue == null) ? '' : String(pCurrentValue);
			tmpInput.style.width = '90px';
			tmpInput.addEventListener('change', () =>
			{
				this._updateLayoutParameter(pKey, tmpInput.value);
			});
		}

		tmpInput.addEventListener('click', (pEvent) => { pEvent.stopPropagation(); });

		return tmpInput;
	}

	/**
	 * Update a single layout parameter on the flow and re-apply the layout
	 * if the configured algorithm is not 'Custom'.
	 * @param {string} pKey
	 * @param {*} pValue
	 */
	_updateLayoutParameter(pKey, pValue)
	{
		if (!this._FlowView) return;
		let tmpSettings = this._FlowView.getLayoutAlgorithm();
		let tmpParams = Object.assign({}, tmpSettings.Parameters || {});
		tmpParams[pKey] = pValue;
		this._FlowView.setLayoutAlgorithm(tmpSettings.Algorithm, tmpParams);
	}

	// ── Settings Popup ───────────────────────────────────────────────────

	/**
	 * Build the Settings popup content (theme dropdown + noise slider).
	 * @param {HTMLElement} pContainer
	 */
	_buildSettingsPopup(pContainer)
	{
		if (!this._FlowView || !this._FlowView._ThemeProvider) return;

		let tmpThemeProvider = this._FlowView._ThemeProvider;

		// Theme selector section
		let tmpThemeSection = document.createElement('div');
		tmpThemeSection.className = 'pict-flow-popup-settings-section';

		let tmpThemeLabel = document.createElement('label');
		tmpThemeLabel.className = 'pict-flow-popup-settings-label';
		tmpThemeLabel.textContent = 'Theme';
		tmpThemeSection.appendChild(tmpThemeLabel);

		let tmpThemeSelect = document.createElement('select');
		tmpThemeSelect.className = 'pict-flow-popup-settings-select';

		let tmpThemeKeys = tmpThemeProvider.getThemeKeys();
		let tmpActiveKey = tmpThemeProvider.getActiveThemeKey();

		for (let i = 0; i < tmpThemeKeys.length; i++)
		{
			let tmpOption = document.createElement('option');
			tmpOption.value = tmpThemeKeys[i];

			let tmpTheme = tmpThemeProvider._Themes[tmpThemeKeys[i]];
			tmpOption.textContent = tmpTheme.Label || tmpThemeKeys[i];

			if (tmpThemeKeys[i] === tmpActiveKey)
			{
				tmpOption.selected = true;
			}
			tmpThemeSelect.appendChild(tmpOption);
		}

		tmpThemeSelect.addEventListener('change', () =>
		{
			this._FlowView.setTheme(tmpThemeSelect.value);
			// Refresh the noise slider visibility
			this._refreshNoiseSlider(pContainer);
		});

		// Prevent popup close on select interaction
		tmpThemeSelect.addEventListener('click', (pEvent) => { pEvent.stopPropagation(); });

		tmpThemeSection.appendChild(tmpThemeSelect);
		pContainer.appendChild(tmpThemeSection);

		// Divider
		let tmpDivider = document.createElement('div');
		tmpDivider.className = 'pict-flow-popup-divider';
		pContainer.appendChild(tmpDivider);

		// Noise level section
		let tmpNoiseSection = document.createElement('div');
		tmpNoiseSection.className = 'pict-flow-popup-settings-section pict-flow-popup-settings-noise';
		tmpNoiseSection.setAttribute('data-settings-type', 'noise');

		let tmpNoiseLabel = document.createElement('label');
		tmpNoiseLabel.className = 'pict-flow-popup-settings-label';
		tmpNoiseLabel.textContent = 'Noise';
		tmpNoiseSection.appendChild(tmpNoiseLabel);

		let tmpNoiseRow = document.createElement('div');
		tmpNoiseRow.className = 'pict-flow-popup-settings-slider-row';

		let tmpNoiseSlider = document.createElement('input');
		tmpNoiseSlider.type = 'range';
		tmpNoiseSlider.className = 'pict-flow-popup-settings-slider';
		tmpNoiseSlider.min = '0';
		tmpNoiseSlider.max = '100';
		tmpNoiseSlider.value = String(Math.round(tmpThemeProvider.getNoiseLevel() * 100));

		let tmpNoiseValue = document.createElement('span');
		tmpNoiseValue.className = 'pict-flow-popup-settings-slider-value';
		tmpNoiseValue.textContent = tmpNoiseSlider.value + '%';

		tmpNoiseSlider.addEventListener('input', () =>
		{
			let tmpLevel = parseInt(tmpNoiseSlider.value, 10) / 100;
			tmpNoiseValue.textContent = tmpNoiseSlider.value + '%';
			this._FlowView.setNoiseLevel(tmpLevel);
		});

		// Prevent popup close on slider interaction
		tmpNoiseSlider.addEventListener('click', (pEvent) => { pEvent.stopPropagation(); });
		tmpNoiseSlider.addEventListener('pointerdown', (pEvent) => { pEvent.stopPropagation(); });

		tmpNoiseRow.appendChild(tmpNoiseSlider);
		tmpNoiseRow.appendChild(tmpNoiseValue);
		tmpNoiseSection.appendChild(tmpNoiseRow);
		pContainer.appendChild(tmpNoiseSection);

		// Show/hide noise slider based on active theme
		this._refreshNoiseSlider(pContainer);
	}

	/**
	 * Show or hide the noise slider based on whether the active theme supports noise.
	 * @param {HTMLElement} pContainer - The settings popup container
	 */
	_refreshNoiseSlider(pContainer)
	{
		let tmpNoiseSection = pContainer.querySelector('[data-settings-type="noise"]');
		if (!tmpNoiseSection) return;

		let tmpTheme = this._FlowView._ThemeProvider.getActiveTheme();
		if (tmpTheme && tmpTheme.NoiseConfig && tmpTheme.NoiseConfig.Enabled)
		{
			tmpNoiseSection.style.display = '';
			// Update slider value to reflect theme default
			let tmpSlider = tmpNoiseSection.querySelector('.pict-flow-popup-settings-slider');
			let tmpValueLabel = tmpNoiseSection.querySelector('.pict-flow-popup-settings-slider-value');
			if (tmpSlider)
			{
				let tmpLevel = Math.round(this._FlowView._ThemeProvider.getNoiseLevel() * 100);
				tmpSlider.value = String(tmpLevel);
				if (tmpValueLabel) tmpValueLabel.textContent = tmpLevel + '%';
			}
		}
		else
		{
			tmpNoiseSection.style.display = 'none';
		}
	}

	// ── Toolbar Mode Switching ────────────────────────────────────────────

	/**
	 * Switch between docked, floating, and collapsed modes.
	 * @param {string} pMode - 'docked' | 'floating' | 'collapsed'
	 */
	_setToolbarMode(pMode)
	{
		// Close any active popup first
		this._closePopup();

		let tmpFlowViewIdentifier = this.options.FlowViewIdentifier;
		let tmpBar = this.pict.ContentAssignment.getElement(`#Flow-Toolbar-Bar-${tmpFlowViewIdentifier}`);
		let tmpCollapsed = this.pict.ContentAssignment.getElement(`#Flow-Toolbar-Collapsed-${tmpFlowViewIdentifier}`);

		switch (pMode)
		{
			case 'docked':
				// Show toolbar bar
				if (tmpBar.length > 0) tmpBar[0].style.display = '';
				// Hide collapsed button
				if (tmpCollapsed.length > 0) tmpCollapsed[0].classList.remove('visible');
				// Hide floating toolbar
				if (this._FloatingToolbarView) this._FloatingToolbarView.hide();
				break;

			case 'floating':
				// Hide toolbar bar
				if (tmpBar.length > 0) tmpBar[0].style.display = 'none';
				// Hide collapsed button
				if (tmpCollapsed.length > 0) tmpCollapsed[0].classList.remove('visible');
				// Show floating toolbar
				this._showFloatingToolbar();
				break;

			case 'collapsed':
				// Hide toolbar bar
				if (tmpBar.length > 0) tmpBar[0].style.display = 'none';
				// Show collapsed button
				if (tmpCollapsed.length > 0) tmpCollapsed[0].classList.add('visible');
				// Hide floating toolbar
				if (this._FloatingToolbarView) this._FloatingToolbarView.hide();
				break;
		}

		this._ToolbarMode = pMode;
	}

	/**
	 * Lazily create and show the floating toolbar.
	 */
	_showFloatingToolbar()
	{
		if (!this._FlowView) return;

		if (!this._FloatingToolbarView)
		{
			let tmpFlowViewIdentifier = this.options.FlowViewIdentifier;
			this._FloatingToolbarView = this.fable.instantiateServiceProviderWithoutRegistration(
				'PictViewFlowFloatingToolbar',
				{
					FlowViewIdentifier: tmpFlowViewIdentifier,
					DefaultDestinationAddress: `#Flow-FloatingToolbar-Container-${tmpFlowViewIdentifier}`,
					EnableAddNode: this.options.EnableAddNode,
					EnableCardPalette: this.options.EnableCardPalette
				}
			);
			this._FloatingToolbarView._ToolbarView = this;
			this._FloatingToolbarView._FlowView = this._FlowView;
			this._FloatingToolbarView.render();
		}

		this._FloatingToolbarView.show();
	}

	// ── Node Placement Helpers ────────────────────────────────────────────

	/**
	 * Add a node at the center of the visible viewport.
	 * @param {string} pNodeType - The node type hash
	 */
	_addNodeAtCenter(pNodeType)
	{
		if (!this._FlowView) return;

		let tmpVS = this._FlowView.viewState;

		// Calculate the center of the visible SVG area
		let tmpSVGContainer = this._FlowView._SVGElement;
		let tmpWidth = tmpSVGContainer ? tmpSVGContainer.clientWidth : 600;
		let tmpHeight = tmpSVGContainer ? tmpSVGContainer.clientHeight : 400;

		let tmpCenterX = (-tmpVS.PanX + tmpWidth / 2) / tmpVS.Zoom;
		let tmpCenterY = (-tmpVS.PanY + tmpHeight / 2) / tmpVS.Zoom;

		// Slight offset to avoid stacking
		let tmpNodeCount = this._FlowView.flowData.Nodes.length;
		tmpCenterX += (tmpNodeCount % 5) * 30;
		tmpCenterY += (tmpNodeCount % 5) * 30;

		this._FlowView.addNode(pNodeType, tmpCenterX, tmpCenterY);
	}

	/**
	 * Add a node from a palette card click.
	 * @param {string} pCardType - The card type hash
	 */
	_addCardFromPalette(pCardType)
	{
		if (!this._FlowView) return;

		let tmpVS = this._FlowView.viewState;
		let tmpX = (-tmpVS.PanX + 200) / tmpVS.Zoom;
		let tmpY = (-tmpVS.PanY + 200) / tmpVS.Zoom;

		// Offset to avoid overlap
		let tmpNodeCount = this._FlowView.flowData.Nodes.length;
		tmpX += (tmpNodeCount % 5) * 40;
		tmpY += (tmpNodeCount % 5) * 40;

		this._FlowView.addNode(pCardType, tmpX, tmpY);
	}

	// ── Action Handler ────────────────────────────────────────────────────

	/**
	 * Handle a toolbar action
	 * @param {string} pAction
	 */
	_handleToolbarAction(pAction)
	{
		if (!this._FlowView) return;

		let tmpFlowViewIdentifier = this.options.FlowViewIdentifier;

		switch (pAction)
		{
			case 'add-node':
				this._openPopup('add-node');
				break;

			case 'delete-selected':
				this._FlowView.deleteSelected();
				break;

			case 'zoom-in':
				this._FlowView.setZoom(this._FlowView.viewState.Zoom + this._FlowView.options.ZoomStep);
				break;

			case 'zoom-out':
				this._FlowView.setZoom(this._FlowView.viewState.Zoom - this._FlowView.options.ZoomStep);
				break;

			case 'zoom-fit':
				this._FlowView.zoomToFit();
				break;

			case 'auto-layout':
				// Legacy alias kept for backward compatibility with any
				// caller still firing 'auto-layout'. The toolbar's "Auto"
				// button now uses 'apply-current-layout' (below).
				this._FlowView.autoLayout();
				break;

			case 'apply-current-layout':
				// Respects whichever algorithm is configured in the
				// Algorithm popup. Falls back to Layered when the
				// configured value is 'Custom' or unset (autoLayout's
				// existing behavior — "do something useful").
				this._FlowView.autoLayout();
				break;

			case 'cards-popup':
				this._openPopup('cards');
				break;

			case 'layout-popup':
				this._openPopup('layout');
				break;

			case 'layout-algorithm-popup':
				this._openPopup('layout-algorithm');
				break;

			case 'apply-layout':
				this._FlowView.applyCurrentLayout();
				break;

			case 'settings-popup':
				this._openPopup('settings');
				break;

			case 'toggle-floating':
				if (this._ToolbarMode === 'floating')
				{
					this._setToolbarMode('docked');
				}
				else
				{
					this._setToolbarMode('floating');
				}
				break;

			case 'collapse-toolbar':
				this._setToolbarMode('collapsed');
				break;

			case 'expand-toolbar':
				this._setToolbarMode('docked');
				break;

			case 'fullscreen':
				{
					let tmpIsFullscreen = this._FlowView.toggleFullscreen();
					let tmpIconProvider = this._FlowView._IconProvider;
					let tmpIconElements = this.pict.ContentAssignment.getElement(`#Flow-Toolbar-Fullscreen-Icon-${tmpFlowViewIdentifier}`);
					if (tmpIconElements.length > 0 && tmpIconProvider)
					{
						tmpIconElements[0].innerHTML = tmpIconProvider.getIconSVGMarkup(
							tmpIsFullscreen ? 'exit-fullscreen' : 'fullscreen', 14);
					}
					let tmpFullscreenBtn = this.pict.ContentAssignment.getElement(`#Flow-Toolbar-Fullscreen-${tmpFlowViewIdentifier}`);
					if (tmpFullscreenBtn.length > 0)
					{
						tmpFullscreenBtn[0].setAttribute('title', tmpIsFullscreen ? 'Exit Fullscreen' : 'Toggle Fullscreen');
					}
				}
				break;

			default:
				this.log.warn(`PictViewFlowToolbar: unknown action '${pAction}'`);
				break;
		}
	}
}

module.exports = PictViewFlowToolbar;

module.exports.default_configuration = _DefaultConfiguration;

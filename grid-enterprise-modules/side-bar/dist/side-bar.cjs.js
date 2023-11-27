/**
          * @ag-grid-enterprise/side-bar - Advanced Data Grid / Data Table supporting Javascript / Typescript / React / Angular / Vue * @version v31.0.0
          * @link https://www.ag-grid.com/
          * @license Commercial
          */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@ag-grid-community/core');
var core$1 = require('@ag-grid-enterprise/core');

var __extends$6 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$6 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HorizontalResizeComp = /** @class */ (function (_super) {
    __extends$6(HorizontalResizeComp, _super);
    function HorizontalResizeComp() {
        var _this = _super.call(this, /* html */ "<div class=\"ag-tool-panel-horizontal-resize\"></div>") || this;
        _this.minWidth = 100;
        _this.maxWidth = null;
        return _this;
    }
    HorizontalResizeComp.prototype.setElementToResize = function (elementToResize) {
        this.elementToResize = elementToResize;
    };
    HorizontalResizeComp.prototype.postConstruct = function () {
        var finishedWithResizeFunc = this.horizontalResizeService.addResizeBar({
            eResizeBar: this.getGui(),
            dragStartPixels: 1,
            onResizeStart: this.onResizeStart.bind(this),
            onResizing: this.onResizing.bind(this),
            onResizeEnd: this.onResizeEnd.bind(this)
        });
        this.addDestroyFunc(finishedWithResizeFunc);
        this.setInverted(this.gridOptionsService.get('enableRtl'));
    };
    HorizontalResizeComp.prototype.dispatchResizeEvent = function (start, end, width) {
        var event = {
            type: core.Events.EVENT_TOOL_PANEL_SIZE_CHANGED,
            width: width,
            started: start,
            ended: end,
        };
        this.eventService.dispatchEvent(event);
    };
    HorizontalResizeComp.prototype.onResizeStart = function () {
        this.startingWidth = this.elementToResize.offsetWidth;
        this.dispatchResizeEvent(true, false, this.startingWidth);
    };
    HorizontalResizeComp.prototype.onResizeEnd = function (delta) {
        return this.onResizing(delta, true);
    };
    HorizontalResizeComp.prototype.onResizing = function (delta, isEnd) {
        if (isEnd === void 0) { isEnd = false; }
        var direction = this.inverted ? -1 : 1;
        var newWidth = Math.max(this.minWidth, Math.floor(this.startingWidth - (delta * direction)));
        if (this.maxWidth != null) {
            newWidth = Math.min(this.maxWidth, newWidth);
        }
        this.elementToResize.style.width = "".concat(newWidth, "px");
        this.dispatchResizeEvent(false, isEnd, newWidth);
    };
    HorizontalResizeComp.prototype.setInverted = function (inverted) {
        this.inverted = inverted;
    };
    HorizontalResizeComp.prototype.setMaxWidth = function (value) {
        this.maxWidth = value;
    };
    HorizontalResizeComp.prototype.setMinWidth = function (value) {
        if (value != null) {
            this.minWidth = value;
        }
        else {
            this.minWidth = 100;
        }
    };
    __decorate$6([
        core.Autowired('horizontalResizeService')
    ], HorizontalResizeComp.prototype, "horizontalResizeService", void 0);
    __decorate$6([
        core.PostConstruct
    ], HorizontalResizeComp.prototype, "postConstruct", null);
    return HorizontalResizeComp;
}(core.Component));

var __extends$5 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$5 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SideBarButtonComp = /** @class */ (function (_super) {
    __extends$5(SideBarButtonComp, _super);
    function SideBarButtonComp(toolPanelDef) {
        var _this = _super.call(this) || this;
        _this.toolPanelDef = toolPanelDef;
        return _this;
    }
    SideBarButtonComp.prototype.getToolPanelId = function () {
        return this.toolPanelDef.id;
    };
    SideBarButtonComp.prototype.postConstruct = function () {
        var template = this.createTemplate();
        this.setTemplate(template);
        this.setLabel();
        this.setIcon();
        this.addManagedListener(this.eToggleButton, 'click', this.onButtonPressed.bind(this));
        this.eToggleButton.setAttribute('id', "ag-".concat(this.getCompId(), "-button"));
    };
    SideBarButtonComp.prototype.createTemplate = function () {
        var res = /* html */ "<div class=\"ag-side-button\" role=\"presentation\">\n                <button type=\"button\" ref=\"eToggleButton\" tabindex=\"-1\" role=\"tab\" aria-expanded=\"false\" class=\"ag-button ag-side-button-button\">\n                    <div ref=\"eIconWrapper\" class=\"ag-side-button-icon-wrapper\" aria-hidden=\"true\"></div>\n                    <span ref =\"eLabel\" class=\"ag-side-button-label\"></span>\n                </button>\n            </div>";
        return res;
    };
    SideBarButtonComp.prototype.setLabel = function () {
        var translate = this.localeService.getLocaleTextFunc();
        var def = this.toolPanelDef;
        var label = translate(def.labelKey, def.labelDefault);
        this.eLabel.innerText = label;
    };
    SideBarButtonComp.prototype.setIcon = function () {
        this.eIconWrapper.insertAdjacentElement('afterbegin', core._.createIconNoSpan(this.toolPanelDef.iconKey, this.gridOptionsService));
    };
    SideBarButtonComp.prototype.onButtonPressed = function () {
        this.dispatchEvent({ type: SideBarButtonComp.EVENT_TOGGLE_BUTTON_CLICKED });
    };
    SideBarButtonComp.prototype.setSelected = function (selected) {
        this.addOrRemoveCssClass('ag-selected', selected);
        core._.setAriaExpanded(this.eToggleButton, selected);
    };
    SideBarButtonComp.prototype.getButtonElement = function () {
        return this.eToggleButton;
    };
    SideBarButtonComp.EVENT_TOGGLE_BUTTON_CLICKED = 'toggleButtonClicked';
    __decorate$5([
        core.RefSelector('eToggleButton')
    ], SideBarButtonComp.prototype, "eToggleButton", void 0);
    __decorate$5([
        core.RefSelector('eIconWrapper')
    ], SideBarButtonComp.prototype, "eIconWrapper", void 0);
    __decorate$5([
        core.RefSelector('eLabel')
    ], SideBarButtonComp.prototype, "eLabel", void 0);
    __decorate$5([
        core.PostConstruct
    ], SideBarButtonComp.prototype, "postConstruct", null);
    return SideBarButtonComp;
}(core.Component));

var __extends$4 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SideBarButtonsComp = /** @class */ (function (_super) {
    __extends$4(SideBarButtonsComp, _super);
    function SideBarButtonsComp() {
        var _this = _super.call(this, SideBarButtonsComp.TEMPLATE) || this;
        _this.buttonComps = [];
        return _this;
    }
    SideBarButtonsComp.prototype.postConstruct = function () {
        this.addManagedListener(this.getFocusableElement(), 'keydown', this.handleKeyDown.bind(this));
    };
    SideBarButtonsComp.prototype.handleKeyDown = function (e) {
        if (e.key !== core.KeyCode.TAB || !e.shiftKey) {
            return;
        }
        var lastColumn = core._.last(this.columnModel.getAllDisplayedColumns());
        if (this.focusService.focusGridView(lastColumn, true)) {
            e.preventDefault();
        }
    };
    SideBarButtonsComp.prototype.setActiveButton = function (id) {
        this.buttonComps.forEach(function (comp) {
            comp.setSelected(id === comp.getToolPanelId());
        });
    };
    SideBarButtonsComp.prototype.addButtonComp = function (def) {
        var _this = this;
        var buttonComp = this.createBean(new SideBarButtonComp(def));
        this.buttonComps.push(buttonComp);
        this.appendChild(buttonComp);
        buttonComp.addEventListener(SideBarButtonComp.EVENT_TOGGLE_BUTTON_CLICKED, function () {
            _this.dispatchEvent({
                type: SideBarButtonsComp.EVENT_SIDE_BAR_BUTTON_CLICKED,
                toolPanelId: def.id
            });
        });
        return buttonComp;
    };
    SideBarButtonsComp.prototype.clearButtons = function () {
        this.buttonComps = this.destroyBeans(this.buttonComps);
        core._.clearElement(this.getGui());
    };
    SideBarButtonsComp.EVENT_SIDE_BAR_BUTTON_CLICKED = 'sideBarButtonClicked';
    SideBarButtonsComp.TEMPLATE = "<div class=\"ag-side-buttons\" role=\"tablist\"></div>";
    __decorate$4([
        core.Autowired('focusService')
    ], SideBarButtonsComp.prototype, "focusService", void 0);
    __decorate$4([
        core.Autowired('columnModel')
    ], SideBarButtonsComp.prototype, "columnModel", void 0);
    __decorate$4([
        core.PostConstruct
    ], SideBarButtonsComp.prototype, "postConstruct", null);
    __decorate$4([
        core.PreDestroy
    ], SideBarButtonsComp.prototype, "clearButtons", null);
    return SideBarButtonsComp;
}(core.Component));

var SideBarDefParser = /** @class */ (function () {
    function SideBarDefParser() {
    }
    SideBarDefParser.parse = function (toParse) {
        if (!toParse) {
            return undefined;
        }
        if (toParse === true) {
            return {
                toolPanels: [
                    SideBarDefParser.DEFAULT_COLUMN_COMP,
                    SideBarDefParser.DEFAULT_FILTER_COMP,
                ],
                defaultToolPanel: 'columns'
            };
        }
        if (typeof toParse === 'string') {
            return SideBarDefParser.parse([toParse]);
        }
        if (Array.isArray(toParse)) {
            var comps_1 = [];
            toParse.forEach(function (key) {
                var lookupResult = SideBarDefParser.DEFAULT_BY_KEY[key];
                if (!lookupResult) {
                    console.warn("AG Grid: the key ".concat(key, " is not a valid key for specifying a tool panel, valid keys are: ").concat(Object.keys(SideBarDefParser.DEFAULT_BY_KEY).join(',')));
                    return;
                }
                comps_1.push(lookupResult);
            });
            if (comps_1.length === 0) {
                return undefined;
            }
            return {
                toolPanels: comps_1,
                defaultToolPanel: comps_1[0].id
            };
        }
        var result = {
            toolPanels: SideBarDefParser.parseComponents(toParse.toolPanels),
            defaultToolPanel: toParse.defaultToolPanel,
            hiddenByDefault: toParse.hiddenByDefault,
            position: toParse.position
        };
        return result;
    };
    SideBarDefParser.parseComponents = function (from) {
        var result = [];
        if (!from) {
            return result;
        }
        from.forEach(function (it) {
            var toAdd = null;
            if (typeof it === 'string') {
                var lookupResult = SideBarDefParser.DEFAULT_BY_KEY[it];
                if (!lookupResult) {
                    console.warn("AG Grid: the key ".concat(it, " is not a valid key for specifying a tool panel, valid keys are: ").concat(Object.keys(SideBarDefParser.DEFAULT_BY_KEY).join(',')));
                    return;
                }
                toAdd = lookupResult;
            }
            else {
                toAdd = it;
            }
            result.push(toAdd);
        });
        return result;
    };
    SideBarDefParser.DEFAULT_COLUMN_COMP = {
        id: 'columns',
        labelDefault: 'Columns',
        labelKey: 'columns',
        iconKey: 'columns',
        toolPanel: 'agColumnsToolPanel',
    };
    SideBarDefParser.DEFAULT_FILTER_COMP = {
        id: 'filters',
        labelDefault: 'Filters',
        labelKey: 'filters',
        iconKey: 'filter',
        toolPanel: 'agFiltersToolPanel',
    };
    SideBarDefParser.DEFAULT_BY_KEY = {
        columns: SideBarDefParser.DEFAULT_COLUMN_COMP,
        filters: SideBarDefParser.DEFAULT_FILTER_COMP
    };
    return SideBarDefParser;
}());

var __extends$3 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ToolPanelWrapper = /** @class */ (function (_super) {
    __extends$3(ToolPanelWrapper, _super);
    function ToolPanelWrapper() {
        return _super.call(this, ToolPanelWrapper.TEMPLATE) || this;
    }
    ToolPanelWrapper.prototype.setupResize = function () {
        var eGui = this.getGui();
        var resizeBar = this.resizeBar = this.createManagedBean(new HorizontalResizeComp());
        eGui.setAttribute('id', "ag-".concat(this.getCompId()));
        resizeBar.setElementToResize(eGui);
        this.appendChild(resizeBar);
    };
    ToolPanelWrapper.prototype.getToolPanelId = function () {
        return this.toolPanelId;
    };
    ToolPanelWrapper.prototype.setToolPanelDef = function (toolPanelDef, params) {
        var id = toolPanelDef.id, minWidth = toolPanelDef.minWidth, maxWidth = toolPanelDef.maxWidth, width = toolPanelDef.width;
        this.toolPanelId = id;
        this.width = width;
        var compDetails = this.userComponentFactory.getToolPanelCompDetails(toolPanelDef, params);
        var componentPromise = compDetails.newAgStackInstance();
        if (componentPromise == null) {
            console.warn("AG Grid: error processing tool panel component ".concat(id, ". You need to specify 'toolPanel'"));
            return;
        }
        componentPromise.then(this.setToolPanelComponent.bind(this));
        if (minWidth != null) {
            this.resizeBar.setMinWidth(minWidth);
        }
        if (maxWidth != null) {
            this.resizeBar.setMaxWidth(maxWidth);
        }
    };
    ToolPanelWrapper.prototype.setToolPanelComponent = function (compInstance) {
        var _this = this;
        this.toolPanelCompInstance = compInstance;
        this.appendChild(compInstance.getGui());
        this.addDestroyFunc(function () {
            _this.destroyBean(compInstance);
        });
        if (this.width) {
            this.getGui().style.width = "".concat(this.width, "px");
        }
    };
    ToolPanelWrapper.prototype.getToolPanelInstance = function () {
        return this.toolPanelCompInstance;
    };
    ToolPanelWrapper.prototype.setResizerSizerSide = function (side) {
        var isRtl = this.gridOptionsService.get('enableRtl');
        var isLeft = side === 'left';
        var inverted = isRtl ? isLeft : !isLeft;
        this.resizeBar.setInverted(inverted);
    };
    ToolPanelWrapper.prototype.refresh = function () {
        this.toolPanelCompInstance.refresh();
    };
    ToolPanelWrapper.TEMPLATE = "<div class=\"ag-tool-panel-wrapper\" role=\"tabpanel\"/>";
    __decorate$3([
        core.Autowired("userComponentFactory")
    ], ToolPanelWrapper.prototype, "userComponentFactory", void 0);
    __decorate$3([
        core.PostConstruct
    ], ToolPanelWrapper.prototype, "setupResize", null);
    return ToolPanelWrapper;
}(core.Component));

var __extends$2 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __values = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var SideBarComp = /** @class */ (function (_super) {
    __extends$2(SideBarComp, _super);
    function SideBarComp() {
        var _this = _super.call(this, SideBarComp.TEMPLATE) || this;
        _this.toolPanelWrappers = [];
        return _this;
    }
    SideBarComp.prototype.postConstruct = function () {
        var _this = this;
        var _a;
        this.sideBarButtonsComp.addEventListener(SideBarButtonsComp.EVENT_SIDE_BAR_BUTTON_CLICKED, this.onToolPanelButtonClicked.bind(this));
        var sideBarState = ((_a = this.gridOptionsService.get('initialState')) !== null && _a !== void 0 ? _a : {}).sideBar;
        this.setSideBarDef(sideBarState);
        this.addManagedPropertyListener('sideBar', function () {
            _this.clearDownUi();
            // don't re-assign initial state
            _this.setSideBarDef();
        });
        this.sideBarService.registerSideBarComp(this);
        this.createManagedBean(new core.ManagedFocusFeature(this.getFocusableElement(), {
            onTabKeyDown: this.onTabKeyDown.bind(this),
            handleKeyDown: this.handleKeyDown.bind(this)
        }));
    };
    SideBarComp.prototype.onTabKeyDown = function (e) {
        if (e.defaultPrevented) {
            return;
        }
        var _a = this, focusService = _a.focusService, sideBarButtonsComp = _a.sideBarButtonsComp;
        var eGui = this.getGui();
        var sideBarGui = sideBarButtonsComp.getGui();
        var eDocument = this.gridOptionsService.getDocument();
        var activeElement = eDocument.activeElement;
        var openPanel = eGui.querySelector('.ag-tool-panel-wrapper:not(.ag-hidden)');
        var target = e.target;
        if (!openPanel) {
            return;
        }
        if (sideBarGui.contains(activeElement)) {
            if (focusService.focusInto(openPanel, e.shiftKey)) {
                e.preventDefault();
            }
            return;
        }
        // only handle backwards focus to target the sideBar buttons
        if (!e.shiftKey) {
            return;
        }
        var nextEl = null;
        if (openPanel.contains(activeElement)) {
            nextEl = this.focusService.findNextFocusableElement(openPanel, undefined, true);
        }
        else if (focusService.isTargetUnderManagedComponent(openPanel, target) && e.shiftKey) {
            nextEl = this.focusService.findFocusableElementBeforeTabGuard(openPanel, target);
        }
        if (!nextEl) {
            nextEl = sideBarGui.querySelector('.ag-selected button');
        }
        if (nextEl) {
            e.preventDefault();
            nextEl.focus();
        }
    };
    SideBarComp.prototype.handleKeyDown = function (e) {
        var eDocument = this.gridOptionsService.getDocument();
        if (!this.sideBarButtonsComp.getGui().contains(eDocument.activeElement)) {
            return;
        }
        var sideBarGui = this.sideBarButtonsComp.getGui();
        var buttons = Array.prototype.slice.call(sideBarGui.querySelectorAll('.ag-side-button'));
        var currentButton = eDocument.activeElement;
        var currentPos = buttons.findIndex(function (button) { return button.contains(currentButton); });
        var nextPos = null;
        switch (e.key) {
            case core.KeyCode.LEFT:
            case core.KeyCode.UP:
                nextPos = Math.max(0, currentPos - 1);
                break;
            case core.KeyCode.RIGHT:
            case core.KeyCode.DOWN:
                nextPos = Math.min(currentPos + 1, buttons.length - 1);
                break;
        }
        if (nextPos === null) {
            return;
        }
        var innerButton = buttons[nextPos].querySelector('button');
        if (innerButton) {
            innerButton.focus();
            e.preventDefault();
        }
    };
    SideBarComp.prototype.onToolPanelButtonClicked = function (event) {
        var id = event.toolPanelId;
        var openedItem = this.openedItem();
        // if item was already open, we close it
        if (openedItem === id) {
            this.openToolPanel(undefined, 'sideBarButtonClicked'); // passing undefined closes
        }
        else {
            this.openToolPanel(id, 'sideBarButtonClicked');
        }
    };
    SideBarComp.prototype.clearDownUi = function () {
        this.sideBarButtonsComp.clearButtons();
        this.destroyToolPanelWrappers();
    };
    SideBarComp.prototype.setSideBarDef = function (sideBarState) {
        // initially hide side bar
        this.setDisplayed(false);
        var sideBarRaw = this.gridOptionsService.get('sideBar');
        this.sideBar = SideBarDefParser.parse(sideBarRaw);
        if (!!this.sideBar && !!this.sideBar.toolPanels) {
            var toolPanelDefs = this.sideBar.toolPanels;
            this.createToolPanelsAndSideButtons(toolPanelDefs, sideBarState);
            if (!this.toolPanelWrappers.length) {
                return;
            }
            var shouldDisplaySideBar = sideBarState ? sideBarState.visible : !this.sideBar.hiddenByDefault;
            this.setDisplayed(shouldDisplaySideBar);
            this.setSideBarPosition(sideBarState ? sideBarState.position : this.sideBar.position);
            if (shouldDisplaySideBar) {
                if (sideBarState) {
                    var openToolPanel = sideBarState.openToolPanel;
                    if (openToolPanel) {
                        this.openToolPanel(openToolPanel, 'sideBarInitializing');
                    }
                }
                else {
                    this.openToolPanel(this.sideBar.defaultToolPanel, 'sideBarInitializing');
                }
            }
        }
    };
    SideBarComp.prototype.getDef = function () {
        return this.sideBar;
    };
    SideBarComp.prototype.setSideBarPosition = function (position) {
        if (!position) {
            position = 'right';
        }
        this.position = position;
        var isLeft = position === 'left';
        var resizerSide = isLeft ? 'right' : 'left';
        this.addOrRemoveCssClass('ag-side-bar-left', isLeft);
        this.addOrRemoveCssClass('ag-side-bar-right', !isLeft);
        this.toolPanelWrappers.forEach(function (wrapper) {
            wrapper.setResizerSizerSide(resizerSide);
        });
        this.eventService.dispatchEvent({ type: core.Events.EVENT_SIDE_BAR_UPDATED });
        return this;
    };
    SideBarComp.prototype.setDisplayed = function (displayed, options) {
        _super.prototype.setDisplayed.call(this, displayed, options);
        this.eventService.dispatchEvent({ type: core.Events.EVENT_SIDE_BAR_UPDATED });
    };
    SideBarComp.prototype.getState = function () {
        var toolPanels = {};
        this.toolPanelWrappers.forEach(function (wrapper) {
            var _a, _b;
            toolPanels[wrapper.getToolPanelId()] = (_b = (_a = wrapper.getToolPanelInstance()).getState) === null || _b === void 0 ? void 0 : _b.call(_a);
        });
        return {
            visible: this.isDisplayed(),
            position: this.position,
            openToolPanel: this.openedItem(),
            toolPanels: toolPanels
        };
    };
    SideBarComp.prototype.createToolPanelsAndSideButtons = function (defs, sideBarState) {
        var e_1, _a;
        var _b;
        try {
            for (var defs_1 = __values(defs), defs_1_1 = defs_1.next(); !defs_1_1.done; defs_1_1 = defs_1.next()) {
                var def = defs_1_1.value;
                this.createToolPanelAndSideButton(def, (_b = sideBarState === null || sideBarState === void 0 ? void 0 : sideBarState.toolPanels) === null || _b === void 0 ? void 0 : _b[def.id]);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (defs_1_1 && !defs_1_1.done && (_a = defs_1.return)) _a.call(defs_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    SideBarComp.prototype.validateDef = function (def) {
        if (def.id == null) {
            console.warn("AG Grid: please review all your toolPanel components, it seems like at least one of them doesn't have an id");
            return false;
        }
        // helpers, in case user doesn't have the right module loaded
        if (def.toolPanel === 'agColumnsToolPanel') {
            var moduleMissing = !core.ModuleRegistry.__assertRegistered(core.ModuleNames.ColumnsToolPanelModule, 'Column Tool Panel', this.context.getGridId());
            if (moduleMissing) {
                return false;
            }
        }
        if (def.toolPanel === 'agFiltersToolPanel') {
            var moduleMissing = !core.ModuleRegistry.__assertRegistered(core.ModuleNames.FiltersToolPanelModule, 'Filters Tool Panel', this.context.getGridId());
            if (moduleMissing) {
                return false;
            }
            if (this.filterManager.isAdvancedFilterEnabled()) {
                core._.warnOnce('Advanced Filter does not work with Filters Tool Panel. Filters Tool Panel has been disabled.');
                return false;
            }
        }
        return true;
    };
    SideBarComp.prototype.createToolPanelAndSideButton = function (def, initialState) {
        var _this = this;
        if (!this.validateDef(def)) {
            return;
        }
        var button = this.sideBarButtonsComp.addButtonComp(def);
        var wrapper = this.getContext().createBean(new ToolPanelWrapper());
        wrapper.setToolPanelDef(def, {
            initialState: initialState,
            onStateUpdated: function () { return _this.eventService.dispatchEvent({ type: core.Events.EVENT_SIDE_BAR_UPDATED }); }
        });
        wrapper.setDisplayed(false);
        var wrapperGui = wrapper.getGui();
        this.appendChild(wrapperGui);
        this.toolPanelWrappers.push(wrapper);
        core._.setAriaControls(button.getButtonElement(), wrapperGui);
    };
    SideBarComp.prototype.refresh = function () {
        this.toolPanelWrappers.forEach(function (wrapper) { return wrapper.refresh(); });
    };
    SideBarComp.prototype.openToolPanel = function (key, source) {
        if (source === void 0) { source = 'api'; }
        var currentlyOpenedKey = this.openedItem();
        if (currentlyOpenedKey === key) {
            return;
        }
        this.toolPanelWrappers.forEach(function (wrapper) {
            var show = key === wrapper.getToolPanelId();
            wrapper.setDisplayed(show);
        });
        var newlyOpenedKey = this.openedItem();
        var openToolPanelChanged = currentlyOpenedKey !== newlyOpenedKey;
        if (openToolPanelChanged) {
            this.sideBarButtonsComp.setActiveButton(key);
            this.raiseToolPanelVisibleEvent(key, currentlyOpenedKey !== null && currentlyOpenedKey !== void 0 ? currentlyOpenedKey : undefined, source);
        }
    };
    SideBarComp.prototype.getToolPanelInstance = function (key) {
        var toolPanelWrapper = this.toolPanelWrappers.filter(function (toolPanel) { return toolPanel.getToolPanelId() === key; })[0];
        if (!toolPanelWrapper) {
            console.warn("AG Grid: unable to lookup Tool Panel as invalid key supplied: ".concat(key));
            return;
        }
        return toolPanelWrapper.getToolPanelInstance();
    };
    SideBarComp.prototype.raiseToolPanelVisibleEvent = function (key, previousKey, source) {
        var switchingToolPanel = !!key && !!previousKey;
        if (previousKey) {
            var event_1 = {
                type: core.Events.EVENT_TOOL_PANEL_VISIBLE_CHANGED,
                source: source,
                key: previousKey,
                visible: false,
                switchingToolPanel: switchingToolPanel,
            };
            this.eventService.dispatchEvent(event_1);
        }
        if (key) {
            var event_2 = {
                type: core.Events.EVENT_TOOL_PANEL_VISIBLE_CHANGED,
                source: source,
                key: key,
                visible: true,
                switchingToolPanel: switchingToolPanel,
            };
            this.eventService.dispatchEvent(event_2);
        }
    };
    SideBarComp.prototype.close = function (source) {
        if (source === void 0) { source = 'api'; }
        this.openToolPanel(undefined, source);
    };
    SideBarComp.prototype.isToolPanelShowing = function () {
        return !!this.openedItem();
    };
    SideBarComp.prototype.openedItem = function () {
        var activeToolPanel = null;
        this.toolPanelWrappers.forEach(function (wrapper) {
            if (wrapper.isDisplayed()) {
                activeToolPanel = wrapper.getToolPanelId();
            }
        });
        return activeToolPanel;
    };
    SideBarComp.prototype.destroyToolPanelWrappers = function () {
        var _this = this;
        this.toolPanelWrappers.forEach(function (wrapper) {
            core._.removeFromParent(wrapper.getGui());
            _this.destroyBean(wrapper);
        });
        this.toolPanelWrappers.length = 0;
    };
    SideBarComp.prototype.destroy = function () {
        this.destroyToolPanelWrappers();
        _super.prototype.destroy.call(this);
    };
    SideBarComp.TEMPLATE = "<div class=\"ag-side-bar ag-unselectable\">\n            <ag-side-bar-buttons ref=\"sideBarButtons\"></ag-side-bar-buttons>\n        </div>";
    __decorate$2([
        core.Autowired('focusService')
    ], SideBarComp.prototype, "focusService", void 0);
    __decorate$2([
        core.Autowired('filterManager')
    ], SideBarComp.prototype, "filterManager", void 0);
    __decorate$2([
        core.Autowired('sideBarService')
    ], SideBarComp.prototype, "sideBarService", void 0);
    __decorate$2([
        core.RefSelector('sideBarButtons')
    ], SideBarComp.prototype, "sideBarButtonsComp", void 0);
    __decorate$2([
        core.PostConstruct
    ], SideBarComp.prototype, "postConstruct", null);
    return SideBarComp;
}(core.Component));

var __extends$1 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ToolPanelColDefService = /** @class */ (function (_super) {
    __extends$1(ToolPanelColDefService, _super);
    function ToolPanelColDefService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isColGroupDef = function (colDef) { return colDef && typeof colDef.children !== 'undefined'; };
        _this.getId = function (colDef) {
            return _this.isColGroupDef(colDef) ? colDef.groupId : colDef.colId;
        };
        return _this;
    }
    ToolPanelColDefService.prototype.createColumnTree = function (colDefs) {
        var _this = this;
        var invalidColIds = [];
        var createDummyColGroup = function (abstractColDef, depth) {
            if (_this.isColGroupDef(abstractColDef)) {
                // creating 'dummy' group which is not associated with grid column group
                var groupDef = abstractColDef;
                var groupId = (typeof groupDef.groupId !== 'undefined') ? groupDef.groupId : groupDef.headerName;
                var group = new core.ProvidedColumnGroup(groupDef, groupId, false, depth);
                var children_1 = [];
                groupDef.children.forEach(function (def) {
                    var child = createDummyColGroup(def, depth + 1);
                    // check column exists in case invalid colDef is supplied for primary column
                    if (child) {
                        children_1.push(child);
                    }
                });
                group.setChildren(children_1);
                return group;
            }
            else {
                var colDef = abstractColDef;
                var key = colDef.colId ? colDef.colId : colDef.field;
                var column = _this.columnModel.getPrimaryColumn(key);
                if (!column) {
                    invalidColIds.push(colDef);
                }
                return column;
            }
        };
        var mappedResults = [];
        colDefs.forEach(function (colDef) {
            var result = createDummyColGroup(colDef, 0);
            if (result) {
                // only return correctly mapped colDef results
                mappedResults.push(result);
            }
        });
        if (invalidColIds.length > 0) {
            console.warn('AG Grid: unable to find grid columns for the supplied colDef(s):', invalidColIds);
        }
        return mappedResults;
    };
    ToolPanelColDefService.prototype.syncLayoutWithGrid = function (syncLayoutCallback) {
        // extract ordered list of leaf path trees (column group hierarchy for each individual leaf column)
        var leafPathTrees = this.getLeafPathTrees();
        // merge leaf path tree taking split column groups into account
        var mergedColumnTrees = this.mergeLeafPathTrees(leafPathTrees);
        // sync layout with merged column trees
        syncLayoutCallback(mergedColumnTrees);
    };
    ToolPanelColDefService.prototype.getLeafPathTrees = function () {
        // leaf tree paths are obtained by walking up the tree starting at a column until we reach the top level group.
        var getLeafPathTree = function (node, childDef) {
            var leafPathTree;
            // build up tree in reverse order
            if (node instanceof core.ProvidedColumnGroup) {
                if (node.isPadding()) {
                    // skip over padding groups
                    leafPathTree = childDef;
                }
                else {
                    var groupDef = Object.assign({}, node.getColGroupDef());
                    // ensure group contains groupId
                    groupDef.groupId = node.getGroupId();
                    groupDef.children = [childDef];
                    leafPathTree = groupDef;
                }
            }
            else {
                var colDef = Object.assign({}, node.getColDef());
                // ensure col contains colId
                colDef.colId = node.getColId();
                leafPathTree = colDef;
            }
            // walk tree
            var parent = node.getOriginalParent();
            if (parent) {
                // keep walking up the tree until we reach the root
                return getLeafPathTree(parent, leafPathTree);
            }
            else {
                // we have reached the root - exit with resulting leaf path tree
                return leafPathTree;
            }
        };
        // obtain a sorted list of all grid columns
        var allGridColumns = this.columnModel.getAllGridColumns();
        // only primary columns and non row group columns should appear in the tool panel
        var allPrimaryGridColumns = allGridColumns.filter(function (column) {
            var colDef = column.getColDef();
            return column.isPrimary() && !colDef.showRowGroup;
        });
        // construct a leaf path tree for each column
        return allPrimaryGridColumns.map(function (col) { return getLeafPathTree(col, col.getColDef()); });
    };
    ToolPanelColDefService.prototype.mergeLeafPathTrees = function (leafPathTrees) {
        var _this = this;
        var matchingRootGroupIds = function (pathA, pathB) {
            var bothPathsAreGroups = _this.isColGroupDef(pathA) && _this.isColGroupDef(pathB);
            return bothPathsAreGroups && _this.getId(pathA) === _this.getId(pathB);
        };
        var mergeTrees = function (treeA, treeB) {
            if (!_this.isColGroupDef(treeB)) {
                return treeA;
            }
            var mergeResult = treeA;
            var groupToMerge = treeB;
            if (groupToMerge.children && groupToMerge.groupId) {
                var added = _this.addChildrenToGroup(mergeResult, groupToMerge.groupId, groupToMerge.children[0]);
                if (added) {
                    return mergeResult;
                }
            }
            groupToMerge.children.forEach(function (child) { return mergeTrees(mergeResult, child); });
            return mergeResult;
        };
        // we can't just merge the leaf path trees as groups can be split apart - instead only merge if leaf
        // path groups with the same root group id are contiguous.
        var mergeColDefs = [];
        for (var i = 1; i <= leafPathTrees.length; i++) {
            var first = leafPathTrees[i - 1];
            var second = leafPathTrees[i];
            if (matchingRootGroupIds(first, second)) {
                leafPathTrees[i] = mergeTrees(first, second);
            }
            else {
                mergeColDefs.push(first);
            }
        }
        return mergeColDefs;
    };
    ToolPanelColDefService.prototype.addChildrenToGroup = function (tree, groupId, colDef) {
        var _this = this;
        var subGroupIsSplit = function (currentSubGroup, currentSubGroupToAdd) {
            var existingChildIds = currentSubGroup.children.map(_this.getId);
            var childGroupAlreadyExists = core._.includes(existingChildIds, _this.getId(currentSubGroupToAdd));
            var lastChild = core._.last(currentSubGroup.children);
            var lastChildIsDifferent = lastChild && _this.getId(lastChild) !== _this.getId(currentSubGroupToAdd);
            return childGroupAlreadyExists && lastChildIsDifferent;
        };
        if (!this.isColGroupDef(tree)) {
            return true;
        }
        var currentGroup = tree;
        var groupToAdd = colDef;
        if (subGroupIsSplit(currentGroup, groupToAdd)) {
            currentGroup.children.push(groupToAdd);
            return true;
        }
        if (currentGroup.groupId === groupId) {
            // add children that don't already exist to group
            var existingChildIds = currentGroup.children.map(this.getId);
            var colDefAlreadyPresent = core._.includes(existingChildIds, this.getId(groupToAdd));
            if (!colDefAlreadyPresent) {
                currentGroup.children.push(groupToAdd);
                return true;
            }
        }
        // recurse until correct group is found to add children
        currentGroup.children.forEach(function (subGroup) { return _this.addChildrenToGroup(subGroup, groupId, colDef); });
        return false;
    };
    __decorate$1([
        core.Autowired('columnModel')
    ], ToolPanelColDefService.prototype, "columnModel", void 0);
    ToolPanelColDefService = __decorate$1([
        core.Bean('toolPanelColDefService')
    ], ToolPanelColDefService);
    return ToolPanelColDefService;
}(core.BeanStub));

// DO NOT UPDATE MANUALLY: Generated from script during build time
var VERSION = '31.0.0';

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SideBarService = /** @class */ (function (_super) {
    __extends(SideBarService, _super);
    function SideBarService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SideBarService.prototype.registerSideBarComp = function (sideBarComp) {
        this.sideBarComp = sideBarComp;
    };
    SideBarService.prototype.getSideBarComp = function () {
        return this.sideBarComp;
    };
    SideBarService = __decorate([
        core.Bean('sideBarService')
    ], SideBarService);
    return SideBarService;
}(core.BeanStub));

var SideBarModule = {
    version: VERSION,
    moduleName: core.ModuleNames.SideBarModule,
    beans: [ToolPanelColDefService, SideBarService],
    agStackComponents: [
        { componentName: 'AgHorizontalResize', componentClass: HorizontalResizeComp },
        { componentName: 'AgSideBar', componentClass: SideBarComp },
        { componentName: 'AgSideBarButtons', componentClass: SideBarButtonsComp },
    ],
    dependantModules: [
        core$1.EnterpriseCoreModule
    ]
};

exports.SideBarModule = SideBarModule;
exports.ToolPanelColDefService = ToolPanelColDefService;

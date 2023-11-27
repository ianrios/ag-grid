var __extends = (this && this.__extends) || (function () {
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { _, AgPanel, AgPromise, Autowired, CHART_TOOL_PANEL_ALLOW_LIST, CHART_TOOL_PANEL_MENU_OPTIONS, CHART_TOOLBAR_ALLOW_LIST, Component, Events, PostConstruct, RefSelector } from "@ag-grid-community/core";
import { TabbedChartMenu } from "./tabbedChartMenu";
import { ChartController } from "../chartController";
var ChartMenu = /** @class */ (function (_super) {
    __extends(ChartMenu, _super);
    function ChartMenu(eChartContainer, eMenuPanelContainer, chartController, chartOptionsService) {
        var _this = _super.call(this, ChartMenu.TEMPLATE) || this;
        _this.eChartContainer = eChartContainer;
        _this.eMenuPanelContainer = eMenuPanelContainer;
        _this.chartController = chartController;
        _this.chartOptionsService = chartOptionsService;
        _this.buttons = {
            chartSettings: ['menu', function () { return _this.showMenu(_this.defaultPanel); }],
            chartData: ['menu', function () { return _this.showMenu("chartData"); }],
            chartFormat: ['menu', function () { return _this.showMenu("chartFormat"); }],
            chartLink: ['linked', function (e) { return _this.toggleDetached(e); }],
            chartUnlink: ['unlinked', function (e) { return _this.toggleDetached(e); }],
            chartDownload: ['save', function () { return _this.saveChart(); }]
        };
        _this.panels = [];
        _this.buttonListenersDestroyFuncs = [];
        _this.menuVisible = false;
        return _this;
    }
    ChartMenu.prototype.postConstruct = function () {
        var _this = this;
        this.createButtons();
        this.addManagedListener(this.eventService, Events.EVENT_CHART_CREATED, function (e) {
            var _a;
            if (e.chartId === _this.chartController.getChartId()) {
                var showDefaultToolPanel = Boolean((_a = _this.gridOptionsService.get('chartToolPanelsDef')) === null || _a === void 0 ? void 0 : _a.defaultToolPanel);
                if (showDefaultToolPanel) {
                    _this.showMenu(_this.defaultPanel, false);
                }
            }
        });
        this.refreshMenuClasses();
        if (!this.gridOptionsService.get('suppressChartToolPanelsButton') && this.panels.length > 0) {
            this.getGui().classList.add('ag-chart-tool-panel-button-enable');
            this.addManagedListener(this.eHideButton, 'click', this.toggleMenu.bind(this));
        }
        this.addManagedListener(this.chartController, ChartController.EVENT_CHART_API_UPDATE, this.createButtons.bind(this));
    };
    ChartMenu.prototype.isVisible = function () {
        return this.menuVisible;
    };
    ChartMenu.prototype.getExtraPaddingDirections = function () {
        var _this = this;
        var topItems = ['chartLink', 'chartUnlink', 'chartDownload'];
        var rightItems = ['chartSettings', 'chartData', 'chartFormat'];
        var result = [];
        if (topItems.some(function (v) { return _this.chartToolbarOptions.includes(v); })) {
            result.push('top');
        }
        if (rightItems.some(function (v) { return _this.chartToolbarOptions.includes(v); })) {
            result.push(this.gridOptionsService.get('enableRtl') ? 'left' : 'right');
        }
        return result;
    };
    ChartMenu.prototype.getToolbarOptions = function () {
        var _this = this;
        var _a, _b, _c;
        var useChartToolPanelCustomisation = Boolean(this.gridOptionsService.get('chartToolPanelsDef'));
        if (useChartToolPanelCustomisation) {
            var defaultChartToolbarOptions = [
                this.chartController.isChartLinked() ? 'chartLink' : 'chartUnlink',
                'chartDownload'
            ];
            var toolbarItemsFunc = this.gridOptionsService.getCallback('getChartToolbarItems');
            var params = {
                defaultItems: defaultChartToolbarOptions
            };
            var chartToolbarOptions = toolbarItemsFunc
                ? toolbarItemsFunc(params).filter(function (option) {
                    if (!CHART_TOOLBAR_ALLOW_LIST.includes(option)) {
                        var msg = CHART_TOOL_PANEL_ALLOW_LIST.includes(option)
                            ? "AG Grid: '".concat(option, "' is a Chart Tool Panel option and will be ignored since 'chartToolPanelsDef' is used. Please use 'chartToolPanelsDef.panels' grid option instead")
                            : "AG Grid: '".concat(option, "' is not a valid Chart Toolbar Option");
                        console.warn(msg);
                        return false;
                    }
                    return true;
                })
                : defaultChartToolbarOptions;
            var panelsOverride = (_b = (_a = this.gridOptionsService.get('chartToolPanelsDef')) === null || _a === void 0 ? void 0 : _a.panels) === null || _b === void 0 ? void 0 : _b.map(function (panel) {
                var menuOption = CHART_TOOL_PANEL_MENU_OPTIONS[panel];
                if (!menuOption) {
                    console.warn("AG Grid - invalid panel in chartToolPanelsDef.panels: '".concat(panel, "'"));
                }
                return menuOption;
            }).filter(function (panel) { return Boolean(panel); });
            this.panels = panelsOverride
                ? panelsOverride
                : Object.values(CHART_TOOL_PANEL_MENU_OPTIONS);
            // pivot charts use the column tool panel instead of the data panel
            if (this.chartController.isPivotChart()) {
                this.panels = this.panels.filter(function (panel) { return panel !== 'chartData'; });
            }
            var defaultToolPanel = (_c = this.gridOptionsService.get('chartToolPanelsDef')) === null || _c === void 0 ? void 0 : _c.defaultToolPanel;
            this.defaultPanel = (defaultToolPanel && CHART_TOOL_PANEL_MENU_OPTIONS[defaultToolPanel]) || this.panels[0];
            return this.panels.length > 0
                // Only one panel is required to display menu icon in toolbar
                ? __spreadArray([this.panels[0]], __read(chartToolbarOptions), false) : chartToolbarOptions;
        }
        else { // To be deprecated in future. Toolbar options will be different to chart tool panels.
            var tabOptions = [
                'chartSettings',
                'chartData',
                'chartFormat',
                this.chartController.isChartLinked() ? 'chartLink' : 'chartUnlink',
                'chartDownload'
            ];
            var toolbarItemsFunc = this.gridOptionsService.getCallback('getChartToolbarItems');
            if (toolbarItemsFunc) {
                var isLegacyToolbar_1 = this.gridOptionsService.get('suppressChartToolPanelsButton');
                var params = {
                    defaultItems: isLegacyToolbar_1 ? tabOptions : CHART_TOOLBAR_ALLOW_LIST
                };
                tabOptions = toolbarItemsFunc(params).filter(function (option) {
                    if (!_this.buttons[option]) {
                        console.warn("AG Grid: '".concat(option, "' is not a valid Chart Toolbar Option"));
                        return false;
                    }
                    // If not legacy, remove chart tool panel options here,
                    // and add them all in one go below
                    else if (!isLegacyToolbar_1 && CHART_TOOL_PANEL_ALLOW_LIST.includes(option)) {
                        var msg = "AG Grid: '".concat(option, "' is a Chart Tool Panel option and will be ignored. Please use 'chartToolPanelsDef.panels' grid option instead");
                        console.warn(msg);
                        return false;
                    }
                    return true;
                });
                if (!isLegacyToolbar_1) {
                    // Add all the chart tool panels, as `chartToolPanelsDef.panels`
                    // should be used for configuration
                    tabOptions = tabOptions.concat(CHART_TOOL_PANEL_ALLOW_LIST);
                }
            }
            // pivot charts use the column tool panel instead of the data panel
            if (this.chartController.isPivotChart()) {
                tabOptions = tabOptions.filter(function (option) { return option !== 'chartData'; });
            }
            var ignoreOptions_1 = ['chartUnlink', 'chartLink', 'chartDownload'];
            this.panels = tabOptions.filter(function (option) { return ignoreOptions_1.indexOf(option) === -1; });
            this.defaultPanel = this.panels[0];
            return tabOptions.filter(function (value) {
                return ignoreOptions_1.indexOf(value) !== -1 ||
                    (_this.panels.length && value === _this.panels[0]);
            });
        }
    };
    ChartMenu.prototype.toggleDetached = function (e) {
        var target = e.target;
        var active = target.classList.contains('ag-icon-linked');
        target.classList.toggle('ag-icon-linked', !active);
        target.classList.toggle('ag-icon-unlinked', active);
        var tooltipKey = active ? 'chartUnlinkToolbarTooltip' : 'chartLinkToolbarTooltip';
        var tooltipTitle = this.chartTranslationService.translate(tooltipKey);
        if (tooltipTitle) {
            target.title = tooltipTitle;
        }
        this.chartController.detachChartRange();
    };
    ChartMenu.prototype.createButtons = function () {
        var _this = this;
        this.buttonListenersDestroyFuncs.forEach(function (func) { return func(); });
        this.buttonListenersDestroyFuncs = [];
        this.chartToolbarOptions = this.getToolbarOptions();
        var menuEl = this.eMenu;
        _.clearElement(menuEl);
        this.chartToolbarOptions.forEach(function (button) {
            var buttonConfig = _this.buttons[button];
            var _a = __read(buttonConfig, 2), iconName = _a[0], callback = _a[1];
            var buttonEl = _.createIconNoSpan(iconName, _this.gridOptionsService, undefined, true);
            buttonEl.classList.add('ag-chart-menu-icon');
            var tooltipTitle = _this.chartTranslationService.translate(button + 'ToolbarTooltip');
            if (tooltipTitle && buttonEl instanceof HTMLElement) {
                buttonEl.title = tooltipTitle;
            }
            _this.buttonListenersDestroyFuncs.push(_this.addManagedListener(buttonEl, 'click', callback));
            menuEl.appendChild(buttonEl);
        });
    };
    ChartMenu.prototype.saveChart = function () {
        var event = { type: ChartMenu.EVENT_DOWNLOAD_CHART };
        this.dispatchEvent(event);
    };
    ChartMenu.prototype.createMenuPanel = function (defaultTab) {
        var _this = this;
        var width = this.environment.chartMenuPanelWidth();
        var menuPanel = this.menuPanel = this.createBean(new AgPanel({
            minWidth: width,
            width: width,
            height: '100%',
            closable: true,
            hideTitleBar: true,
            cssIdentifier: 'chart-menu'
        }));
        menuPanel.setParentComponent(this);
        this.eMenuPanelContainer.appendChild(menuPanel.getGui());
        this.tabbedMenu = this.createBean(new TabbedChartMenu({
            controller: this.chartController,
            type: this.chartController.getChartType(),
            panels: this.panels,
            chartOptionsService: this.chartOptionsService
        }));
        this.addManagedListener(menuPanel, Component.EVENT_DESTROYED, function () { return _this.destroyBean(_this.tabbedMenu); });
        return new AgPromise(function (res) {
            window.setTimeout(function () {
                menuPanel.setBodyComponent(_this.tabbedMenu);
                _this.tabbedMenu.showTab(defaultTab);
                res(menuPanel);
                _this.addManagedListener(_this.eChartContainer, 'click', function (event) {
                    if (_this.getGui().contains(event.target)) {
                        return;
                    }
                    if (_this.menuVisible) {
                        _this.hideMenu();
                    }
                });
            }, 100);
        });
    };
    ChartMenu.prototype.showContainer = function () {
        if (!this.menuPanel) {
            return;
        }
        this.menuVisible = true;
        this.showParent(this.menuPanel.getWidth());
        this.refreshMenuClasses();
    };
    ChartMenu.prototype.toggleMenu = function () {
        this.menuVisible ? this.hideMenu() : this.showMenu();
    };
    ChartMenu.prototype.showMenu = function (
    /**
     * Menu panel to show. If empty, shows the existing menu, or creates the default menu if menu panel has not been created
     */
    panel, 
    /**
     * Whether to animate the menu opening
     */
    animate) {
        var _this = this;
        if (animate === void 0) { animate = true; }
        if (!animate) {
            this.eMenuPanelContainer.classList.add('ag-no-transition');
        }
        if (this.menuPanel && !panel) {
            this.showContainer();
        }
        else {
            var menuPanel = panel || this.defaultPanel;
            var tab = this.panels.indexOf(menuPanel);
            if (tab < 0) {
                console.warn("AG Grid: '".concat(panel, "' is not a valid Chart Tool Panel name"));
                tab = this.panels.indexOf(this.defaultPanel);
            }
            if (this.menuPanel) {
                this.tabbedMenu.showTab(tab);
                this.showContainer();
            }
            else {
                this.createMenuPanel(tab).then(this.showContainer.bind(this));
            }
        }
        if (!animate) {
            // Wait for menu to render
            setTimeout(function () {
                if (!_this.isAlive()) {
                    return;
                }
                _this.eMenuPanelContainer.classList.remove('ag-no-transition');
            }, 500);
        }
    };
    ChartMenu.prototype.hideMenu = function () {
        var _this = this;
        this.hideParent();
        window.setTimeout(function () {
            _this.menuVisible = false;
            _this.refreshMenuClasses();
        }, 500);
    };
    ChartMenu.prototype.refreshMenuClasses = function () {
        this.eChartContainer.classList.toggle('ag-chart-menu-visible', this.menuVisible);
        this.eChartContainer.classList.toggle('ag-chart-menu-hidden', !this.menuVisible);
        if (!this.gridOptionsService.get('suppressChartToolPanelsButton')) {
            this.eHideButtonIcon.classList.toggle('ag-icon-contracted', this.menuVisible);
            this.eHideButtonIcon.classList.toggle('ag-icon-expanded', !this.menuVisible);
        }
    };
    ChartMenu.prototype.showParent = function (width) {
        this.eMenuPanelContainer.style.minWidth = "".concat(width, "px");
    };
    ChartMenu.prototype.hideParent = function () {
        this.eMenuPanelContainer.style.minWidth = '0';
    };
    ChartMenu.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        if (this.menuPanel && this.menuPanel.isAlive()) {
            this.destroyBean(this.menuPanel);
        }
        if (this.tabbedMenu && this.tabbedMenu.isAlive()) {
            this.destroyBean(this.tabbedMenu);
        }
    };
    ChartMenu.EVENT_DOWNLOAD_CHART = "downloadChart";
    ChartMenu.TEMPLATE = "<div>\n        <div class=\"ag-chart-menu\" ref=\"eMenu\"></div>\n        <button class=\"ag-button ag-chart-menu-close\" ref=\"eHideButton\">\n            <span class=\"ag-icon ag-icon-contracted\" ref=\"eHideButtonIcon\"></span>\n        </button>\n    </div>";
    __decorate([
        Autowired('chartTranslationService')
    ], ChartMenu.prototype, "chartTranslationService", void 0);
    __decorate([
        RefSelector("eMenu")
    ], ChartMenu.prototype, "eMenu", void 0);
    __decorate([
        RefSelector("eHideButton")
    ], ChartMenu.prototype, "eHideButton", void 0);
    __decorate([
        RefSelector("eHideButtonIcon")
    ], ChartMenu.prototype, "eHideButtonIcon", void 0);
    __decorate([
        PostConstruct
    ], ChartMenu.prototype, "postConstruct", null);
    return ChartMenu;
}(Component));
export { ChartMenu };

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
import { _, AgDialog, Autowired, CHART_TOOL_PANEL_MENU_OPTIONS, Component, Events, PostConstruct, RefSelector, } from "@ag-grid-community/core";
import { ChartMenu } from "./menu/chartMenu";
import { TitleEdit } from "./chartTitle/titleEdit";
import { ChartController, DEFAULT_THEMES } from "./chartController";
import { ChartDataModel } from "./model/chartDataModel";
import { BarChartProxy } from "./chartProxies/cartesian/barChartProxy";
import { AreaChartProxy } from "./chartProxies/cartesian/areaChartProxy";
import { LineChartProxy } from "./chartProxies/cartesian/lineChartProxy";
import { PieChartProxy } from "./chartProxies/polar/pieChartProxy";
import { ScatterChartProxy } from "./chartProxies/cartesian/scatterChartProxy";
import { HistogramChartProxy } from "./chartProxies/cartesian/histogramChartProxy";
import { ChartOptionsService } from "./services/chartOptionsService";
import { ComboChartProxy } from "./chartProxies/combo/comboChartProxy";
var GridChartComp = /** @class */ (function (_super) {
    __extends(GridChartComp, _super);
    function GridChartComp(params) {
        var _this = _super.call(this, GridChartComp.TEMPLATE) || this;
        _this.params = params;
        return _this;
    }
    GridChartComp.prototype.init = function () {
        var _this = this;
        var modelParams = {
            chartId: this.params.chartId,
            pivotChart: this.params.pivotChart,
            chartType: this.params.chartType,
            chartThemeName: this.getThemeName(),
            aggFunc: this.params.aggFunc,
            cellRange: this.params.cellRange,
            suppressChartRanges: this.params.suppressChartRanges,
            unlinkChart: this.params.unlinkChart,
            crossFiltering: this.params.crossFiltering,
            seriesChartTypes: this.params.seriesChartTypes,
        };
        var isRtl = this.gridOptionsService.get('enableRtl');
        this.addCssClass(isRtl ? 'ag-rtl' : 'ag-ltr');
        // only the chart controller interacts with the chart model
        var model = this.createBean(new ChartDataModel(modelParams));
        this.chartController = this.createManagedBean(new ChartController(model));
        this.validateCustomThemes();
        // create chart before dialog to ensure dialog is correct size
        this.createChart();
        if (this.params.insideDialog) {
            this.addDialog();
        }
        this.addMenu();
        this.addTitleEditComp();
        this.addManagedListener(this.getGui(), 'focusin', this.setActiveChartCellRange.bind(this));
        this.addManagedListener(this.chartController, ChartController.EVENT_CHART_MODEL_UPDATE, this.update.bind(this));
        this.addManagedPropertyListeners(['chartThemeOverrides', 'chartThemes'], this.reactivePropertyUpdate.bind(this));
        if (this.chartMenu) {
            // chart menu may not exist, i.e. cross filtering
            this.addManagedListener(this.chartMenu, ChartMenu.EVENT_DOWNLOAD_CHART, function () { return _this.downloadChart(); });
        }
        this.update();
        this.raiseChartCreatedEvent();
    };
    GridChartComp.prototype.createChart = function () {
        var _this = this;
        // if chart already exists, destroy it and remove it from DOM
        var chartInstance = undefined;
        if (this.chartProxy) {
            chartInstance = this.chartProxy.destroy({ keepChartInstance: true });
        }
        var crossFilterCallback = function (event, reset) {
            var ctx = _this.params.crossFilteringContext;
            ctx.lastSelectedChartId = reset ? '' : _this.chartController.getChartId();
            if (reset) {
                _this.params.crossFilteringResetCallback();
            }
            _this.crossFilterService.filter(event, reset);
        };
        var chartType = this.chartController.getChartType();
        var chartProxyParams = {
            chartType: chartType,
            chartInstance: chartInstance,
            getChartThemeName: this.getChartThemeName.bind(this),
            getChartThemes: this.getChartThemes.bind(this),
            customChartThemes: this.gridOptionsService.get('customChartThemes'),
            getGridOptionsChartThemeOverrides: function () { return _this.getGridOptionsChartThemeOverrides(); },
            getExtraPaddingDirections: function () { var _a, _b; return (_b = (_a = _this.chartMenu) === null || _a === void 0 ? void 0 : _a.getExtraPaddingDirections()) !== null && _b !== void 0 ? _b : []; },
            apiChartThemeOverrides: this.params.chartThemeOverrides,
            crossFiltering: this.params.crossFiltering,
            crossFilterCallback: crossFilterCallback,
            parentElement: this.eChart,
            grouping: this.chartController.isGrouping(),
            chartThemeToRestore: this.params.chartThemeName,
            chartOptionsToRestore: this.params.chartOptionsToRestore,
            chartPaletteToRestore: this.params.chartPaletteToRestore,
            seriesChartTypes: this.chartController.getSeriesChartTypes(),
            translate: function (toTranslate, defaultText) { return _this.chartTranslationService.translate(toTranslate, defaultText); },
        };
        // ensure 'restoring' options are not reused when switching chart types
        this.params.chartOptionsToRestore = undefined;
        // set local state used to detect when chart changes
        this.chartType = chartType;
        this.chartProxy = GridChartComp.createChartProxy(chartProxyParams);
        if (!this.chartProxy) {
            console.warn('AG Grid: invalid chart type supplied: ', chartProxyParams.chartType);
            return;
        }
        var canvas = this.eChart.querySelector('canvas');
        if (canvas) {
            canvas.classList.add('ag-charts-canvas');
        }
        this.chartController.setChartProxy(this.chartProxy);
        this.chartOptionsService = this.createBean(new ChartOptionsService(this.chartController));
        this.titleEdit && this.titleEdit.refreshTitle(this.chartController, this.chartOptionsService);
    };
    GridChartComp.prototype.getChartThemeName = function () {
        return this.chartController.getChartThemeName();
    };
    GridChartComp.prototype.getChartThemes = function () {
        return this.chartController.getThemes();
    };
    GridChartComp.prototype.getGridOptionsChartThemeOverrides = function () {
        return this.gridOptionsService.get('chartThemeOverrides');
    };
    GridChartComp.createChartProxy = function (chartProxyParams) {
        switch (chartProxyParams.chartType) {
            case 'column':
            case 'bar':
            case 'groupedColumn':
            case 'stackedColumn':
            case 'normalizedColumn':
            case 'groupedBar':
            case 'stackedBar':
            case 'normalizedBar':
                return new BarChartProxy(chartProxyParams);
            case 'pie':
            case 'doughnut':
                return new PieChartProxy(chartProxyParams);
            case 'area':
            case 'stackedArea':
            case 'normalizedArea':
                return new AreaChartProxy(chartProxyParams);
            case 'line':
                return new LineChartProxy(chartProxyParams);
            case 'scatter':
            case 'bubble':
                return new ScatterChartProxy(chartProxyParams);
            case 'histogram':
                return new HistogramChartProxy(chartProxyParams);
            case 'columnLineCombo':
            case 'areaColumnCombo':
            case 'customCombo':
                return new ComboChartProxy(chartProxyParams);
            default:
                throw "AG Grid: Unable to create chart as an invalid chartType = '".concat(chartProxyParams.chartType, "' was supplied.");
        }
    };
    GridChartComp.prototype.addDialog = function () {
        var _this = this;
        var title = this.chartTranslationService.translate(this.params.pivotChart ? 'pivotChartTitle' : 'rangeChartTitle');
        var _a = this.getBestDialogSize(), width = _a.width, height = _a.height;
        this.chartDialog = new AgDialog({
            resizable: true,
            movable: true,
            maximizable: true,
            title: title,
            width: width,
            height: height,
            component: this,
            centered: true,
            closable: true
        });
        this.getContext().createBean(this.chartDialog);
        this.chartDialog.addEventListener(AgDialog.EVENT_DESTROYED, function () { return _this.destroy(); });
    };
    GridChartComp.prototype.getBestDialogSize = function () {
        var popupParent = this.popupService.getPopupParent();
        var maxWidth = _.getAbsoluteWidth(popupParent) * 0.75;
        var maxHeight = _.getAbsoluteHeight(popupParent) * 0.75;
        var ratio = 0.553;
        var chart = this.chartProxy.getChart();
        var width = this.params.insideDialog ? 850 : chart.width;
        var height = this.params.insideDialog ? 470 : chart.height;
        if (width > maxWidth || height > maxHeight) {
            width = Math.min(width, maxWidth);
            height = Math.round(width * ratio);
            if (height > maxHeight) {
                height = maxHeight;
                width = Math.min(width, Math.round(height / ratio));
            }
        }
        return { width: width, height: height };
    };
    GridChartComp.prototype.addMenu = function () {
        if (!this.params.crossFiltering) {
            this.chartMenu = this.createBean(new ChartMenu(this.eChartContainer, this.eMenuContainer, this.chartController, this.chartOptionsService));
            this.eChartContainer.appendChild(this.chartMenu.getGui());
        }
    };
    GridChartComp.prototype.addTitleEditComp = function () {
        this.titleEdit = this.createBean(new TitleEdit(this.chartMenu));
        this.eTitleEditContainer.appendChild(this.titleEdit.getGui());
        if (this.chartProxy) {
            this.titleEdit.refreshTitle(this.chartController, this.chartOptionsService);
        }
    };
    GridChartComp.prototype.update = function (params) {
        var _this = this;
        // update chart model for api.updateChart()
        if (params === null || params === void 0 ? void 0 : params.chartId) {
            var validUpdate = this.chartController.update(params);
            if (!validUpdate) {
                return; // warning already logged!
            }
        }
        var chartTypeChanged = this.chartTypeChanged(params);
        // recreate chart if chart type has changed
        if (chartTypeChanged)
            this.createChart();
        // update chart options if chart type hasn't changed or if overrides are supplied
        this.updateChart(params === null || params === void 0 ? void 0 : params.chartThemeOverrides);
        if (params === null || params === void 0 ? void 0 : params.chartId) {
            this.chartProxy.getChart().waitForUpdate().then(function () {
                _this.chartController.raiseChartApiUpdateEvent();
            });
        }
    };
    GridChartComp.prototype.updateChart = function (updatedOverrides) {
        var _this = this;
        var chartProxy = this.chartProxy;
        var selectedCols = this.chartController.getSelectedValueColState();
        var fields = selectedCols.map(function (c) { return ({ colId: c.colId, displayName: c.displayName }); });
        var data = this.chartController.getChartData();
        var chartEmpty = this.handleEmptyChart(data, fields);
        if (chartEmpty) {
            return;
        }
        var chartUpdateParams = this.chartController.getChartUpdateParams(updatedOverrides);
        chartProxy.update(chartUpdateParams);
        this.chartProxy.getChart().waitForUpdate().then(function () {
            _this.chartController.raiseChartUpdatedEvent();
        });
        this.titleEdit.refreshTitle(this.chartController, this.chartOptionsService);
    };
    GridChartComp.prototype.chartTypeChanged = function (updateParams) {
        var _a = __read([this.chartController.getChartType(), updateParams === null || updateParams === void 0 ? void 0 : updateParams.chartType], 2), currentType = _a[0], updatedChartType = _a[1];
        return this.chartType !== currentType || (!!updatedChartType && this.chartType !== updatedChartType);
    };
    GridChartComp.prototype.getChartModel = function () {
        return this.chartController.getChartModel();
    };
    GridChartComp.prototype.getChartImageDataURL = function (fileFormat) {
        return this.chartProxy.getChartImageDataURL(fileFormat);
    };
    GridChartComp.prototype.handleEmptyChart = function (data, fields) {
        var pivotModeDisabled = this.chartController.isPivotChart() && !this.chartController.isPivotMode();
        var minFieldsRequired = 1;
        if (this.chartController.isActiveXYChart()) {
            minFieldsRequired = this.chartController.getChartType() === 'bubble' ? 3 : 2;
        }
        var isEmptyChart = fields.length < minFieldsRequired || data.length === 0;
        if (this.eChart) {
            var isEmpty = pivotModeDisabled || isEmptyChart;
            _.setDisplayed(this.eChart, !isEmpty);
            _.setDisplayed(this.eEmpty, isEmpty);
        }
        if (pivotModeDisabled) {
            this.eEmpty.innerText = this.chartTranslationService.translate('pivotChartRequiresPivotMode');
            return true;
        }
        if (isEmptyChart) {
            this.eEmpty.innerText = this.chartTranslationService.translate('noDataToChart');
            return true;
        }
        return false;
    };
    GridChartComp.prototype.downloadChart = function (dimensions, fileName, fileFormat) {
        this.chartProxy.downloadChart(dimensions, fileName, fileFormat);
    };
    GridChartComp.prototype.openChartToolPanel = function (panel) {
        var menuPanel = panel ? CHART_TOOL_PANEL_MENU_OPTIONS[panel] : panel;
        this.chartMenu.showMenu(menuPanel);
    };
    GridChartComp.prototype.closeChartToolPanel = function () {
        this.chartMenu.hideMenu();
    };
    GridChartComp.prototype.getChartId = function () {
        return this.chartController.getChartId();
    };
    GridChartComp.prototype.getUnderlyingChart = function () {
        return this.chartProxy.getChartRef();
    };
    GridChartComp.prototype.crossFilteringReset = function () {
        this.chartProxy.crossFilteringReset();
    };
    GridChartComp.prototype.setActiveChartCellRange = function (focusEvent) {
        if (this.getGui().contains(focusEvent.relatedTarget)) {
            return;
        }
        this.chartController.setChartRange(true);
        this.gridApi.focusService.clearFocusedCell();
    };
    GridChartComp.prototype.getThemeName = function () {
        var availableChartThemes = this.gridOptionsService.get('chartThemes') || DEFAULT_THEMES;
        if (availableChartThemes.length === 0) {
            throw new Error('Cannot create chart: no chart themes available.');
        }
        var chartThemeName = this.params.chartThemeName;
        return _.includes(availableChartThemes, chartThemeName) ? chartThemeName : availableChartThemes[0];
    };
    GridChartComp.prototype.validateCustomThemes = function () {
        var suppliedThemes = this.getChartThemes();
        var customChartThemes = this.gridOptionsService.get('customChartThemes');
        if (customChartThemes) {
            _.getAllKeysInObjects([customChartThemes]).forEach(function (customThemeName) {
                if (!_.includes(suppliedThemes, customThemeName)) {
                    console.warn("AG Grid: a custom chart theme with the name '" + customThemeName + "' has been " +
                        "supplied but not added to the 'chartThemes' list");
                }
            });
        }
    };
    GridChartComp.prototype.reactivePropertyUpdate = function () {
        // switch to the first theme if the current theme is unavailable
        this.chartController.setChartThemeName(this.getThemeName(), true);
        var chartId = this.getChartId();
        var modelType = this.chartController.isCrossFilterChart()
            ? 'crossFilter'
            : this.getChartModel().modelType;
        // standalone requires that `undefined` / `null` values are supplied as `{}`
        var chartThemeOverrides = this.gridOptionsService.get('chartThemeOverrides') || {};
        this.update({
            type: "".concat(modelType, "ChartUpdate"),
            chartId: chartId,
            chartThemeOverrides: chartThemeOverrides
        });
    };
    GridChartComp.prototype.raiseChartCreatedEvent = function () {
        var _this = this;
        var event = {
            type: Events.EVENT_CHART_CREATED,
            chartId: this.chartController.getChartId()
        };
        this.chartProxy.getChart().waitForUpdate().then(function () {
            _this.eventService.dispatchEvent(event);
        });
    };
    GridChartComp.prototype.raiseChartDestroyedEvent = function () {
        var event = {
            type: Events.EVENT_CHART_DESTROYED,
            chartId: this.chartController.getChartId(),
        };
        this.eventService.dispatchEvent(event);
    };
    GridChartComp.prototype.destroy = function () {
        var _a;
        _super.prototype.destroy.call(this);
        if (this.chartProxy) {
            this.chartProxy.destroy();
        }
        this.destroyBean(this.chartMenu);
        this.destroyBean(this.titleEdit);
        // don't want to invoke destroy() on the Dialog (prevents destroy loop)
        if (this.chartDialog && this.chartDialog.isAlive()) {
            this.destroyBean(this.chartDialog);
        }
        (_a = this.onDestroyColorSchemeChangeListener) === null || _a === void 0 ? void 0 : _a.call(this);
        // if the user is providing containers for the charts, we need to clean up, otherwise the old chart
        // data will still be visible although the chart is no longer bound to the grid
        var eGui = this.getGui();
        _.clearElement(eGui);
        // remove from parent, so if user provided container, we detach from the provided dom element
        _.removeFromParent(eGui);
        this.raiseChartDestroyedEvent();
    };
    GridChartComp.TEMPLATE = "<div class=\"ag-chart\" tabindex=\"-1\">\n            <div ref=\"eChartContainer\" tabindex=\"-1\" class=\"ag-chart-components-wrapper\">\n                <div ref=\"eChart\" class=\"ag-chart-canvas-wrapper\"></div>\n                <div ref=\"eEmpty\" class=\"ag-chart-empty-text ag-unselectable\"></div>\n            </div>\n            <div ref=\"eTitleEditContainer\"></div>\n            <div ref=\"eMenuContainer\" class=\"ag-chart-docked-container\" style=\"min-width: 0px;\"></div>\n        </div>";
    __decorate([
        RefSelector('eChart')
    ], GridChartComp.prototype, "eChart", void 0);
    __decorate([
        RefSelector('eChartContainer')
    ], GridChartComp.prototype, "eChartContainer", void 0);
    __decorate([
        RefSelector('eMenuContainer')
    ], GridChartComp.prototype, "eMenuContainer", void 0);
    __decorate([
        RefSelector('eEmpty')
    ], GridChartComp.prototype, "eEmpty", void 0);
    __decorate([
        RefSelector('eTitleEditContainer')
    ], GridChartComp.prototype, "eTitleEditContainer", void 0);
    __decorate([
        Autowired('chartCrossFilterService')
    ], GridChartComp.prototype, "crossFilterService", void 0);
    __decorate([
        Autowired('chartTranslationService')
    ], GridChartComp.prototype, "chartTranslationService", void 0);
    __decorate([
        Autowired('gridApi')
    ], GridChartComp.prototype, "gridApi", void 0);
    __decorate([
        Autowired('popupService')
    ], GridChartComp.prototype, "popupService", void 0);
    __decorate([
        PostConstruct
    ], GridChartComp.prototype, "init", null);
    return GridChartComp;
}(Component));
export { GridChartComp };

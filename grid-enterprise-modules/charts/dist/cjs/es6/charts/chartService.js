"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartService = void 0;
const core_1 = require("@ag-grid-community/core");
const ag_charts_community_1 = require("ag-charts-community");
// import { AgChartThemeOverrides, AgChartThemePalette, VERSION as CHARTS_VERSION } from "ag-charts-enterprise";
const gridChartComp_1 = require("./chartComp/gridChartComp");
const chartModelMigration_1 = require("./chartModelMigration");
const version_1 = require("../version");
let ChartService = class ChartService extends core_1.BeanStub {
    constructor() {
        super(...arguments);
        // we destroy all charts bound to this grid when grid is destroyed. activeCharts contains all charts, including
        // those in developer provided containers.
        this.activeCharts = new Set();
        this.activeChartComps = new Set();
        // this shared (singleton) context is used by cross filtering in line and area charts
        this.crossFilteringContext = {
            lastSelectedChartId: '',
        };
    }
    updateChart(params) {
        if (this.activeChartComps.size === 0) {
            console.warn(`AG Grid - No active charts to update.`);
            return;
        }
        const chartComp = [...this.activeChartComps].find(chartComp => chartComp.getChartId() === params.chartId);
        if (!chartComp) {
            console.warn(`AG Grid - Unable to update chart. No active chart found with ID: ${params.chartId}.`);
            return;
        }
        chartComp.update(params);
    }
    getChartModels() {
        const models = [];
        const versionedModel = (c) => {
            return Object.assign(Object.assign({}, c), { version: version_1.VERSION });
        };
        this.activeChartComps.forEach(c => models.push(versionedModel(c.getChartModel())));
        return models;
    }
    getChartRef(chartId) {
        let chartRef;
        this.activeCharts.forEach(cr => {
            if (cr.chartId === chartId) {
                chartRef = cr;
            }
        });
        return chartRef;
    }
    getChartComp(chartId) {
        let chartComp;
        this.activeChartComps.forEach(comp => {
            if (comp.getChartId() === chartId) {
                chartComp = comp;
            }
        });
        return chartComp;
    }
    getChartImageDataURL(params) {
        let url;
        this.activeChartComps.forEach(c => {
            if (c.getChartId() === params.chartId) {
                url = c.getChartImageDataURL(params.fileFormat);
            }
        });
        return url;
    }
    downloadChart(params) {
        const chartComp = Array.from(this.activeChartComps).find(c => c.getChartId() === params.chartId);
        chartComp === null || chartComp === void 0 ? void 0 : chartComp.downloadChart(params.dimensions, params.fileName, params.fileFormat);
    }
    openChartToolPanel(params) {
        const chartComp = Array.from(this.activeChartComps).find(c => c.getChartId() === params.chartId);
        chartComp === null || chartComp === void 0 ? void 0 : chartComp.openChartToolPanel(params.panel);
    }
    closeChartToolPanel(chartId) {
        const chartComp = Array.from(this.activeChartComps).find(c => c.getChartId() === chartId);
        chartComp === null || chartComp === void 0 ? void 0 : chartComp.closeChartToolPanel();
    }
    createChartFromCurrentRange(chartType = 'groupedColumn') {
        const selectedRange = this.getSelectedRange();
        return this.createChart(selectedRange, chartType);
    }
    restoreChart(model, chartContainer) {
        if (!model) {
            console.warn("AG Grid - unable to restore chart as no chart model is provided");
            return;
        }
        if (model.version !== version_1.VERSION) {
            model = (0, chartModelMigration_1.upgradeChartModel)(model);
        }
        const params = {
            cellRange: model.cellRange,
            chartType: model.chartType,
            chartThemeName: model.chartThemeName,
            chartContainer: chartContainer,
            suppressChartRanges: model.suppressChartRanges,
            aggFunc: model.aggFunc,
            unlinkChart: model.unlinkChart,
            seriesChartTypes: model.seriesChartTypes
        };
        const getCellRange = (cellRangeParams) => {
            return this.rangeService
                ? this.rangeService.createCellRangeFromCellRangeParams(cellRangeParams)
                : undefined;
        };
        if (model.modelType === 'pivot') {
            // if required enter pivot mode
            if (!this.columnModel.isPivotMode()) {
                this.columnModel.setPivotMode(true, "pivotChart");
            }
            // pivot chart range contains all visible column without a row range to include all rows
            const columns = this.columnModel.getAllDisplayedColumns().map(col => col.getColId());
            const chartAllRangeParams = {
                rowStartIndex: null,
                rowStartPinned: undefined,
                rowEndIndex: null,
                rowEndPinned: undefined,
                columns
            };
            const cellRange = getCellRange(chartAllRangeParams);
            if (!cellRange) {
                console.warn("AG Grid - unable to create chart as there are no columns in the grid.");
                return;
            }
            return this.createChart(cellRange, params.chartType, params.chartThemeName, true, true, params.chartContainer, undefined, undefined, params.unlinkChart, false, model.chartOptions);
        }
        const cellRange = getCellRange(params.cellRange);
        if (!cellRange) {
            console.warn("AG Grid - unable to create chart as no range is selected");
            return;
        }
        return this.createChart(cellRange, params.chartType, params.chartThemeName, false, params.suppressChartRanges, params.chartContainer, params.aggFunc, undefined, params.unlinkChart, false, model.chartOptions, model.chartPalette, params.seriesChartTypes);
    }
    createRangeChart(params) {
        var _a;
        const cellRange = (_a = this.rangeService) === null || _a === void 0 ? void 0 : _a.createCellRangeFromCellRangeParams(params.cellRange);
        if (!cellRange) {
            console.warn("AG Grid - unable to create chart as no range is selected");
            return;
        }
        return this.createChart(cellRange, params.chartType, params.chartThemeName, false, params.suppressChartRanges, params.chartContainer, params.aggFunc, params.chartThemeOverrides, params.unlinkChart, undefined, undefined, undefined, params.seriesChartTypes);
    }
    createPivotChart(params) {
        // if required enter pivot mode
        if (!this.columnModel.isPivotMode()) {
            this.columnModel.setPivotMode(true, "pivotChart");
        }
        // pivot chart range contains all visible column without a row range to include all rows
        const chartAllRangeParams = {
            rowStartIndex: null,
            rowStartPinned: undefined,
            rowEndIndex: null,
            rowEndPinned: undefined,
            columns: this.columnModel.getAllDisplayedColumns().map(col => col.getColId())
        };
        const cellRange = this.rangeService
            ? this.rangeService.createCellRangeFromCellRangeParams(chartAllRangeParams)
            : undefined;
        if (!cellRange) {
            console.warn("AG Grid - unable to create chart as there are no columns in the grid.");
            return;
        }
        return this.createChart(cellRange, params.chartType, params.chartThemeName, true, true, params.chartContainer, undefined, params.chartThemeOverrides, params.unlinkChart);
    }
    createCrossFilterChart(params) {
        var _a;
        const cellRange = (_a = this.rangeService) === null || _a === void 0 ? void 0 : _a.createCellRangeFromCellRangeParams(params.cellRange);
        if (!cellRange) {
            console.warn("AG Grid - unable to create chart as no range is selected");
            return;
        }
        const crossFiltering = true;
        const suppressChartRangesSupplied = typeof params.suppressChartRanges !== 'undefined' && params.suppressChartRanges !== null;
        const suppressChartRanges = suppressChartRangesSupplied ? params.suppressChartRanges : true;
        return this.createChart(cellRange, params.chartType, params.chartThemeName, false, suppressChartRanges, params.chartContainer, params.aggFunc, params.chartThemeOverrides, params.unlinkChart, crossFiltering);
    }
    createChart(cellRange, chartType, chartThemeName, pivotChart = false, suppressChartRanges = false, container, aggFunc, chartThemeOverrides, unlinkChart = false, crossFiltering = false, chartOptionsToRestore, chartPaletteToRestore, seriesChartTypes) {
        const createChartContainerFunc = this.gridOptionsService.getCallback('createChartContainer');
        const params = {
            chartId: this.generateId(),
            pivotChart,
            cellRange,
            chartType,
            chartThemeName,
            insideDialog: !(container || createChartContainerFunc),
            suppressChartRanges,
            aggFunc,
            chartThemeOverrides,
            unlinkChart,
            crossFiltering,
            crossFilteringContext: this.crossFilteringContext,
            chartOptionsToRestore,
            chartPaletteToRestore,
            seriesChartTypes,
            crossFilteringResetCallback: () => this.activeChartComps.forEach(c => c.crossFilteringReset())
        };
        const chartComp = new gridChartComp_1.GridChartComp(params);
        this.context.createBean(chartComp);
        const chartRef = this.createChartRef(chartComp);
        if (container) {
            // if container exists, means developer initiated chart create via API, so place in provided container
            container.appendChild(chartComp.getGui());
            // if the chart container was placed outside an element that
            // has the grid's theme, we manually add the current theme to
            // make sure all styles for the chartMenu are rendered correctly
            const theme = this.environment.getTheme();
            if (theme.el && !theme.el.contains(container)) {
                container.classList.add(theme.theme);
            }
        }
        else if (createChartContainerFunc) {
            // otherwise, user created chart via grid UI, check if developer provides containers (e.g. if the application
            // is using its own dialogs rather than the grid provided dialogs)
            createChartContainerFunc(chartRef);
        }
        else {
            // add listener to remove from active charts list when charts are destroyed, e.g. closing chart dialog
            chartComp.addEventListener(gridChartComp_1.GridChartComp.EVENT_DESTROYED, () => {
                this.activeChartComps.delete(chartComp);
                this.activeCharts.delete(chartRef);
            });
        }
        return chartRef;
    }
    createChartRef(chartComp) {
        const chartRef = {
            destroyChart: () => {
                if (this.activeCharts.has(chartRef)) {
                    this.context.destroyBean(chartComp);
                    this.activeChartComps.delete(chartComp);
                    this.activeCharts.delete(chartRef);
                }
            },
            chartElement: chartComp.getGui(),
            chart: chartComp.getUnderlyingChart(),
            chartId: chartComp.getChartModel().chartId
        };
        this.activeCharts.add(chartRef);
        this.activeChartComps.add(chartComp);
        return chartRef;
    }
    getSelectedRange() {
        const ranges = this.rangeService.getCellRanges();
        return ranges.length > 0 ? ranges[0] : {};
    }
    generateId() {
        return `id-${Math.random().toString(36).substring(2, 18)}`;
    }
    destroyAllActiveCharts() {
        this.activeCharts.forEach(chart => chart.destroyChart());
    }
};
ChartService.CHARTS_VERSION = ag_charts_community_1.VERSION;
__decorate([
    (0, core_1.Optional)('rangeService')
], ChartService.prototype, "rangeService", void 0);
__decorate([
    (0, core_1.Autowired)('columnModel')
], ChartService.prototype, "columnModel", void 0);
__decorate([
    core_1.PreDestroy
], ChartService.prototype, "destroyAllActiveCharts", null);
ChartService = __decorate([
    (0, core_1.Bean)('chartService')
], ChartService);
exports.ChartService = ChartService;

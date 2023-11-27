"use strict";
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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarChartProxy = void 0;
var core_1 = require("@ag-grid-community/core");
var cartesianChartProxy_1 = require("./cartesianChartProxy");
var object_1 = require("../../utils/object");
var color_1 = require("../../utils/color");
var seriesTypeMapper_1 = require("../../utils/seriesTypeMapper");
var BarChartProxy = /** @class */ (function (_super) {
    __extends(BarChartProxy, _super);
    function BarChartProxy(params) {
        return _super.call(this, params) || this;
    }
    BarChartProxy.prototype.getAxes = function (params) {
        var axes = [
            {
                type: this.getXAxisType(params),
                position: (0, seriesTypeMapper_1.isHorizontal)(this.chartType) ? 'left' : 'bottom',
            },
            {
                type: 'number',
                position: (0, seriesTypeMapper_1.isHorizontal)(this.chartType) ? 'bottom' : 'left',
            },
        ];
        // Add a default label formatter to show '%' for normalized charts if none is provided
        if (this.isNormalised()) {
            var numberAxis = axes[1];
            numberAxis.label = __assign(__assign({}, numberAxis.label), { formatter: function (params) { return Math.round(params.value) + '%'; } });
        }
        return axes;
    };
    BarChartProxy.prototype.getSeries = function (params) {
        var _this = this;
        var series = params.fields.map(function (f) { return ({
            type: _this.standaloneChartType,
            direction: (0, seriesTypeMapper_1.isHorizontal)(_this.chartType) ? 'horizontal' : 'vertical',
            stacked: (0, seriesTypeMapper_1.isStacked)(_this.chartType),
            normalizedTo: _this.isNormalised() ? 100 : undefined,
            xKey: params.category.id,
            xName: params.category.name,
            yKey: f.colId,
            yName: f.displayName
        }); });
        return this.crossFiltering ? this.extractCrossFilterSeries(series) : series;
    };
    BarChartProxy.prototype.extractCrossFilterSeries = function (series) {
        var _this = this;
        var palette = this.getChartPalette();
        var updatePrimarySeries = function (seriesOptions, index) {
            return __assign(__assign({}, seriesOptions), { highlightStyle: { item: { fill: undefined } }, fill: palette === null || palette === void 0 ? void 0 : palette.fills[index], stroke: palette === null || palette === void 0 ? void 0 : palette.strokes[index], listeners: {
                    nodeClick: _this.crossFilterCallback
                } });
        };
        var updateFilteredOutSeries = function (seriesOptions) {
            var yKey = seriesOptions.yKey + '-filtered-out';
            return __assign(__assign({}, (0, object_1.deepMerge)({}, seriesOptions)), { yKey: yKey, fill: (0, color_1.hexToRGBA)(seriesOptions.fill, '0.3'), stroke: (0, color_1.hexToRGBA)(seriesOptions.stroke, '0.3'), showInLegend: false });
        };
        var allSeries = [];
        for (var i = 0; i < series.length; i++) {
            // update primary series
            var primarySeries = updatePrimarySeries(series[i], i);
            allSeries.push(primarySeries);
            // add 'filtered-out' series
            allSeries.push(updateFilteredOutSeries(primarySeries));
        }
        return allSeries;
    };
    BarChartProxy.prototype.isNormalised = function () {
        var normalisedCharts = ['normalizedColumn', 'normalizedBar'];
        return !this.crossFiltering && core_1._.includes(normalisedCharts, this.chartType);
    };
    return BarChartProxy;
}(cartesianChartProxy_1.CartesianChartProxy));
exports.BarChartProxy = BarChartProxy;

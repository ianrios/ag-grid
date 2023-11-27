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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AreaSparkline = void 0;
var ag_charts_community_1 = require("ag-charts-community");
var sparkline_1 = require("../sparkline");
var sparklineTooltip_1 = require("../tooltip/sparklineTooltip");
var markerFactory_1 = require("../marker/markerFactory");
var lineDash_1 = require("../../util/lineDash");
var extent = ag_charts_community_1._Util.extent;
var BandScale = ag_charts_community_1._Scale.BandScale;
var SparklineMarker = /** @class */ (function () {
    function SparklineMarker() {
        this.enabled = true;
        this.shape = 'circle';
        this.size = 0;
        this.fill = 'rgb(124, 181, 236)';
        this.stroke = 'rgb(124, 181, 236)';
        this.strokeWidth = 1;
        this.formatter = undefined;
    }
    return SparklineMarker;
}());
var SparklineLine = /** @class */ (function () {
    function SparklineLine() {
        this.stroke = 'rgb(124, 181, 236)';
        this.strokeWidth = 1;
    }
    return SparklineLine;
}());
var SparklineCrosshairs = /** @class */ (function () {
    function SparklineCrosshairs() {
        this.xLine = {
            enabled: true,
            stroke: 'rgba(0,0,0, 0.54)',
            strokeWidth: 1,
            lineDash: 'solid',
            lineCap: undefined,
        };
        this.yLine = {
            enabled: false,
            stroke: 'rgba(0,0,0, 0.54)',
            strokeWidth: 1,
            lineDash: 'solid',
            lineCap: undefined,
        };
    }
    return SparklineCrosshairs;
}());
var AreaSparkline = /** @class */ (function (_super) {
    __extends(AreaSparkline, _super);
    function AreaSparkline() {
        var _this = _super.call(this) || this;
        _this.fill = 'rgba(124, 181, 236, 0.25)';
        _this.strokePath = new ag_charts_community_1._Scene.Path();
        _this.fillPath = new ag_charts_community_1._Scene.Path();
        _this.xCrosshairLine = new ag_charts_community_1._Scene.Line();
        _this.yCrosshairLine = new ag_charts_community_1._Scene.Line();
        _this.areaSparklineGroup = new ag_charts_community_1._Scene.Group();
        _this.xAxisLine = new ag_charts_community_1._Scene.Line();
        _this.markers = new ag_charts_community_1._Scene.Group();
        _this.markerSelection = ag_charts_community_1._Scene.Selection.select(_this.markers, function () { return _this.markerFactory(); });
        _this.markerSelectionData = [];
        _this.marker = new SparklineMarker();
        _this.line = new SparklineLine();
        _this.crosshairs = new SparklineCrosshairs();
        _this.rootGroup.append(_this.areaSparklineGroup);
        _this.xAxisLine.zIndex = sparkline_1.ZINDICIES.AXIS_LINE_ZINDEX;
        _this.fillPath.zIndex = sparkline_1.ZINDICIES.SERIES_FILL_ZINDEX;
        _this.strokePath.zIndex = sparkline_1.ZINDICIES.SERIES_STROKE_ZINDEX;
        _this.xCrosshairLine.zIndex = sparkline_1.ZINDICIES.CROSSHAIR_ZINDEX;
        _this.yCrosshairLine.zIndex = sparkline_1.ZINDICIES.CROSSHAIR_ZINDEX;
        _this.markers.zIndex = sparkline_1.ZINDICIES.SERIES_MARKERS_ZINDEX;
        _this.areaSparklineGroup.append([
            _this.fillPath,
            _this.xAxisLine,
            _this.strokePath,
            _this.xCrosshairLine,
            _this.yCrosshairLine,
            _this.markers,
        ]);
        return _this;
    }
    AreaSparkline.prototype.markerFactory = function () {
        var shape = this.marker.shape;
        var MarkerShape = (0, markerFactory_1.getMarker)(shape);
        return new MarkerShape();
    };
    AreaSparkline.prototype.getNodeData = function () {
        return this.markerSelectionData;
    };
    AreaSparkline.prototype.update = function () {
        var data = this.generateNodeData();
        if (!data) {
            return;
        }
        var nodeData = data.nodeData, fillData = data.fillData, strokeData = data.strokeData;
        this.markerSelectionData = nodeData;
        this.updateSelection(nodeData);
        this.updateNodes();
        this.updateStroke(strokeData);
        this.updateFill(fillData);
    };
    AreaSparkline.prototype.updateYScaleDomain = function () {
        var _a = this, yData = _a.yData, yScale = _a.yScale;
        var yMinMax = extent(yData);
        var yMin = 0;
        var yMax = 1;
        if (yMinMax !== undefined) {
            yMin = this.min = yMinMax[0];
            yMax = this.max = yMinMax[1];
        }
        // if yMin is positive, set yMin to 0
        yMin = yMin < 0 ? yMin : 0;
        // if yMax is negative, set yMax to 0
        yMax = yMax < 0 ? 0 : yMax;
        yScale.domain = [yMin, yMax];
    };
    AreaSparkline.prototype.generateNodeData = function () {
        var _a = this, data = _a.data, yData = _a.yData, xData = _a.xData, xScale = _a.xScale, yScale = _a.yScale;
        if (!data) {
            return;
        }
        var continuous = !(xScale instanceof BandScale);
        var offsetX = !continuous ? xScale.bandwidth / 2 : 0;
        var n = yData.length;
        var nodeData = [];
        var fillData = [];
        var strokeData = [];
        var firstValidX;
        var lastValidX;
        var previousX;
        var nextX;
        var yZero = yScale.convert(0);
        for (var i = 0; i < n; i++) {
            var yDatum = yData[i];
            var xDatum = xData[i];
            var x = xScale.convert(continuous ? xScale.toDomain(xDatum) : xDatum) + offsetX;
            var y = yDatum === undefined ? NaN : yScale.convert(yDatum);
            // if this iteration is not the last, set nextX using the next value in the data array
            if (i + 1 < n) {
                nextX = xScale.convert(continuous ? xScale.toDomain(xData[i + 1]) : xData[i + 1]) + offsetX;
            }
            // set stroke data regardless of missing/ undefined values. Undefined values will be handled in the updateStroke() method
            strokeData.push({
                seriesDatum: { x: xDatum, y: yDatum },
                point: { x: x, y: y },
            });
            if (yDatum === undefined && previousX !== undefined) {
                // if yDatum is undefined and there is a valid previous data point, add a phantom point at yZero
                // if a next data point exists, add a phantom point at yZero at the next X
                fillData.push({ seriesDatum: undefined, point: { x: previousX, y: yZero } });
                if (nextX !== undefined) {
                    fillData.push({ seriesDatum: undefined, point: { x: nextX, y: yZero } });
                }
            }
            else if (yDatum !== undefined) {
                fillData.push({
                    seriesDatum: { x: xDatum, y: yDatum },
                    point: { x: x, y: y },
                });
                // set node data only if yDatum is not undefined. These values are used in the updateSelection() method to update markers
                nodeData.push({
                    seriesDatum: { x: xDatum, y: yDatum },
                    point: { x: x, y: y },
                });
                firstValidX = firstValidX !== undefined ? firstValidX : x;
                lastValidX = x;
            }
            previousX = x;
        }
        // phantom points for creating closed area
        fillData.push({ seriesDatum: undefined, point: { x: lastValidX, y: yZero } }, { seriesDatum: undefined, point: { x: firstValidX, y: yZero } });
        return { nodeData: nodeData, fillData: fillData, strokeData: strokeData };
    };
    AreaSparkline.prototype.updateAxisLine = function () {
        var _a = this, xScale = _a.xScale, yScale = _a.yScale, axis = _a.axis, xAxisLine = _a.xAxisLine;
        xAxisLine.x1 = xScale.range[0];
        xAxisLine.x2 = xScale.range[1];
        xAxisLine.y1 = xAxisLine.y2 = 0;
        xAxisLine.stroke = axis.stroke;
        xAxisLine.strokeWidth = axis.strokeWidth;
        var yZero = yScale.convert(0);
        xAxisLine.translationY = yZero;
    };
    AreaSparkline.prototype.updateSelection = function (selectionData) {
        this.markerSelection.update(selectionData);
    };
    AreaSparkline.prototype.updateNodes = function () {
        var _this = this;
        var _a = this, highlightedDatum = _a.highlightedDatum, highlightStyle = _a.highlightStyle, marker = _a.marker;
        var highlightSize = highlightStyle.size, highlightFill = highlightStyle.fill, highlightStroke = highlightStyle.stroke, highlightStrokeWidth = highlightStyle.strokeWidth;
        var markerFormatter = marker.formatter;
        this.markerSelection.each(function (node, datum, index) {
            var point = datum.point, seriesDatum = datum.seriesDatum;
            if (!point) {
                return;
            }
            var highlighted = datum === highlightedDatum;
            var markerFill = highlighted && highlightFill !== undefined ? highlightFill : marker.fill;
            var markerStroke = highlighted && highlightStroke !== undefined ? highlightStroke : marker.stroke;
            var markerStrokeWidth = highlighted && highlightStrokeWidth !== undefined ? highlightStrokeWidth : marker.strokeWidth;
            var markerSize = highlighted && highlightSize !== undefined ? highlightSize : marker.size;
            var markerFormat;
            if (markerFormatter) {
                var first = index === 0;
                var last = index === _this.markerSelectionData.length - 1;
                var min = seriesDatum.y === _this.min;
                var max = seriesDatum.y === _this.max;
                markerFormat = markerFormatter({
                    datum: datum,
                    xValue: seriesDatum.x,
                    yValue: seriesDatum.y,
                    min: min,
                    max: max,
                    first: first,
                    last: last,
                    fill: markerFill,
                    stroke: markerStroke,
                    strokeWidth: markerStrokeWidth,
                    size: markerSize,
                    highlighted: highlighted,
                });
            }
            node.size = markerFormat && markerFormat.size != undefined ? markerFormat.size : markerSize;
            node.fill = markerFormat && markerFormat.fill != undefined ? markerFormat.fill : markerFill;
            node.stroke = markerFormat && markerFormat.stroke != undefined ? markerFormat.stroke : markerStroke;
            node.strokeWidth =
                markerFormat && markerFormat.strokeWidth != undefined ? markerFormat.strokeWidth : markerStrokeWidth;
            node.translationX = point.x;
            node.translationY = point.y;
            node.visible =
                markerFormat && markerFormat.enabled != undefined
                    ? markerFormat.enabled
                    : marker.enabled && node.size > 0;
        });
    };
    AreaSparkline.prototype.updateStroke = function (strokeData) {
        var _a = this, strokePath = _a.strokePath, yData = _a.yData, line = _a.line;
        if (yData.length < 2) {
            return;
        }
        var path = strokePath.path;
        var n = strokeData.length;
        var moveTo = true;
        path.clear();
        for (var i = 0; i < n; i++) {
            var _b = strokeData[i], point = _b.point, seriesDatum = _b.seriesDatum;
            var x = point.x;
            var y = point.y;
            if (seriesDatum.y == undefined) {
                moveTo = true;
            }
            else {
                if (moveTo) {
                    path.moveTo(x, y);
                    moveTo = false;
                }
                else {
                    path.lineTo(x, y);
                }
            }
        }
        strokePath.lineJoin = strokePath.lineCap = 'round';
        strokePath.fill = undefined;
        strokePath.stroke = line.stroke;
        strokePath.strokeWidth = line.strokeWidth;
    };
    AreaSparkline.prototype.updateFill = function (areaData) {
        var _a = this, fillPath = _a.fillPath, yData = _a.yData, fill = _a.fill;
        var path = fillPath.path;
        var n = areaData.length;
        path.clear();
        if (yData.length < 2) {
            return;
        }
        for (var i = 0; i < n; i++) {
            var point = areaData[i].point;
            var x = point.x;
            var y = point.y;
            if (i > 0) {
                path.lineTo(x, y);
            }
            else {
                path.moveTo(x, y);
            }
        }
        path.closePath();
        fillPath.lineJoin = 'round';
        fillPath.stroke = undefined;
        fillPath.fill = fill;
    };
    AreaSparkline.prototype.updateXCrosshairLine = function () {
        var _a;
        var _b = this, yScale = _b.yScale, xCrosshairLine = _b.xCrosshairLine, highlightedDatum = _b.highlightedDatum, xLine = _b.crosshairs.xLine;
        if (!xLine.enabled || highlightedDatum == undefined) {
            xCrosshairLine.strokeWidth = 0;
            return;
        }
        xCrosshairLine.y1 = yScale.range[0];
        xCrosshairLine.y2 = yScale.range[1];
        xCrosshairLine.x1 = xCrosshairLine.x2 = 0;
        xCrosshairLine.stroke = xLine.stroke;
        xCrosshairLine.strokeWidth = (_a = xLine.strokeWidth) !== null && _a !== void 0 ? _a : 1;
        xCrosshairLine.lineCap = xLine.lineCap === 'round' || xLine.lineCap === 'square' ? xLine.lineCap : undefined;
        var lineDash = xLine.lineDash;
        xCrosshairLine.lineDash = Array.isArray(lineDash)
            ? lineDash
            : (0, lineDash_1.getLineDash)(xCrosshairLine.lineCap, xLine.lineDash);
        xCrosshairLine.translationX = highlightedDatum.point.x;
    };
    AreaSparkline.prototype.updateYCrosshairLine = function () {
        var _a;
        var _b = this, xScale = _b.xScale, yCrosshairLine = _b.yCrosshairLine, highlightedDatum = _b.highlightedDatum, yLine = _b.crosshairs.yLine;
        if (!yLine.enabled || highlightedDatum == undefined) {
            yCrosshairLine.strokeWidth = 0;
            return;
        }
        yCrosshairLine.x1 = xScale.range[0];
        yCrosshairLine.x2 = xScale.range[1];
        yCrosshairLine.y1 = yCrosshairLine.y2 = 0;
        yCrosshairLine.stroke = yLine.stroke;
        yCrosshairLine.strokeWidth = (_a = yLine.strokeWidth) !== null && _a !== void 0 ? _a : 1;
        yCrosshairLine.lineCap = yLine.lineCap === 'round' || yLine.lineCap === 'square' ? yLine.lineCap : undefined;
        var lineDash = yLine.lineDash;
        yCrosshairLine.lineDash = Array.isArray(lineDash)
            ? lineDash
            : (0, lineDash_1.getLineDash)(yCrosshairLine.lineCap, yLine.lineDash);
        yCrosshairLine.translationY = highlightedDatum.point.y;
    };
    AreaSparkline.prototype.getTooltipHtml = function (datum) {
        var _a, _b;
        var dataType = this.dataType;
        var seriesDatum = datum.seriesDatum;
        var yValue = seriesDatum.y;
        var xValue = seriesDatum.x;
        var content = this.formatNumericDatum(yValue);
        var title = dataType === 'array' || dataType === 'object' ? this.formatDatum(xValue) : undefined;
        var defaults = {
            content: content,
            title: title,
        };
        var tooltipRenderer = (_b = (_a = this.processedOptions) === null || _a === void 0 ? void 0 : _a.tooltip) === null || _b === void 0 ? void 0 : _b.renderer;
        if (tooltipRenderer) {
            return (0, sparklineTooltip_1.toTooltipHtml)(tooltipRenderer({
                context: this.context,
                datum: seriesDatum,
                yValue: yValue,
                xValue: xValue,
            }), defaults);
        }
        return (0, sparklineTooltip_1.toTooltipHtml)(defaults);
    };
    AreaSparkline.className = 'AreaSparkline';
    return AreaSparkline;
}(sparkline_1.Sparkline));
exports.AreaSparkline = AreaSparkline;

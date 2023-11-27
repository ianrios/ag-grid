import { _Scale, _Scene, _Util } from 'ag-charts-community';
import { Sparkline, ZINDICIES } from '../sparkline.mjs';
import { toTooltipHtml } from '../tooltip/sparklineTooltip.mjs';
import { getMarker } from '../marker/markerFactory.mjs';
import { getLineDash } from '../../util/lineDash.mjs';
const { extent } = _Util;
const { BandScale } = _Scale;
class SparklineMarker {
    constructor() {
        this.enabled = true;
        this.shape = 'circle';
        this.size = 0;
        this.fill = 'rgb(124, 181, 236)';
        this.stroke = 'rgb(124, 181, 236)';
        this.strokeWidth = 1;
        this.formatter = undefined;
    }
}
class SparklineLine {
    constructor() {
        this.stroke = 'rgb(124, 181, 236)';
        this.strokeWidth = 1;
    }
}
class SparklineCrosshairs {
    constructor() {
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
}
export class AreaSparkline extends Sparkline {
    constructor() {
        super();
        this.fill = 'rgba(124, 181, 236, 0.25)';
        this.strokePath = new _Scene.Path();
        this.fillPath = new _Scene.Path();
        this.xCrosshairLine = new _Scene.Line();
        this.yCrosshairLine = new _Scene.Line();
        this.areaSparklineGroup = new _Scene.Group();
        this.xAxisLine = new _Scene.Line();
        this.markers = new _Scene.Group();
        this.markerSelection = _Scene.Selection.select(this.markers, () => this.markerFactory());
        this.markerSelectionData = [];
        this.marker = new SparklineMarker();
        this.line = new SparklineLine();
        this.crosshairs = new SparklineCrosshairs();
        this.rootGroup.append(this.areaSparklineGroup);
        this.xAxisLine.zIndex = ZINDICIES.AXIS_LINE_ZINDEX;
        this.fillPath.zIndex = ZINDICIES.SERIES_FILL_ZINDEX;
        this.strokePath.zIndex = ZINDICIES.SERIES_STROKE_ZINDEX;
        this.xCrosshairLine.zIndex = ZINDICIES.CROSSHAIR_ZINDEX;
        this.yCrosshairLine.zIndex = ZINDICIES.CROSSHAIR_ZINDEX;
        this.markers.zIndex = ZINDICIES.SERIES_MARKERS_ZINDEX;
        this.areaSparklineGroup.append([
            this.fillPath,
            this.xAxisLine,
            this.strokePath,
            this.xCrosshairLine,
            this.yCrosshairLine,
            this.markers,
        ]);
    }
    markerFactory() {
        const { shape } = this.marker;
        const MarkerShape = getMarker(shape);
        return new MarkerShape();
    }
    getNodeData() {
        return this.markerSelectionData;
    }
    update() {
        const data = this.generateNodeData();
        if (!data) {
            return;
        }
        const { nodeData, fillData, strokeData } = data;
        this.markerSelectionData = nodeData;
        this.updateSelection(nodeData);
        this.updateNodes();
        this.updateStroke(strokeData);
        this.updateFill(fillData);
    }
    updateYScaleDomain() {
        const { yData, yScale } = this;
        const yMinMax = extent(yData);
        let yMin = 0;
        let yMax = 1;
        if (yMinMax !== undefined) {
            yMin = this.min = yMinMax[0];
            yMax = this.max = yMinMax[1];
        }
        // if yMin is positive, set yMin to 0
        yMin = yMin < 0 ? yMin : 0;
        // if yMax is negative, set yMax to 0
        yMax = yMax < 0 ? 0 : yMax;
        yScale.domain = [yMin, yMax];
    }
    generateNodeData() {
        const { data, yData, xData, xScale, yScale } = this;
        if (!data) {
            return;
        }
        const continuous = !(xScale instanceof BandScale);
        const offsetX = !continuous ? xScale.bandwidth / 2 : 0;
        const n = yData.length;
        const nodeData = [];
        const fillData = [];
        const strokeData = [];
        let firstValidX;
        let lastValidX;
        let previousX;
        let nextX;
        const yZero = yScale.convert(0);
        for (let i = 0; i < n; i++) {
            const yDatum = yData[i];
            const xDatum = xData[i];
            const x = xScale.convert(continuous ? xScale.toDomain(xDatum) : xDatum) + offsetX;
            const y = yDatum === undefined ? NaN : yScale.convert(yDatum);
            // if this iteration is not the last, set nextX using the next value in the data array
            if (i + 1 < n) {
                nextX = xScale.convert(continuous ? xScale.toDomain(xData[i + 1]) : xData[i + 1]) + offsetX;
            }
            // set stroke data regardless of missing/ undefined values. Undefined values will be handled in the updateStroke() method
            strokeData.push({
                seriesDatum: { x: xDatum, y: yDatum },
                point: { x, y },
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
                    point: { x, y },
                });
                // set node data only if yDatum is not undefined. These values are used in the updateSelection() method to update markers
                nodeData.push({
                    seriesDatum: { x: xDatum, y: yDatum },
                    point: { x, y },
                });
                firstValidX = firstValidX !== undefined ? firstValidX : x;
                lastValidX = x;
            }
            previousX = x;
        }
        // phantom points for creating closed area
        fillData.push({ seriesDatum: undefined, point: { x: lastValidX, y: yZero } }, { seriesDatum: undefined, point: { x: firstValidX, y: yZero } });
        return { nodeData, fillData, strokeData };
    }
    updateAxisLine() {
        const { xScale, yScale, axis, xAxisLine } = this;
        xAxisLine.x1 = xScale.range[0];
        xAxisLine.x2 = xScale.range[1];
        xAxisLine.y1 = xAxisLine.y2 = 0;
        xAxisLine.stroke = axis.stroke;
        xAxisLine.strokeWidth = axis.strokeWidth;
        const yZero = yScale.convert(0);
        xAxisLine.translationY = yZero;
    }
    updateSelection(selectionData) {
        this.markerSelection.update(selectionData);
    }
    updateNodes() {
        const { highlightedDatum, highlightStyle, marker } = this;
        const { size: highlightSize, fill: highlightFill, stroke: highlightStroke, strokeWidth: highlightStrokeWidth, } = highlightStyle;
        const markerFormatter = marker.formatter;
        this.markerSelection.each((node, datum, index) => {
            const { point, seriesDatum } = datum;
            if (!point) {
                return;
            }
            const highlighted = datum === highlightedDatum;
            const markerFill = highlighted && highlightFill !== undefined ? highlightFill : marker.fill;
            const markerStroke = highlighted && highlightStroke !== undefined ? highlightStroke : marker.stroke;
            const markerStrokeWidth = highlighted && highlightStrokeWidth !== undefined ? highlightStrokeWidth : marker.strokeWidth;
            const markerSize = highlighted && highlightSize !== undefined ? highlightSize : marker.size;
            let markerFormat;
            if (markerFormatter) {
                const first = index === 0;
                const last = index === this.markerSelectionData.length - 1;
                const min = seriesDatum.y === this.min;
                const max = seriesDatum.y === this.max;
                markerFormat = markerFormatter({
                    datum,
                    xValue: seriesDatum.x,
                    yValue: seriesDatum.y,
                    min,
                    max,
                    first,
                    last,
                    fill: markerFill,
                    stroke: markerStroke,
                    strokeWidth: markerStrokeWidth,
                    size: markerSize,
                    highlighted,
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
    }
    updateStroke(strokeData) {
        const { strokePath, yData, line } = this;
        if (yData.length < 2) {
            return;
        }
        const path = strokePath.path;
        const n = strokeData.length;
        let moveTo = true;
        path.clear();
        for (let i = 0; i < n; i++) {
            const { point, seriesDatum } = strokeData[i];
            const x = point.x;
            const y = point.y;
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
    }
    updateFill(areaData) {
        const { fillPath, yData, fill } = this;
        const path = fillPath.path;
        const n = areaData.length;
        path.clear();
        if (yData.length < 2) {
            return;
        }
        for (let i = 0; i < n; i++) {
            const { point } = areaData[i];
            const x = point.x;
            const y = point.y;
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
    }
    updateXCrosshairLine() {
        var _a;
        const { yScale, xCrosshairLine, highlightedDatum, crosshairs: { xLine }, } = this;
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
        const { lineDash } = xLine;
        xCrosshairLine.lineDash = Array.isArray(lineDash)
            ? lineDash
            : getLineDash(xCrosshairLine.lineCap, xLine.lineDash);
        xCrosshairLine.translationX = highlightedDatum.point.x;
    }
    updateYCrosshairLine() {
        var _a;
        const { xScale, yCrosshairLine, highlightedDatum, crosshairs: { yLine }, } = this;
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
        const { lineDash } = yLine;
        yCrosshairLine.lineDash = Array.isArray(lineDash)
            ? lineDash
            : getLineDash(yCrosshairLine.lineCap, yLine.lineDash);
        yCrosshairLine.translationY = highlightedDatum.point.y;
    }
    getTooltipHtml(datum) {
        var _a, _b;
        const { dataType } = this;
        const { seriesDatum } = datum;
        const yValue = seriesDatum.y;
        const xValue = seriesDatum.x;
        const content = this.formatNumericDatum(yValue);
        const title = dataType === 'array' || dataType === 'object' ? this.formatDatum(xValue) : undefined;
        const defaults = {
            content,
            title,
        };
        const tooltipRenderer = (_b = (_a = this.processedOptions) === null || _a === void 0 ? void 0 : _a.tooltip) === null || _b === void 0 ? void 0 : _b.renderer;
        if (tooltipRenderer) {
            return toTooltipHtml(tooltipRenderer({
                context: this.context,
                datum: seriesDatum,
                yValue,
                xValue,
            }), defaults);
        }
        return toTooltipHtml(defaults);
    }
}
AreaSparkline.className = 'AreaSparkline';

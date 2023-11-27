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
export class LineSparkline extends Sparkline {
    constructor() {
        super();
        this.linePath = new _Scene.Path();
        this.xCrosshairLine = new _Scene.Line();
        this.yCrosshairLine = new _Scene.Line();
        this.lineSparklineGroup = new _Scene.Group();
        this.markers = new _Scene.Group();
        this.markerSelection = _Scene.Selection.select(this.markers, () => this.markerFactory());
        this.markerSelectionData = [];
        this.marker = new SparklineMarker();
        this.line = new SparklineLine();
        this.crosshairs = new SparklineCrosshairs();
        this.rootGroup.append(this.lineSparklineGroup);
        this.linePath.zIndex = ZINDICIES.SERIES_STROKE_ZINDEX;
        this.xCrosshairLine.zIndex = ZINDICIES.CROSSHAIR_ZINDEX;
        this.yCrosshairLine.zIndex = ZINDICIES.CROSSHAIR_ZINDEX;
        this.markers.zIndex = ZINDICIES.SERIES_MARKERS_ZINDEX;
        this.lineSparklineGroup.append([this.linePath, this.xCrosshairLine, this.yCrosshairLine, this.markers]);
    }
    getNodeData() {
        return this.markerSelectionData;
    }
    markerFactory() {
        const { shape } = this.marker;
        const MarkerShape = getMarker(shape);
        return new MarkerShape();
    }
    /**
     * If marker shape is changed, this method should be called to remove the previous marker nodes selection.
     */
    onMarkerShapeChange() {
        this.markerSelection = this.markerSelection.clear();
        this.scheduleLayout();
    }
    update() {
        const nodeData = this.generateNodeData();
        if (!nodeData) {
            return;
        }
        this.markerSelectionData = nodeData;
        this.updateSelection(nodeData);
        this.updateNodes();
        this.updateLine();
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
        if (yMin === yMax) {
            // if all values in the data are the same, yMin and yMax will be equal, need to adjust the domain with some padding
            const padding = Math.abs(yMin * 0.01);
            yMin -= padding;
            yMax += padding;
        }
        yScale.domain = [yMin, yMax];
    }
    generateNodeData() {
        const { data, yData, xData, xScale, yScale } = this;
        if (!data) {
            return;
        }
        const continuous = !(xScale instanceof BandScale);
        const offsetX = !continuous ? xScale.bandwidth / 2 : 0;
        const nodeData = [];
        for (let i = 0; i < yData.length; i++) {
            const yDatum = yData[i];
            const xDatum = xData[i];
            if (yDatum == undefined) {
                continue;
            }
            const x = xScale.convert(continuous ? xScale.toDomain(xDatum) : xDatum) + offsetX;
            const y = yDatum === undefined ? NaN : yScale.convert(yDatum);
            nodeData.push({
                seriesDatum: { x: xDatum, y: yDatum },
                point: { x, y },
            });
        }
        return nodeData;
    }
    updateSelection(selectionData) {
        this.markerSelection.update(selectionData);
    }
    updateNodes() {
        const { highlightedDatum, highlightStyle, marker } = this;
        const { size: highlightSize, fill: highlightFill, stroke: highlightStroke, strokeWidth: highlightStrokeWidth, } = highlightStyle;
        const markerFormatter = marker.formatter;
        this.markerSelection.each((node, datum, index) => {
            const highlighted = datum === highlightedDatum;
            const markerFill = highlighted && highlightFill !== undefined ? highlightFill : marker.fill;
            const markerStroke = highlighted && highlightStroke !== undefined ? highlightStroke : marker.stroke;
            const markerStrokeWidth = highlighted && highlightStrokeWidth !== undefined ? highlightStrokeWidth : marker.strokeWidth;
            const markerSize = highlighted && highlightSize !== undefined ? highlightSize : marker.size;
            let markerFormat;
            const { seriesDatum, point } = datum;
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
    updateLine() {
        const { linePath, yData, xData, xScale, yScale, line } = this;
        if (yData.length < 2) {
            return;
        }
        const continuous = !(xScale instanceof BandScale);
        const path = linePath.path;
        const n = yData.length;
        const offsetX = !continuous ? xScale.bandwidth / 2 : 0;
        let moveTo = true;
        path.clear();
        for (let i = 0; i < n; i++) {
            const xDatum = xData[i];
            const yDatum = yData[i];
            const x = xScale.convert(continuous ? xScale.toDomain(xDatum) : xDatum) + offsetX;
            const y = yDatum === undefined ? NaN : yScale.convert(yDatum);
            if (yDatum == undefined) {
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
        linePath.fill = undefined;
        linePath.stroke = line.stroke;
        linePath.strokeWidth = line.strokeWidth;
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
LineSparkline.className = 'LineSparkline';

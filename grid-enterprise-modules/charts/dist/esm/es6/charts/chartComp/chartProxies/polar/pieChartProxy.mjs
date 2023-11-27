import { ChartProxy } from '../chartProxy.mjs';
import { AgCharts, } from 'ag-charts-community';
import { changeOpacity } from '../../utils/color.mjs';
import { deepMerge } from '../../utils/object.mjs';
export class PieChartProxy extends ChartProxy {
    constructor(params) {
        super(params);
    }
    update(params) {
        const { data, category } = params;
        const options = Object.assign(Object.assign({}, this.getCommonChartOptions(params.updatedOverrides)), { data: this.crossFiltering ? this.getCrossFilterData(params) : this.transformData(data, category.id), series: this.getSeries(params) });
        AgCharts.update(this.getChartRef(), options);
    }
    getSeries(params) {
        const numFields = params.fields.length;
        const offset = {
            currentOffset: 0,
            offsetAmount: numFields > 1 ? 20 : 40
        };
        const series = this.getFields(params).map((f) => {
            var _a;
            // options shared by 'pie' and 'doughnut' charts
            const options = {
                type: this.standaloneChartType,
                angleKey: f.colId,
                angleName: f.displayName,
                sectorLabelKey: f.colId,
                legendItemKey: params.category.id,
                calloutLabelName: params.category.name,
                calloutLabelKey: params.category.id,
            };
            if (this.chartType === 'doughnut') {
                const { outerRadiusOffset, innerRadiusOffset } = PieChartProxy.calculateOffsets(offset);
                const title = f.displayName ? {
                    title: { text: f.displayName, showInLegend: numFields > 1 },
                } : undefined;
                // augment shared options with 'doughnut' specific options
                return Object.assign(Object.assign(Object.assign(Object.assign({}, options), { outerRadiusOffset,
                    innerRadiusOffset }), title), { calloutLine: {
                        colors: (_a = this.getChartPalette()) === null || _a === void 0 ? void 0 : _a.strokes,
                    } });
            }
            return options;
        });
        return this.crossFiltering ? this.extractCrossFilterSeries(series) : series;
    }
    getCrossFilterData(params) {
        const colId = params.fields[0].colId;
        const filteredOutColId = `${colId}-filtered-out`;
        return params.data.map(d => {
            const total = d[colId] + d[filteredOutColId];
            d[`${colId}-total`] = total;
            d[filteredOutColId] = 1; // normalise to 1
            d[colId] = d[colId] / total; // fraction of 1
            return d;
        });
    }
    extractCrossFilterSeries(series) {
        const palette = this.getChartPalette();
        const primaryOptions = (seriesOptions) => {
            return Object.assign(Object.assign({}, seriesOptions), { calloutLabel: { enabled: false }, highlightStyle: { item: { fill: undefined } }, radiusKey: seriesOptions.angleKey, angleKey: seriesOptions.angleKey + '-total', radiusMin: 0, radiusMax: 1, listeners: {
                    nodeClick: this.crossFilterCallback,
                } });
        };
        const filteredOutOptions = (seriesOptions, angleKey) => {
            var _a, _b;
            return Object.assign(Object.assign({}, deepMerge({}, primaryOpts)), { radiusKey: angleKey + '-filtered-out', fills: changeOpacity((_a = seriesOptions.fills) !== null && _a !== void 0 ? _a : palette.fills, 0.3), strokes: changeOpacity((_b = seriesOptions.strokes) !== null && _b !== void 0 ? _b : palette.strokes, 0.3), showInLegend: false });
        };
        // currently, only single 'doughnut' cross-filter series are supported
        const primarySeries = series[0];
        // update primary series
        const angleKey = primarySeries.angleKey;
        const primaryOpts = primaryOptions(primarySeries);
        return [
            filteredOutOptions(primarySeries, angleKey),
            primaryOpts,
        ];
    }
    static calculateOffsets(offset) {
        const outerRadiusOffset = offset.currentOffset;
        offset.currentOffset -= offset.offsetAmount;
        const innerRadiusOffset = offset.currentOffset;
        offset.currentOffset -= offset.offsetAmount;
        return { outerRadiusOffset, innerRadiusOffset };
    }
    getFields(params) {
        return this.chartType === 'pie' ? params.fields.slice(0, 1) : params.fields;
    }
    crossFilteringReset() {
        // not required in pie charts
    }
}

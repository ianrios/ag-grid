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
exports.MiniStackedColumn = void 0;
var miniChartWithAxes_1 = require("../miniChartWithAxes");
var miniChartHelpers_1 = require("../miniChartHelpers");
var MiniStackedColumn = /** @class */ (function (_super) {
    __extends(MiniStackedColumn, _super);
    function MiniStackedColumn(container, fills, strokes, data, yScaleDomain, tooltipName) {
        if (data === void 0) { data = MiniStackedColumn.data; }
        if (yScaleDomain === void 0) { yScaleDomain = [0, 16]; }
        if (tooltipName === void 0) { tooltipName = "stackedColumnTooltip"; }
        var _this = _super.call(this, container, tooltipName) || this;
        var _a = _this, root = _a.root, size = _a.size, padding = _a.padding;
        _this.stackedColumns = (0, miniChartHelpers_1.createColumnRects)({
            stacked: true,
            root: root,
            data: data,
            size: size,
            padding: padding,
            xScaleDomain: [0, 1, 2],
            yScaleDomain: yScaleDomain,
            xScalePadding: 0.3,
        });
        root.append([].concat.apply([], _this.stackedColumns));
        _this.updateColors(fills, strokes);
        return _this;
    }
    MiniStackedColumn.prototype.updateColors = function (fills, strokes) {
        this.stackedColumns.forEach(function (series, i) {
            return series.forEach(function (column) {
                column.fill = fills[i];
                column.stroke = strokes[i];
            });
        });
    };
    MiniStackedColumn.chartType = 'stackedColumn';
    MiniStackedColumn.data = [
        [8, 12, 16],
        [6, 9, 12],
        [2, 3, 4]
    ];
    return MiniStackedColumn;
}(miniChartWithAxes_1.MiniChartWithAxes));
exports.MiniStackedColumn = MiniStackedColumn;

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
exports.MiniLine = void 0;
var miniChartWithAxes_1 = require("../miniChartWithAxes");
var miniChartHelpers_1 = require("../miniChartHelpers");
var MiniLine = /** @class */ (function (_super) {
    __extends(MiniLine, _super);
    function MiniLine(container, fills, strokes) {
        var _this = _super.call(this, container, "lineTooltip") || this;
        _this.data = [
            [9, 7, 8, 5, 6],
            [5, 6, 3, 4, 1],
            [1, 3, 4, 8, 7]
        ];
        _this.lines = (0, miniChartHelpers_1.createLinePaths)(_this.root, _this.data, _this.size, _this.padding);
        _this.updateColors(fills, strokes);
        return _this;
    }
    MiniLine.prototype.updateColors = function (fills, strokes) {
        this.lines.forEach(function (line, i) {
            line.stroke = fills[i];
        });
    };
    MiniLine.chartType = 'line';
    return MiniLine;
}(miniChartWithAxes_1.MiniChartWithAxes));
exports.MiniLine = MiniLine;

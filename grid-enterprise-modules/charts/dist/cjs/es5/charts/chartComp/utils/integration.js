"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deproxy = void 0;
// import { _Scene, AgCartesianAxisType, AgChartInstance } from "ag-charts-enterprise";
function deproxy(chartOrProxy) {
    if (chartOrProxy.chart != null) {
        return chartOrProxy.chart;
    }
    return chartOrProxy;
}
exports.deproxy = deproxy;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RowGroupingModule = void 0;
var core_1 = require("@ag-grid-community/core");
var core_2 = require("@ag-grid-enterprise/core");
var aggregationStage_1 = require("./rowGrouping/aggregationStage");
var groupStage_1 = require("./rowGrouping/groupStage");
var pivotColDefService_1 = require("./rowGrouping/pivotColDefService");
var pivotStage_1 = require("./rowGrouping/pivotStage");
var aggFuncService_1 = require("./rowGrouping/aggFuncService");
var gridHeaderDropZones_1 = require("./rowGrouping/columnDropZones/gridHeaderDropZones");
var filterAggregatesStage_1 = require("./rowGrouping/filterAggregatesStage");
var version_1 = require("./version");
var groupFilter_1 = require("./rowGrouping/groupFilter/groupFilter");
var groupFloatingFilter_1 = require("./rowGrouping/groupFilter/groupFloatingFilter");
exports.RowGroupingModule = {
    version: version_1.VERSION,
    moduleName: core_1.ModuleNames.RowGroupingModule,
    beans: [aggregationStage_1.AggregationStage, filterAggregatesStage_1.FilterAggregatesStage, groupStage_1.GroupStage, pivotColDefService_1.PivotColDefService, pivotStage_1.PivotStage, aggFuncService_1.AggFuncService],
    agStackComponents: [
        { componentName: 'AgGridHeaderDropZones', componentClass: gridHeaderDropZones_1.GridHeaderDropZones }
    ],
    userComponents: [
        { componentName: 'agGroupColumnFilter', componentClass: groupFilter_1.GroupFilter },
        { componentName: 'agGroupColumnFloatingFilter', componentClass: groupFloatingFilter_1.GroupFloatingFilterComp },
    ],
    dependantModules: [
        core_2.EnterpriseCoreModule
    ]
};

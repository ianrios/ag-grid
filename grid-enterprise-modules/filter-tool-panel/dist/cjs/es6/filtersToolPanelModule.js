"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FiltersToolPanelModule = void 0;
const core_1 = require("@ag-grid-community/core");
const core_2 = require("@ag-grid-enterprise/core");
const filtersToolPanelHeaderPanel_1 = require("./filterToolPanel/filtersToolPanelHeaderPanel");
const filtersToolPanelListPanel_1 = require("./filterToolPanel/filtersToolPanelListPanel");
const filtersToolPanel_1 = require("./filterToolPanel/filtersToolPanel");
const side_bar_1 = require("@ag-grid-enterprise/side-bar");
const version_1 = require("./version");
exports.FiltersToolPanelModule = {
    version: version_1.VERSION,
    moduleName: core_1.ModuleNames.FiltersToolPanelModule,
    beans: [],
    agStackComponents: [
        { componentName: 'AgFiltersToolPanelHeader', componentClass: filtersToolPanelHeaderPanel_1.FiltersToolPanelHeaderPanel },
        { componentName: 'AgFiltersToolPanelList', componentClass: filtersToolPanelListPanel_1.FiltersToolPanelListPanel }
    ],
    userComponents: [
        { componentName: 'agFiltersToolPanel', componentClass: filtersToolPanel_1.FiltersToolPanel },
    ],
    dependantModules: [
        side_bar_1.SideBarModule,
        core_2.EnterpriseCoreModule
    ]
};

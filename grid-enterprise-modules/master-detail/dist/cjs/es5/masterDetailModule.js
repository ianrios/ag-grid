"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterDetailModule = void 0;
var core_1 = require("@ag-grid-community/core");
var core_2 = require("@ag-grid-enterprise/core");
var detailCellRenderer_1 = require("./masterDetail/detailCellRenderer");
var detailCellRendererCtrl_1 = require("./masterDetail/detailCellRendererCtrl");
var version_1 = require("./version");
exports.MasterDetailModule = {
    version: version_1.VERSION,
    moduleName: core_1.ModuleNames.MasterDetailModule,
    beans: [],
    userComponents: [
        { componentName: 'agDetailCellRenderer', componentClass: detailCellRenderer_1.DetailCellRenderer }
    ],
    controllers: [
        { controllerName: 'detailCellRenderer', controllerClass: detailCellRendererCtrl_1.DetailCellRendererCtrl }
    ],
    dependantModules: [
        core_2.EnterpriseCoreModule
    ]
};

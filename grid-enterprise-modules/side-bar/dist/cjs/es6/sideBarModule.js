"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SideBarModule = void 0;
const core_1 = require("@ag-grid-community/core");
const core_2 = require("@ag-grid-enterprise/core");
const horizontalResizeComp_1 = require("./sideBar/horizontalResizeComp");
const sideBarComp_1 = require("./sideBar/sideBarComp");
const sideBarButtonsComp_1 = require("./sideBar/sideBarButtonsComp");
const toolPanelColDefService_1 = require("./sideBar/common/toolPanelColDefService");
const version_1 = require("./version");
const sideBarService_1 = require("./sideBar/sideBarService");
exports.SideBarModule = {
    version: version_1.VERSION,
    moduleName: core_1.ModuleNames.SideBarModule,
    beans: [toolPanelColDefService_1.ToolPanelColDefService, sideBarService_1.SideBarService],
    agStackComponents: [
        { componentName: 'AgHorizontalResize', componentClass: horizontalResizeComp_1.HorizontalResizeComp },
        { componentName: 'AgSideBar', componentClass: sideBarComp_1.SideBarComp },
        { componentName: 'AgSideBarButtons', componentClass: sideBarButtonsComp_1.SideBarButtonsComp },
    ],
    dependantModules: [
        core_2.EnterpriseCoreModule
    ]
};

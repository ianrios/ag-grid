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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridHeaderDropZones = void 0;
var core_1 = require("@ag-grid-community/core");
var rowGroupDropZonePanel_1 = require("./rowGroupDropZonePanel");
var pivotDropZonePanel_1 = require("./pivotDropZonePanel");
var GridHeaderDropZones = /** @class */ (function (_super) {
    __extends(GridHeaderDropZones, _super);
    function GridHeaderDropZones() {
        return _super.call(this) || this;
    }
    GridHeaderDropZones.prototype.postConstruct = function () {
        var _this = this;
        this.setGui(this.createNorthPanel());
        this.addManagedListener(this.eventService, core_1.Events.EVENT_COLUMN_ROW_GROUP_CHANGED, function () { return _this.onRowGroupChanged(); });
        this.addManagedListener(this.eventService, core_1.Events.EVENT_NEW_COLUMNS_LOADED, function () { return _this.onRowGroupChanged(); });
        this.addManagedPropertyListener('rowGroupPanelShow', function () { return _this.onRowGroupChanged(); });
        this.addManagedPropertyListener('pivotPanelShow', function () { return _this.onPivotPanelShow(); });
        this.onRowGroupChanged();
    };
    GridHeaderDropZones.prototype.createNorthPanel = function () {
        var _this = this;
        var topPanelGui = document.createElement('div');
        topPanelGui.classList.add('ag-column-drop-wrapper');
        core_1._.setAriaRole(topPanelGui, 'presentation');
        this.rowGroupComp = new rowGroupDropZonePanel_1.RowGroupDropZonePanel(true);
        this.createManagedBean(this.rowGroupComp);
        this.pivotComp = new pivotDropZonePanel_1.PivotDropZonePanel(true);
        this.createManagedBean(this.pivotComp);
        topPanelGui.appendChild(this.rowGroupComp.getGui());
        topPanelGui.appendChild(this.pivotComp.getGui());
        this.addManagedListener(this.rowGroupComp, core_1.Component.EVENT_DISPLAYED_CHANGED, function () { return _this.onDropPanelVisible(); });
        this.addManagedListener(this.pivotComp, core_1.Component.EVENT_DISPLAYED_CHANGED, function () { return _this.onDropPanelVisible(); });
        this.onDropPanelVisible();
        return topPanelGui;
    };
    GridHeaderDropZones.prototype.onDropPanelVisible = function () {
        var bothDisplayed = this.rowGroupComp.isDisplayed() && this.pivotComp.isDisplayed();
        this.rowGroupComp.addOrRemoveCssClass('ag-column-drop-horizontal-half-width', bothDisplayed);
        this.pivotComp.addOrRemoveCssClass('ag-column-drop-horizontal-half-width', bothDisplayed);
    };
    GridHeaderDropZones.prototype.onRowGroupChanged = function () {
        if (!this.rowGroupComp) {
            return;
        }
        var rowGroupPanelShow = this.gridOptionsService.get('rowGroupPanelShow');
        if (rowGroupPanelShow === 'always') {
            this.rowGroupComp.setDisplayed(true);
        }
        else if (rowGroupPanelShow === 'onlyWhenGrouping') {
            var grouping = !this.columnModel.isRowGroupEmpty();
            this.rowGroupComp.setDisplayed(grouping);
        }
        else {
            this.rowGroupComp.setDisplayed(false);
        }
    };
    GridHeaderDropZones.prototype.onPivotPanelShow = function () {
        if (!this.pivotComp) {
            return;
        }
        var pivotPanelShow = this.gridOptionsService.get('pivotPanelShow');
        if (pivotPanelShow === 'always') {
            this.pivotComp.setDisplayed(true);
        }
        else if (pivotPanelShow === 'onlyWhenPivoting') {
            var pivoting = this.columnModel.isPivotActive();
            this.pivotComp.setDisplayed(pivoting);
        }
        else {
            this.pivotComp.setDisplayed(false);
        }
    };
    __decorate([
        (0, core_1.Autowired)('columnModel')
    ], GridHeaderDropZones.prototype, "columnModel", void 0);
    __decorate([
        core_1.PostConstruct
    ], GridHeaderDropZones.prototype, "postConstruct", null);
    return GridHeaderDropZones;
}(core_1.Component));
exports.GridHeaderDropZones = GridHeaderDropZones;

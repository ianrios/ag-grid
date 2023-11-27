"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridHeaderDropZones = void 0;
const core_1 = require("@ag-grid-community/core");
const rowGroupDropZonePanel_1 = require("./rowGroupDropZonePanel");
const pivotDropZonePanel_1 = require("./pivotDropZonePanel");
class GridHeaderDropZones extends core_1.Component {
    constructor() {
        super();
    }
    postConstruct() {
        this.setGui(this.createNorthPanel());
        this.addManagedListener(this.eventService, core_1.Events.EVENT_COLUMN_ROW_GROUP_CHANGED, () => this.onRowGroupChanged());
        this.addManagedListener(this.eventService, core_1.Events.EVENT_NEW_COLUMNS_LOADED, () => this.onRowGroupChanged());
        this.addManagedPropertyListener('rowGroupPanelShow', () => this.onRowGroupChanged());
        this.addManagedPropertyListener('pivotPanelShow', () => this.onPivotPanelShow());
        this.onRowGroupChanged();
    }
    createNorthPanel() {
        const topPanelGui = document.createElement('div');
        topPanelGui.classList.add('ag-column-drop-wrapper');
        core_1._.setAriaRole(topPanelGui, 'presentation');
        this.rowGroupComp = new rowGroupDropZonePanel_1.RowGroupDropZonePanel(true);
        this.createManagedBean(this.rowGroupComp);
        this.pivotComp = new pivotDropZonePanel_1.PivotDropZonePanel(true);
        this.createManagedBean(this.pivotComp);
        topPanelGui.appendChild(this.rowGroupComp.getGui());
        topPanelGui.appendChild(this.pivotComp.getGui());
        this.addManagedListener(this.rowGroupComp, core_1.Component.EVENT_DISPLAYED_CHANGED, () => this.onDropPanelVisible());
        this.addManagedListener(this.pivotComp, core_1.Component.EVENT_DISPLAYED_CHANGED, () => this.onDropPanelVisible());
        this.onDropPanelVisible();
        return topPanelGui;
    }
    onDropPanelVisible() {
        const bothDisplayed = this.rowGroupComp.isDisplayed() && this.pivotComp.isDisplayed();
        this.rowGroupComp.addOrRemoveCssClass('ag-column-drop-horizontal-half-width', bothDisplayed);
        this.pivotComp.addOrRemoveCssClass('ag-column-drop-horizontal-half-width', bothDisplayed);
    }
    onRowGroupChanged() {
        if (!this.rowGroupComp) {
            return;
        }
        const rowGroupPanelShow = this.gridOptionsService.get('rowGroupPanelShow');
        if (rowGroupPanelShow === 'always') {
            this.rowGroupComp.setDisplayed(true);
        }
        else if (rowGroupPanelShow === 'onlyWhenGrouping') {
            const grouping = !this.columnModel.isRowGroupEmpty();
            this.rowGroupComp.setDisplayed(grouping);
        }
        else {
            this.rowGroupComp.setDisplayed(false);
        }
    }
    onPivotPanelShow() {
        if (!this.pivotComp) {
            return;
        }
        const pivotPanelShow = this.gridOptionsService.get('pivotPanelShow');
        if (pivotPanelShow === 'always') {
            this.pivotComp.setDisplayed(true);
        }
        else if (pivotPanelShow === 'onlyWhenPivoting') {
            const pivoting = this.columnModel.isPivotActive();
            this.pivotComp.setDisplayed(pivoting);
        }
        else {
            this.pivotComp.setDisplayed(false);
        }
    }
}
__decorate([
    (0, core_1.Autowired)('columnModel')
], GridHeaderDropZones.prototype, "columnModel", void 0);
__decorate([
    core_1.PostConstruct
], GridHeaderDropZones.prototype, "postConstruct", null);
exports.GridHeaderDropZones = GridHeaderDropZones;

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Autowired, Component, Events, PostConstruct, _ } from "@ag-grid-community/core";
import { RowGroupDropZonePanel } from "./rowGroupDropZonePanel.mjs";
import { PivotDropZonePanel } from "./pivotDropZonePanel.mjs";
export class GridHeaderDropZones extends Component {
    constructor() {
        super();
    }
    postConstruct() {
        this.setGui(this.createNorthPanel());
        this.addManagedListener(this.eventService, Events.EVENT_COLUMN_ROW_GROUP_CHANGED, () => this.onRowGroupChanged());
        this.addManagedListener(this.eventService, Events.EVENT_NEW_COLUMNS_LOADED, () => this.onRowGroupChanged());
        this.addManagedPropertyListener('rowGroupPanelShow', () => this.onRowGroupChanged());
        this.addManagedPropertyListener('pivotPanelShow', () => this.onPivotPanelShow());
        this.onRowGroupChanged();
    }
    createNorthPanel() {
        const topPanelGui = document.createElement('div');
        topPanelGui.classList.add('ag-column-drop-wrapper');
        _.setAriaRole(topPanelGui, 'presentation');
        this.rowGroupComp = new RowGroupDropZonePanel(true);
        this.createManagedBean(this.rowGroupComp);
        this.pivotComp = new PivotDropZonePanel(true);
        this.createManagedBean(this.pivotComp);
        topPanelGui.appendChild(this.rowGroupComp.getGui());
        topPanelGui.appendChild(this.pivotComp.getGui());
        this.addManagedListener(this.rowGroupComp, Component.EVENT_DISPLAYED_CHANGED, () => this.onDropPanelVisible());
        this.addManagedListener(this.pivotComp, Component.EVENT_DISPLAYED_CHANGED, () => this.onDropPanelVisible());
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
    Autowired('columnModel')
], GridHeaderDropZones.prototype, "columnModel", void 0);
__decorate([
    PostConstruct
], GridHeaderDropZones.prototype, "postConstruct", null);

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
import { Component, RefSelector, PositionableFeature } from "@ag-grid-community/core";
var PrimaryColsPanel = /** @class */ (function (_super) {
    __extends(PrimaryColsPanel, _super);
    function PrimaryColsPanel() {
        return _super.call(this, PrimaryColsPanel.TEMPLATE) || this;
    }
    // we allow dragging in the toolPanel, but not when this component appears in the column menu
    PrimaryColsPanel.prototype.init = function (allowDragging, params, eventType) {
        this.allowDragging = allowDragging;
        this.params = params;
        this.eventType = eventType;
        this.primaryColsHeaderPanel.init(this.params);
        var hideFilter = this.params.suppressColumnFilter;
        var hideSelect = this.params.suppressColumnSelectAll;
        var hideExpand = this.params.suppressColumnExpandAll;
        if (hideExpand && hideFilter && hideSelect) {
            this.primaryColsHeaderPanel.setDisplayed(false);
        }
        this.addManagedListener(this.primaryColsListPanel, 'groupExpanded', this.onGroupExpanded.bind(this));
        this.addManagedListener(this.primaryColsListPanel, 'selectionChanged', this.onSelectionChange.bind(this));
        this.primaryColsListPanel.init(this.params, this.allowDragging, this.eventType);
        this.addManagedListener(this.primaryColsHeaderPanel, 'expandAll', this.onExpandAll.bind(this));
        this.addManagedListener(this.primaryColsHeaderPanel, 'collapseAll', this.onCollapseAll.bind(this));
        this.addManagedListener(this.primaryColsHeaderPanel, 'selectAll', this.onSelectAll.bind(this));
        this.addManagedListener(this.primaryColsHeaderPanel, 'unselectAll', this.onUnselectAll.bind(this));
        this.addManagedListener(this.primaryColsHeaderPanel, 'filterChanged', this.onFilterChanged.bind(this));
        this.positionableFeature = new PositionableFeature(this.getGui(), { minHeight: 100 });
        this.createManagedBean(this.positionableFeature);
    };
    PrimaryColsPanel.prototype.toggleResizable = function (resizable) {
        this.positionableFeature.setResizable(resizable ? { bottom: true } : false);
    };
    PrimaryColsPanel.prototype.onExpandAll = function () {
        this.primaryColsListPanel.doSetExpandedAll(true);
    };
    PrimaryColsPanel.prototype.onCollapseAll = function () {
        this.primaryColsListPanel.doSetExpandedAll(false);
    };
    PrimaryColsPanel.prototype.expandGroups = function (groupIds) {
        this.primaryColsListPanel.setGroupsExpanded(true, groupIds);
    };
    PrimaryColsPanel.prototype.collapseGroups = function (groupIds) {
        this.primaryColsListPanel.setGroupsExpanded(false, groupIds);
    };
    PrimaryColsPanel.prototype.setColumnLayout = function (colDefs) {
        this.primaryColsListPanel.setColumnLayout(colDefs);
    };
    PrimaryColsPanel.prototype.onFilterChanged = function (event) {
        this.primaryColsListPanel.setFilterText(event.filterText);
    };
    PrimaryColsPanel.prototype.syncLayoutWithGrid = function () {
        this.primaryColsListPanel.onColumnsChanged();
    };
    PrimaryColsPanel.prototype.onSelectAll = function () {
        this.primaryColsListPanel.doSetSelectedAll(true);
    };
    PrimaryColsPanel.prototype.onUnselectAll = function () {
        this.primaryColsListPanel.doSetSelectedAll(false);
    };
    PrimaryColsPanel.prototype.onGroupExpanded = function (event) {
        this.primaryColsHeaderPanel.setExpandState(event.state);
        this.params.onStateUpdated();
    };
    PrimaryColsPanel.prototype.onSelectionChange = function (event) {
        this.primaryColsHeaderPanel.setSelectionState(event.state);
    };
    PrimaryColsPanel.prototype.getExpandedGroups = function () {
        return this.primaryColsListPanel.getExpandedGroups();
    };
    PrimaryColsPanel.TEMPLATE = "<div class=\"ag-column-select\">\n            <ag-primary-cols-header ref=\"primaryColsHeaderPanel\"></ag-primary-cols-header>\n            <ag-primary-cols-list ref=\"primaryColsListPanel\"></ag-primary-cols-list>\n        </div>";
    __decorate([
        RefSelector('primaryColsHeaderPanel')
    ], PrimaryColsPanel.prototype, "primaryColsHeaderPanel", void 0);
    __decorate([
        RefSelector('primaryColsListPanel')
    ], PrimaryColsPanel.prototype, "primaryColsListPanel", void 0);
    return PrimaryColsPanel;
}(Component));
export { PrimaryColsPanel };

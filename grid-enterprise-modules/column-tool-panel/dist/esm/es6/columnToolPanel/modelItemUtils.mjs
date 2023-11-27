var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Events, Bean, Autowired, _ } from "@ag-grid-community/core";
let ModelItemUtils = class ModelItemUtils {
    selectAllChildren(colTree, selectAllChecked, eventType) {
        const cols = this.extractAllLeafColumns(colTree);
        this.setAllColumns(cols, selectAllChecked, eventType);
    }
    setColumn(col, selectAllChecked, eventType) {
        this.setAllColumns([col], selectAllChecked, eventType);
    }
    setAllColumns(cols, selectAllChecked, eventType) {
        if (this.columnModel.isPivotMode()) {
            this.setAllPivot(cols, selectAllChecked, eventType);
        }
        else {
            this.setAllVisible(cols, selectAllChecked, eventType);
        }
    }
    extractAllLeafColumns(allItems) {
        const res = [];
        const recursiveFunc = (items) => {
            items.forEach(item => {
                if (!item.isPassesFilter()) {
                    return;
                }
                if (item.isGroup()) {
                    recursiveFunc(item.getChildren());
                }
                else {
                    res.push(item.getColumn());
                }
            });
        };
        recursiveFunc(allItems);
        return res;
    }
    setAllVisible(columns, visible, eventType) {
        const colStateItems = [];
        columns.forEach(col => {
            if (col.getColDef().lockVisible) {
                return;
            }
            if (col.isVisible() != visible) {
                colStateItems.push({
                    colId: col.getId(),
                    hide: !visible
                });
            }
        });
        if (colStateItems.length > 0) {
            this.columnModel.applyColumnState({ state: colStateItems }, eventType);
        }
    }
    setAllPivot(columns, value, eventType) {
        if (this.gridOptionsService.get('functionsPassive')) {
            this.setAllPivotPassive(columns, value);
        }
        else {
            this.setAllPivotActive(columns, value, eventType);
        }
    }
    setAllPivotPassive(columns, value) {
        const copyOfPivotColumns = this.columnModel.getPivotColumns().slice();
        const copyOfValueColumns = this.columnModel.getValueColumns().slice();
        const copyOfRowGroupColumns = this.columnModel.getRowGroupColumns().slice();
        let pivotChanged = false;
        let valueChanged = false;
        let rowGroupChanged = false;
        const turnOnAction = (col) => {
            // don't change any column that's already got a function active
            if (col.isAnyFunctionActive()) {
                return;
            }
            if (col.isAllowValue()) {
                copyOfValueColumns.push(col);
                valueChanged = true;
            }
            else if (col.isAllowRowGroup()) {
                copyOfRowGroupColumns.push(col);
                pivotChanged = true;
            }
            else if (col.isAllowPivot()) {
                copyOfPivotColumns.push(col);
                rowGroupChanged = true;
            }
        };
        const turnOffAction = (col) => {
            if (!col.isAnyFunctionActive()) {
                return;
            }
            if (copyOfPivotColumns.indexOf(col) >= 0) {
                _.removeFromArray(copyOfPivotColumns, col);
                pivotChanged = true;
            }
            if (copyOfValueColumns.indexOf(col) >= 0) {
                _.removeFromArray(copyOfValueColumns, col);
                valueChanged = true;
            }
            if (copyOfRowGroupColumns.indexOf(col) >= 0) {
                _.removeFromArray(copyOfRowGroupColumns, col);
                rowGroupChanged = true;
            }
        };
        const action = value ? turnOnAction : turnOffAction;
        columns.forEach(action);
        if (pivotChanged) {
            const event = {
                type: Events.EVENT_COLUMN_PIVOT_CHANGE_REQUEST,
                columns: copyOfPivotColumns
            };
            this.eventService.dispatchEvent(event);
        }
        if (rowGroupChanged) {
            const event = {
                type: Events.EVENT_COLUMN_ROW_GROUP_CHANGE_REQUEST,
                columns: copyOfRowGroupColumns
            };
            this.eventService.dispatchEvent(event);
        }
        if (valueChanged) {
            const event = {
                type: Events.EVENT_COLUMN_VALUE_CHANGE_REQUEST,
                columns: copyOfRowGroupColumns
            };
            this.eventService.dispatchEvent(event);
        }
    }
    setAllPivotActive(columns, value, eventType) {
        const colStateItems = [];
        const turnOnAction = (col) => {
            // don't change any column that's already got a function active
            if (col.isAnyFunctionActive()) {
                return;
            }
            if (col.isAllowValue()) {
                const aggFunc = typeof col.getAggFunc() === 'string'
                    ? col.getAggFunc()
                    : this.aggFuncService.getDefaultAggFunc(col);
                colStateItems.push({
                    colId: col.getId(),
                    aggFunc: aggFunc
                });
            }
            else if (col.isAllowRowGroup()) {
                colStateItems.push({
                    colId: col.getId(),
                    rowGroup: true
                });
            }
            else if (col.isAllowPivot()) {
                colStateItems.push({
                    colId: col.getId(),
                    pivot: true
                });
            }
        };
        const turnOffAction = (col) => {
            const isActive = col.isPivotActive() || col.isRowGroupActive() || col.isValueActive();
            if (isActive) {
                colStateItems.push({
                    colId: col.getId(),
                    pivot: false,
                    rowGroup: false,
                    aggFunc: null
                });
            }
        };
        const action = value ? turnOnAction : turnOffAction;
        columns.forEach(action);
        if (colStateItems.length > 0) {
            this.columnModel.applyColumnState({ state: colStateItems }, eventType);
        }
    }
    updateColumns(params) {
        const { columns, visibleState, pivotState, eventType } = params;
        const state = columns.map(column => {
            const colId = column.getColId();
            if (this.columnModel.isPivotMode()) {
                const pivotStateForColumn = pivotState === null || pivotState === void 0 ? void 0 : pivotState[colId];
                return {
                    colId,
                    pivot: pivotStateForColumn === null || pivotStateForColumn === void 0 ? void 0 : pivotStateForColumn.pivot,
                    rowGroup: pivotStateForColumn === null || pivotStateForColumn === void 0 ? void 0 : pivotStateForColumn.rowGroup,
                    aggFunc: pivotStateForColumn === null || pivotStateForColumn === void 0 ? void 0 : pivotStateForColumn.aggFunc,
                };
            }
            else {
                return {
                    colId,
                    hide: !(visibleState === null || visibleState === void 0 ? void 0 : visibleState[colId])
                };
            }
        });
        this.columnModel.applyColumnState({ state }, eventType);
    }
    createPivotState(column) {
        return {
            pivot: column.isPivotActive(),
            rowGroup: column.isRowGroupActive(),
            aggFunc: column.isValueActive() ? column.getAggFunc() : undefined
        };
    }
};
__decorate([
    Autowired('aggFuncService')
], ModelItemUtils.prototype, "aggFuncService", void 0);
__decorate([
    Autowired('columnModel')
], ModelItemUtils.prototype, "columnModel", void 0);
__decorate([
    Autowired('gridOptionsService')
], ModelItemUtils.prototype, "gridOptionsService", void 0);
__decorate([
    Autowired('eventService')
], ModelItemUtils.prototype, "eventService", void 0);
ModelItemUtils = __decorate([
    Bean('modelItemUtils')
], ModelItemUtils);
export { ModelItemUtils };

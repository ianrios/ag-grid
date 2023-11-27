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
exports.PrimaryColsListPanel = void 0;
var core_1 = require("@ag-grid-community/core");
var primaryColsListPanelItemDragFeature_1 = require("./primaryColsListPanelItemDragFeature");
var toolPanelColumnGroupComp_1 = require("./toolPanelColumnGroupComp");
var toolPanelColumnComp_1 = require("./toolPanelColumnComp");
var primaryColsHeaderPanel_1 = require("./primaryColsHeaderPanel");
var columnModelItem_1 = require("./columnModelItem");
var UIColumnModel = /** @class */ (function () {
    function UIColumnModel(items) {
        this.items = items;
    }
    UIColumnModel.prototype.getRowCount = function () {
        return this.items.length;
    };
    UIColumnModel.prototype.getRow = function (index) {
        return this.items[index];
    };
    return UIColumnModel;
}());
var PRIMARY_COLS_LIST_PANEL_CLASS = 'ag-column-select-list';
var PrimaryColsListPanel = /** @class */ (function (_super) {
    __extends(PrimaryColsListPanel, _super);
    function PrimaryColsListPanel() {
        var _this = _super.call(this, PrimaryColsListPanel.TEMPLATE) || this;
        _this.destroyColumnItemFuncs = [];
        _this.hasLoadedInitialState = false;
        _this.isInitialState = false;
        return _this;
    }
    PrimaryColsListPanel.prototype.destroyColumnTree = function () {
        this.allColsTree = [];
        this.destroyColumnItemFuncs.forEach(function (f) { return f(); });
        this.destroyColumnItemFuncs = [];
    };
    PrimaryColsListPanel.prototype.init = function (params, allowDragging, eventType) {
        var _this = this;
        this.params = params;
        this.allowDragging = allowDragging;
        this.eventType = eventType;
        if (!this.params.suppressSyncLayoutWithGrid) {
            this.addManagedListener(this.eventService, core_1.Events.EVENT_COLUMN_MOVED, this.onColumnsChanged.bind(this));
        }
        this.addManagedListener(this.eventService, core_1.Events.EVENT_NEW_COLUMNS_LOADED, this.onColumnsChanged.bind(this));
        var eventsImpactingCheckedState = [
            core_1.Events.EVENT_COLUMN_PIVOT_CHANGED,
            core_1.Events.EVENT_COLUMN_PIVOT_MODE_CHANGED,
            core_1.Events.EVENT_COLUMN_ROW_GROUP_CHANGED,
            core_1.Events.EVENT_COLUMN_VALUE_CHANGED,
            core_1.Events.EVENT_COLUMN_VISIBLE,
            core_1.Events.EVENT_NEW_COLUMNS_LOADED
        ];
        eventsImpactingCheckedState.forEach(function (event) {
            // update header select all checkbox with current selection state
            _this.addManagedListener(_this.eventService, event, _this.fireSelectionChangedEvent.bind(_this));
        });
        this.expandGroupsByDefault = !this.params.contractColumnSelection;
        this.virtualList = this.createManagedBean(new core_1.VirtualList({
            cssIdentifier: 'column-select',
            ariaRole: 'tree',
        }));
        this.appendChild(this.virtualList.getGui());
        var ariaEl = this.virtualList.getAriaElement();
        core_1._.setAriaLive(ariaEl, 'assertive');
        core_1._.setAriaAtomic(ariaEl, false);
        core_1._.setAriaRelevant(ariaEl, 'text');
        this.virtualList.setComponentCreator(function (item, listItemElement) {
            core_1._.setAriaLevel(listItemElement, (item.getDept() + 1));
            return _this.createComponentFromItem(item, listItemElement);
        });
        if (this.columnModel.isReady()) {
            this.onColumnsChanged();
        }
        if (this.params.suppressColumnMove) {
            return;
        }
        this.colsListPanelItemDragFeature = this.createManagedBean(new primaryColsListPanelItemDragFeature_1.PrimaryColsListPanelItemDragFeature(this, this.virtualList));
    };
    PrimaryColsListPanel.prototype.createComponentFromItem = function (item, listItemElement) {
        if (item.isGroup()) {
            var renderedGroup = new toolPanelColumnGroupComp_1.ToolPanelColumnGroupComp(item, this.allowDragging, this.eventType, listItemElement);
            this.getContext().createBean(renderedGroup);
            return renderedGroup;
        }
        var columnComp = new toolPanelColumnComp_1.ToolPanelColumnComp(item, this.allowDragging, this.groupsExist, listItemElement);
        this.getContext().createBean(columnComp);
        return columnComp;
    };
    PrimaryColsListPanel.prototype.onColumnsChanged = function () {
        if (!this.hasLoadedInitialState) {
            this.hasLoadedInitialState = true;
            this.isInitialState = !!this.params.initialState;
        }
        var expandedStates = this.getExpandedStates();
        var pivotModeActive = this.columnModel.isPivotMode();
        var shouldSyncColumnLayoutWithGrid = !this.params.suppressSyncLayoutWithGrid && !pivotModeActive;
        if (shouldSyncColumnLayoutWithGrid) {
            this.buildTreeFromWhatGridIsDisplaying();
        }
        else {
            this.buildTreeFromProvidedColumnDefs();
        }
        this.setExpandedStates(expandedStates);
        this.markFilteredColumns();
        this.flattenAndFilterModel();
        this.isInitialState = false;
    };
    PrimaryColsListPanel.prototype.getDisplayedColsList = function () {
        return this.displayedColsList;
    };
    PrimaryColsListPanel.prototype.getExpandedStates = function () {
        var res = {};
        if (this.isInitialState) {
            var expandedGroupIds = this.params.initialState.expandedGroupIds;
            expandedGroupIds.forEach(function (id) {
                res[id] = true;
            });
            return res;
        }
        if (!this.allColsTree) {
            return {};
        }
        this.forEachItem(function (item) {
            if (!item.isGroup()) {
                return;
            }
            var colGroup = item.getColumnGroup();
            if (colGroup) { // group should always exist, this is defensive
                res[colGroup.getId()] = item.isExpanded();
            }
        });
        return res;
    };
    PrimaryColsListPanel.prototype.setExpandedStates = function (states) {
        if (!this.allColsTree) {
            return;
        }
        var isInitialState = this.isInitialState;
        this.forEachItem(function (item) {
            if (!item.isGroup()) {
                return;
            }
            var colGroup = item.getColumnGroup();
            if (colGroup) { // group should always exist, this is defensive
                var expanded = states[colGroup.getId()];
                var groupExistedLastTime = expanded != null;
                if (groupExistedLastTime || isInitialState) {
                    item.setExpanded(!!expanded);
                }
            }
        });
    };
    PrimaryColsListPanel.prototype.buildTreeFromWhatGridIsDisplaying = function () {
        this.colDefService.syncLayoutWithGrid(this.setColumnLayout.bind(this));
    };
    PrimaryColsListPanel.prototype.setColumnLayout = function (colDefs) {
        var columnTree = this.colDefService.createColumnTree(colDefs);
        this.buildListModel(columnTree);
        // using col defs to check if groups exist as it could be a custom layout
        this.groupsExist = colDefs.some(function (colDef) {
            return colDef && typeof colDef.children !== 'undefined';
        });
        this.markFilteredColumns();
        this.flattenAndFilterModel();
    };
    PrimaryColsListPanel.prototype.buildTreeFromProvidedColumnDefs = function () {
        // add column / group comps to tool panel
        this.buildListModel(this.columnModel.getPrimaryColumnTree());
        this.groupsExist = this.columnModel.isPrimaryColumnGroupsPresent();
    };
    PrimaryColsListPanel.prototype.buildListModel = function (columnTree) {
        var _this = this;
        var columnExpandedListener = this.onColumnExpanded.bind(this);
        var addListeners = function (item) {
            item.addEventListener(columnModelItem_1.ColumnModelItem.EVENT_EXPANDED_CHANGED, columnExpandedListener);
            var removeFunc = item.removeEventListener.bind(item, columnModelItem_1.ColumnModelItem.EVENT_EXPANDED_CHANGED, columnExpandedListener);
            _this.destroyColumnItemFuncs.push(removeFunc);
        };
        var recursivelyBuild = function (tree, dept, parentList) {
            tree.forEach(function (child) {
                if (child instanceof core_1.ProvidedColumnGroup) {
                    createGroupItem(child, dept, parentList);
                }
                else {
                    createColumnItem(child, dept, parentList);
                }
            });
        };
        var createGroupItem = function (columnGroup, dept, parentList) {
            var columnGroupDef = columnGroup.getColGroupDef();
            var skipThisGroup = columnGroupDef && columnGroupDef.suppressColumnsToolPanel;
            if (skipThisGroup) {
                return;
            }
            if (columnGroup.isPadding()) {
                recursivelyBuild(columnGroup.getChildren(), dept, parentList);
                return;
            }
            var displayName = _this.columnModel.getDisplayNameForProvidedColumnGroup(null, columnGroup, 'columnToolPanel');
            var item = new columnModelItem_1.ColumnModelItem(displayName, columnGroup, dept, true, _this.expandGroupsByDefault);
            parentList.push(item);
            addListeners(item);
            recursivelyBuild(columnGroup.getChildren(), dept + 1, item.getChildren());
        };
        var createColumnItem = function (column, dept, parentList) {
            var skipThisColumn = column.getColDef() && column.getColDef().suppressColumnsToolPanel;
            if (skipThisColumn) {
                return;
            }
            var displayName = _this.columnModel.getDisplayNameForColumn(column, 'columnToolPanel');
            parentList.push(new columnModelItem_1.ColumnModelItem(displayName, column, dept));
        };
        this.destroyColumnTree();
        recursivelyBuild(columnTree, 0, this.allColsTree);
    };
    PrimaryColsListPanel.prototype.onColumnExpanded = function () {
        this.flattenAndFilterModel();
    };
    PrimaryColsListPanel.prototype.flattenAndFilterModel = function () {
        var _this = this;
        this.displayedColsList = [];
        var recursiveFunc = function (item) {
            if (!item.isPassesFilter()) {
                return;
            }
            _this.displayedColsList.push(item);
            if (item.isGroup() && item.isExpanded()) {
                item.getChildren().forEach(recursiveFunc);
            }
        };
        this.allColsTree.forEach(recursiveFunc);
        this.virtualList.setModel(new UIColumnModel(this.displayedColsList));
        var focusedRow = this.virtualList.getLastFocusedRow();
        this.virtualList.refresh();
        if (focusedRow != null) {
            this.focusRowIfAlive(focusedRow);
        }
        this.notifyListeners();
        this.refreshAriaLabel();
    };
    PrimaryColsListPanel.prototype.refreshAriaLabel = function () {
        var translate = this.localeService.getLocaleTextFunc();
        var columnListName = translate('ariaColumnPanelList', 'Column List');
        var localeColumns = translate('columns', 'Columns');
        var items = this.displayedColsList.length;
        core_1._.setAriaLabel(this.virtualList.getAriaElement(), "".concat(columnListName, " ").concat(items, " ").concat(localeColumns));
    };
    PrimaryColsListPanel.prototype.focusRowIfAlive = function (rowIndex) {
        var _this = this;
        window.setTimeout(function () {
            if (_this.isAlive()) {
                _this.virtualList.focusRow(rowIndex);
            }
        }, 0);
    };
    PrimaryColsListPanel.prototype.forEachItem = function (callback) {
        var recursiveFunc = function (items) {
            items.forEach(function (item) {
                callback(item);
                if (item.isGroup()) {
                    recursiveFunc(item.getChildren());
                }
            });
        };
        recursiveFunc(this.allColsTree);
    };
    PrimaryColsListPanel.prototype.doSetExpandedAll = function (value) {
        this.forEachItem(function (item) {
            if (item.isGroup()) {
                item.setExpanded(value);
            }
        });
    };
    PrimaryColsListPanel.prototype.setGroupsExpanded = function (expand, groupIds) {
        if (!groupIds) {
            this.doSetExpandedAll(expand);
            return;
        }
        var expandedGroupIds = [];
        this.forEachItem(function (item) {
            if (!item.isGroup()) {
                return;
            }
            var groupId = item.getColumnGroup().getId();
            if (groupIds.indexOf(groupId) >= 0) {
                item.setExpanded(expand);
                expandedGroupIds.push(groupId);
            }
        });
        var unrecognisedGroupIds = groupIds.filter(function (groupId) { return !core_1._.includes(expandedGroupIds, groupId); });
        if (unrecognisedGroupIds.length > 0) {
            console.warn('AG Grid: unable to find group(s) for supplied groupIds:', unrecognisedGroupIds);
        }
    };
    PrimaryColsListPanel.prototype.getExpandState = function () {
        var expandedCount = 0;
        var notExpandedCount = 0;
        this.forEachItem(function (item) {
            if (!item.isGroup()) {
                return;
            }
            if (item.isExpanded()) {
                expandedCount++;
            }
            else {
                notExpandedCount++;
            }
        });
        if (expandedCount > 0 && notExpandedCount > 0) {
            return primaryColsHeaderPanel_1.ExpandState.INDETERMINATE;
        }
        if (notExpandedCount > 0) {
            return primaryColsHeaderPanel_1.ExpandState.COLLAPSED;
        }
        return primaryColsHeaderPanel_1.ExpandState.EXPANDED;
    };
    PrimaryColsListPanel.prototype.doSetSelectedAll = function (selectAllChecked) {
        this.modelItemUtils.selectAllChildren(this.allColsTree, selectAllChecked, this.eventType);
    };
    PrimaryColsListPanel.prototype.getSelectionState = function () {
        var checkedCount = 0;
        var uncheckedCount = 0;
        var pivotMode = this.columnModel.isPivotMode();
        this.forEachItem(function (item) {
            if (item.isGroup()) {
                return;
            }
            if (!item.isPassesFilter()) {
                return;
            }
            var column = item.getColumn();
            var colDef = column.getColDef();
            var checked;
            if (pivotMode) {
                var noPivotModeOptionsAllowed = !column.isAllowPivot() && !column.isAllowRowGroup() && !column.isAllowValue();
                if (noPivotModeOptionsAllowed) {
                    return;
                }
                checked = column.isValueActive() || column.isPivotActive() || column.isRowGroupActive();
            }
            else {
                if (colDef.lockVisible) {
                    return;
                }
                checked = column.isVisible();
            }
            checked ? checkedCount++ : uncheckedCount++;
        });
        if (checkedCount > 0 && uncheckedCount > 0) {
            return undefined;
        }
        return !(checkedCount === 0 || uncheckedCount > 0);
    };
    PrimaryColsListPanel.prototype.setFilterText = function (filterText) {
        this.filterText = core_1._.exists(filterText) ? filterText.toLowerCase() : null;
        this.markFilteredColumns();
        this.flattenAndFilterModel();
    };
    PrimaryColsListPanel.prototype.markFilteredColumns = function () {
        var _this = this;
        var passesFilter = function (item) {
            if (!core_1._.exists(_this.filterText)) {
                return true;
            }
            var displayName = item.getDisplayName();
            return displayName == null || displayName.toLowerCase().indexOf(_this.filterText) !== -1;
        };
        var recursivelyCheckFilter = function (item, parentPasses) {
            var atLeastOneChildPassed = false;
            if (item.isGroup()) {
                var groupPasses_1 = passesFilter(item);
                item.getChildren().forEach(function (child) {
                    var childPasses = recursivelyCheckFilter(child, groupPasses_1 || parentPasses);
                    if (childPasses) {
                        atLeastOneChildPassed = childPasses;
                    }
                });
            }
            var filterPasses = (parentPasses || atLeastOneChildPassed) ? true : passesFilter(item);
            item.setPassesFilter(filterPasses);
            return filterPasses;
        };
        this.allColsTree.forEach(function (item) { return recursivelyCheckFilter(item, false); });
    };
    PrimaryColsListPanel.prototype.notifyListeners = function () {
        this.fireGroupExpandedEvent();
        this.fireSelectionChangedEvent();
    };
    PrimaryColsListPanel.prototype.fireGroupExpandedEvent = function () {
        var expandState = this.getExpandState();
        this.dispatchEvent({ type: 'groupExpanded', state: expandState });
    };
    PrimaryColsListPanel.prototype.fireSelectionChangedEvent = function () {
        if (!this.allColsTree) {
            return;
        }
        var selectionState = this.getSelectionState();
        this.dispatchEvent({ type: 'selectionChanged', state: selectionState });
    };
    PrimaryColsListPanel.prototype.getExpandedGroups = function () {
        var expandedGroupIds = [];
        if (!this.allColsTree) {
            return expandedGroupIds;
        }
        this.forEachItem(function (item) {
            if (item.isGroup() && item.isExpanded()) {
                expandedGroupIds.push(item.getColumnGroup().getId());
            }
        });
        return expandedGroupIds;
    };
    PrimaryColsListPanel.TEMPLATE = "<div class=\"".concat(PRIMARY_COLS_LIST_PANEL_CLASS, "\" role=\"presentation\"></div>");
    __decorate([
        (0, core_1.Autowired)('columnModel')
    ], PrimaryColsListPanel.prototype, "columnModel", void 0);
    __decorate([
        (0, core_1.Autowired)('toolPanelColDefService')
    ], PrimaryColsListPanel.prototype, "colDefService", void 0);
    __decorate([
        (0, core_1.Autowired)('modelItemUtils')
    ], PrimaryColsListPanel.prototype, "modelItemUtils", void 0);
    __decorate([
        core_1.PreDestroy
    ], PrimaryColsListPanel.prototype, "destroyColumnTree", null);
    return PrimaryColsListPanel;
}(core_1.Component));
exports.PrimaryColsListPanel = PrimaryColsListPanel;

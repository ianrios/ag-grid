/**
          * @ag-grid-enterprise/row-grouping - Advanced Data Grid / Data Table supporting Javascript / Typescript / React / Angular / Vue * @version v31.0.0
          * @link https://www.ag-grid.com/
          * @license Commercial
          */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@ag-grid-community/core');
var core$1 = require('@ag-grid-enterprise/core');

var __extends$d = (undefined && undefined.__extends) || (function () {
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
var __decorate$d = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AggregationStage = /** @class */ (function (_super) {
    __extends$d(AggregationStage, _super);
    function AggregationStage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // it's possible to recompute the aggregate without doing the other parts
    // + api.refreshClientSideRowModel('aggregate')
    AggregationStage.prototype.execute = function (params) {
        // if changed path is active, it means we came from a) change detection or b) transaction update.
        // for both of these, if no value columns are present, it means there is nothing to aggregate now
        // and there is no cleanup to be done (as value columns don't change between transactions or change
        // detections). if no value columns and no changed path, means we have to go through all nodes in
        // case we need to clean up agg data from before.
        var noValueColumns = core._.missingOrEmpty(this.columnModel.getValueColumns());
        var noUserAgg = !this.gridOptionsService.getCallback('getGroupRowAgg');
        var changedPathActive = params.changedPath && params.changedPath.isActive();
        if (noValueColumns && noUserAgg && changedPathActive) {
            return;
        }
        var aggDetails = this.createAggDetails(params);
        this.recursivelyCreateAggData(aggDetails);
    };
    AggregationStage.prototype.createAggDetails = function (params) {
        var pivotActive = this.columnModel.isPivotActive();
        var measureColumns = this.columnModel.getValueColumns();
        var pivotColumns = pivotActive ? this.columnModel.getPivotColumns() : [];
        var aggDetails = {
            alwaysAggregateAtRootLevel: this.gridOptionsService.get('alwaysAggregateAtRootLevel'),
            groupIncludeTotalFooter: this.gridOptionsService.get('groupIncludeTotalFooter'),
            changedPath: params.changedPath,
            valueColumns: measureColumns,
            pivotColumns: pivotColumns,
            filteredOnly: !this.isSuppressAggFilteredOnly(),
            userAggFunc: this.gridOptionsService.getCallback('getGroupRowAgg'),
        };
        return aggDetails;
    };
    AggregationStage.prototype.isSuppressAggFilteredOnly = function () {
        var isGroupAggFiltering = this.gridOptionsService.getGroupAggFiltering() !== undefined;
        return isGroupAggFiltering || this.gridOptionsService.get('suppressAggFilteredOnly');
    };
    AggregationStage.prototype.recursivelyCreateAggData = function (aggDetails) {
        var _this = this;
        var callback = function (rowNode) {
            var hasNoChildren = !rowNode.hasChildren();
            if (hasNoChildren) {
                // this check is needed for TreeData, in case the node is no longer a child,
                // but it was a child previously.
                if (rowNode.aggData) {
                    rowNode.setAggData(null);
                }
                // never agg data for leaf nodes
                return;
            }
            //Optionally enable the aggregation at the root Node
            var isRootNode = rowNode.level === -1;
            // if total footer is displayed, the value is in use
            if (isRootNode && !aggDetails.groupIncludeTotalFooter) {
                var notPivoting = !_this.columnModel.isPivotMode();
                if (!aggDetails.alwaysAggregateAtRootLevel && notPivoting) {
                    rowNode.setAggData(null);
                    return;
                }
            }
            _this.aggregateRowNode(rowNode, aggDetails);
        };
        aggDetails.changedPath.forEachChangedNodeDepthFirst(callback, true);
    };
    AggregationStage.prototype.aggregateRowNode = function (rowNode, aggDetails) {
        var measureColumnsMissing = aggDetails.valueColumns.length === 0;
        var pivotColumnsMissing = aggDetails.pivotColumns.length === 0;
        var aggResult;
        if (aggDetails.userAggFunc) {
            aggResult = aggDetails.userAggFunc({ nodes: rowNode.childrenAfterFilter });
        }
        else if (measureColumnsMissing) {
            aggResult = null;
        }
        else if (pivotColumnsMissing) {
            aggResult = this.aggregateRowNodeUsingValuesOnly(rowNode, aggDetails);
        }
        else {
            aggResult = this.aggregateRowNodeUsingValuesAndPivot(rowNode);
        }
        rowNode.setAggData(aggResult);
        // if we are grouping, then it's possible there is a sibling footer
        // to the group, so update the data here also if there is one
        if (rowNode.sibling) {
            rowNode.sibling.setAggData(aggResult);
        }
    };
    AggregationStage.prototype.aggregateRowNodeUsingValuesAndPivot = function (rowNode) {
        var _this = this;
        var _a;
        var result = {};
        var secondaryColumns = (_a = this.columnModel.getSecondaryColumns()) !== null && _a !== void 0 ? _a : [];
        secondaryColumns.forEach(function (secondaryCol) {
            var _a = secondaryCol.getColDef(), pivotValueColumn = _a.pivotValueColumn, pivotTotalColumnIds = _a.pivotTotalColumnIds, colId = _a.colId, pivotKeys = _a.pivotKeys;
            if (core._.exists(pivotTotalColumnIds)) {
                return;
            }
            var keys = pivotKeys !== null && pivotKeys !== void 0 ? pivotKeys : [];
            var values;
            if (rowNode.leafGroup) {
                // lowest level group, get the values from the mapped set
                values = _this.getValuesFromMappedSet(rowNode.childrenMapped, keys, pivotValueColumn);
            }
            else {
                // value columns and pivot columns, non-leaf group
                values = _this.getValuesPivotNonLeaf(rowNode, colId);
            }
            result[colId] = _this.aggregateValues(values, pivotValueColumn.getAggFunc(), pivotValueColumn, rowNode, secondaryCol);
        });
        secondaryColumns.forEach(function (secondaryCol) {
            var _a = secondaryCol.getColDef(), pivotValueColumn = _a.pivotValueColumn, pivotTotalColumnIds = _a.pivotTotalColumnIds, colId = _a.colId;
            if (!core._.exists(pivotTotalColumnIds)) {
                return;
            }
            var aggResults = [];
            //retrieve results for colIds associated with this pivot total column
            if (!pivotTotalColumnIds || !pivotTotalColumnIds.length) {
                return;
            }
            pivotTotalColumnIds.forEach(function (currentColId) {
                aggResults.push(result[currentColId]);
            });
            result[colId] = _this.aggregateValues(aggResults, pivotValueColumn.getAggFunc(), pivotValueColumn, rowNode, secondaryCol);
        });
        return result;
    };
    AggregationStage.prototype.aggregateRowNodeUsingValuesOnly = function (rowNode, aggDetails) {
        var _this = this;
        var result = {};
        var changedValueColumns = aggDetails.changedPath.isActive() ?
            aggDetails.changedPath.getValueColumnsForNode(rowNode, aggDetails.valueColumns)
            : aggDetails.valueColumns;
        var notChangedValueColumns = aggDetails.changedPath.isActive() ?
            aggDetails.changedPath.getNotValueColumnsForNode(rowNode, aggDetails.valueColumns)
            : null;
        var values2d = this.getValuesNormal(rowNode, changedValueColumns, aggDetails.filteredOnly);
        var oldValues = rowNode.aggData;
        changedValueColumns.forEach(function (valueColumn, index) {
            result[valueColumn.getId()] = _this.aggregateValues(values2d[index], valueColumn.getAggFunc(), valueColumn, rowNode);
        });
        if (notChangedValueColumns && oldValues) {
            notChangedValueColumns.forEach(function (valueColumn) {
                result[valueColumn.getId()] = oldValues[valueColumn.getId()];
            });
        }
        return result;
    };
    AggregationStage.prototype.getValuesPivotNonLeaf = function (rowNode, colId) {
        var values = [];
        rowNode.childrenAfterFilter.forEach(function (node) {
            var value = node.aggData[colId];
            values.push(value);
        });
        return values;
    };
    AggregationStage.prototype.getValuesFromMappedSet = function (mappedSet, keys, valueColumn) {
        var _this = this;
        var mapPointer = mappedSet;
        keys.forEach(function (key) { return (mapPointer = mapPointer ? mapPointer[key] : null); });
        if (!mapPointer) {
            return [];
        }
        var values = [];
        mapPointer.forEach(function (rowNode) {
            var value = _this.valueService.getValue(valueColumn, rowNode);
            values.push(value);
        });
        return values;
    };
    AggregationStage.prototype.getValuesNormal = function (rowNode, valueColumns, filteredOnly) {
        // create 2d array, of all values for all valueColumns
        var values = [];
        valueColumns.forEach(function () { return values.push([]); });
        var valueColumnCount = valueColumns.length;
        var nodeList = filteredOnly ? rowNode.childrenAfterFilter : rowNode.childrenAfterGroup;
        var rowCount = nodeList.length;
        for (var i = 0; i < rowCount; i++) {
            var childNode = nodeList[i];
            for (var j = 0; j < valueColumnCount; j++) {
                var valueColumn = valueColumns[j];
                // if the row is a group, then it will only have an agg result value,
                // which means valueGetter is never used.
                var value = this.valueService.getValue(valueColumn, childNode);
                values[j].push(value);
            }
        }
        return values;
    };
    AggregationStage.prototype.aggregateValues = function (values, aggFuncOrString, column, rowNode, pivotResultColumn) {
        var aggFunc = typeof aggFuncOrString === 'string' ?
            this.aggFuncService.getAggFunc(aggFuncOrString) :
            aggFuncOrString;
        if (typeof aggFunc !== 'function') {
            console.error("AG Grid: unrecognised aggregation function ".concat(aggFuncOrString));
            return null;
        }
        var aggFuncAny = aggFunc;
        var params = {
            values: values,
            column: column,
            colDef: column ? column.getColDef() : undefined,
            pivotResultColumn: pivotResultColumn,
            rowNode: rowNode,
            data: rowNode ? rowNode.data : undefined,
            api: this.gridOptionsService.api,
            columnApi: this.gridOptionsService.columnApi,
            context: this.gridOptionsService.context,
        }; // the "as any" is needed to allow the deprecation warning messages
        return aggFuncAny(params);
    };
    __decorate$d([
        core.Autowired('columnModel')
    ], AggregationStage.prototype, "columnModel", void 0);
    __decorate$d([
        core.Autowired('valueService')
    ], AggregationStage.prototype, "valueService", void 0);
    __decorate$d([
        core.Autowired('aggFuncService')
    ], AggregationStage.prototype, "aggFuncService", void 0);
    AggregationStage = __decorate$d([
        core.Bean('aggregationStage')
    ], AggregationStage);
    return AggregationStage;
}(core.BeanStub));

var BatchRemover = /** @class */ (function () {
    function BatchRemover() {
        this.allSets = {};
        this.allParents = [];
    }
    BatchRemover.prototype.removeFromChildrenAfterGroup = function (parent, child) {
        var set = this.getSet(parent);
        set.removeFromChildrenAfterGroup[child.id] = true;
    };
    BatchRemover.prototype.isRemoveFromAllLeafChildren = function (parent, child) {
        var set = this.getSet(parent);
        return !!set.removeFromAllLeafChildren[child.id];
    };
    BatchRemover.prototype.preventRemoveFromAllLeafChildren = function (parent, child) {
        var set = this.getSet(parent);
        delete set.removeFromAllLeafChildren[child.id];
    };
    BatchRemover.prototype.removeFromAllLeafChildren = function (parent, child) {
        var set = this.getSet(parent);
        set.removeFromAllLeafChildren[child.id] = true;
    };
    BatchRemover.prototype.getSet = function (parent) {
        if (!this.allSets[parent.id]) {
            this.allSets[parent.id] = {
                removeFromAllLeafChildren: {},
                removeFromChildrenAfterGroup: {}
            };
            this.allParents.push(parent);
        }
        return this.allSets[parent.id];
    };
    BatchRemover.prototype.getAllParents = function () {
        return this.allParents;
    };
    BatchRemover.prototype.flush = function () {
        var _this = this;
        this.allParents.forEach(function (parent) {
            var nodeDetails = _this.allSets[parent.id];
            parent.childrenAfterGroup = parent.childrenAfterGroup.filter(function (child) { return !nodeDetails.removeFromChildrenAfterGroup[child.id]; });
            parent.allLeafChildren = parent.allLeafChildren.filter(function (child) { return !nodeDetails.removeFromAllLeafChildren[child.id]; });
            parent.updateHasChildren();
            if (parent.sibling) {
                parent.sibling.childrenAfterGroup = parent.childrenAfterGroup;
                parent.sibling.allLeafChildren = parent.allLeafChildren;
            }
        });
        this.allSets = {};
        this.allParents.length = 0;
    };
    return BatchRemover;
}());

var __extends$c = (undefined && undefined.__extends) || (function () {
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
var __decorate$c = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __read$2 = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray$2 = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var GroupStage = /** @class */ (function (_super) {
    __extends$c(GroupStage, _super);
    function GroupStage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GroupStage.prototype.execute = function (params) {
        var details = this.createGroupingDetails(params);
        if (details.transactions) {
            this.handleTransaction(details);
        }
        else {
            var afterColsChanged = params.afterColumnsChanged === true;
            this.shotgunResetEverything(details, afterColsChanged);
        }
        if (!details.usingTreeData) {
            // we don't do group sorting for tree data
            this.positionLeafsAndGroups(params.changedPath);
            this.orderGroups(details);
        }
        this.selectableService.updateSelectableAfterGrouping();
    };
    GroupStage.prototype.positionLeafsAndGroups = function (changedPath) {
        changedPath.forEachChangedNodeDepthFirst(function (group) {
            if (group.childrenAfterGroup) {
                var leafNodes_1 = [];
                var groupNodes_1 = [];
                var unbalancedNode_1;
                group.childrenAfterGroup.forEach(function (row) {
                    var _a;
                    if (!((_a = row.childrenAfterGroup) === null || _a === void 0 ? void 0 : _a.length)) {
                        leafNodes_1.push(row);
                    }
                    else {
                        if (row.key === '' && !unbalancedNode_1) {
                            unbalancedNode_1 = row;
                        }
                        else {
                            groupNodes_1.push(row);
                        }
                    }
                });
                if (unbalancedNode_1) {
                    groupNodes_1.push(unbalancedNode_1);
                }
                group.childrenAfterGroup = __spreadArray$2(__spreadArray$2([], __read$2(leafNodes_1), false), __read$2(groupNodes_1), false);
            }
        }, false);
    };
    GroupStage.prototype.createGroupingDetails = function (params) {
        var _a;
        var rowNode = params.rowNode, changedPath = params.changedPath, rowNodeTransactions = params.rowNodeTransactions, rowNodeOrder = params.rowNodeOrder;
        var usingTreeData = this.gridOptionsService.get('treeData');
        var groupedCols = usingTreeData ? null : this.columnModel.getRowGroupColumns();
        var details = {
            // someone complained that the parent attribute was causing some change detection
            // to break in an angular add-on.  Taking the parent out breaks a cyclic dependency, hence this flag got introduced.
            includeParents: !this.gridOptionsService.get('suppressParentsInRowNodes'),
            expandByDefault: this.gridOptionsService.get('groupDefaultExpanded'),
            groupedCols: groupedCols,
            rootNode: rowNode,
            pivotMode: this.columnModel.isPivotMode(),
            groupedColCount: usingTreeData || !groupedCols ? 0 : groupedCols.length,
            rowNodeOrder: rowNodeOrder,
            transactions: rowNodeTransactions,
            // if no transaction, then it's shotgun, changed path would be 'not active' at this point anyway
            changedPath: changedPath,
            groupAllowUnbalanced: this.gridOptionsService.get('groupAllowUnbalanced'),
            isGroupOpenByDefault: this.gridOptionsService.getCallback('isGroupOpenByDefault'),
            initialGroupOrderComparator: this.gridOptionsService.getCallback('initialGroupOrderComparator'),
            usingTreeData: usingTreeData,
            suppressGroupMaintainValueType: this.gridOptionsService.get('suppressGroupMaintainValueType'),
            getDataPath: usingTreeData ? this.gridOptionsService.get('getDataPath') : undefined,
            keyCreators: (_a = groupedCols === null || groupedCols === void 0 ? void 0 : groupedCols.map(function (column) { return column.getColDef().keyCreator; })) !== null && _a !== void 0 ? _a : []
        };
        return details;
    };
    GroupStage.prototype.handleTransaction = function (details) {
        var _this = this;
        details.transactions.forEach(function (tran) {
            // we don't allow batch remover for tree data as tree data uses Filler Nodes,
            // and creating/deleting filler nodes needs to be done alongside the node deleting
            // and moving. if we want to Batch Remover working with tree data then would need
            // to consider how Filler Nodes would be impacted (it's possible that it can be easily
            // modified to work, however for now I don't have the brain energy to work it all out).
            var batchRemover = !details.usingTreeData ? new BatchRemover() : undefined;
            // the order here of [add, remove, update] needs to be the same as in ClientSideNodeManager,
            // as the order is important when a record with the same id is added and removed in the same
            // transaction.
            if (core._.existsAndNotEmpty(tran.remove)) {
                _this.removeNodes(tran.remove, details, batchRemover);
            }
            if (core._.existsAndNotEmpty(tran.update)) {
                _this.moveNodesInWrongPath(tran.update, details, batchRemover);
            }
            if (core._.existsAndNotEmpty(tran.add)) {
                _this.insertNodes(tran.add, details, false);
            }
            // must flush here, and not allow another transaction to be applied,
            // as each transaction must finish leaving the data in a consistent state.
            if (batchRemover) {
                var parentsWithChildrenRemoved = batchRemover.getAllParents().slice();
                batchRemover.flush();
                _this.removeEmptyGroups(parentsWithChildrenRemoved, details);
            }
        });
        if (details.rowNodeOrder) {
            this.sortChildren(details);
        }
    };
    // this is used when doing delta updates, eg Redux, keeps nodes in right order
    GroupStage.prototype.sortChildren = function (details) {
        details.changedPath.forEachChangedNodeDepthFirst(function (node) {
            if (!node.childrenAfterGroup) {
                return;
            }
            var didSort = core._.sortRowNodesByOrder(node.childrenAfterGroup, details.rowNodeOrder);
            if (didSort) {
                details.changedPath.addParentNode(node);
            }
        }, false, true);
    };
    GroupStage.prototype.orderGroups = function (details) {
        var comparator = details.initialGroupOrderComparator;
        if (core._.exists(comparator)) {
            recursiveSort(details.rootNode);
        }
        function recursiveSort(rowNode) {
            var doSort = core._.exists(rowNode.childrenAfterGroup) &&
                // we only want to sort groups, so we do not sort leafs (a leaf group has leafs as children)
                !rowNode.leafGroup;
            if (doSort) {
                rowNode.childrenAfterGroup.sort(function (nodeA, nodeB) { return comparator({ nodeA: nodeA, nodeB: nodeB }); });
                rowNode.childrenAfterGroup.forEach(function (childNode) { return recursiveSort(childNode); });
            }
        }
    };
    GroupStage.prototype.getExistingPathForNode = function (node, details) {
        var res = [];
        // when doing tree data, the node is part of the path,
        // but when doing grid grouping, the node is not part of the path so we start with the parent.
        var pointer = details.usingTreeData ? node : node.parent;
        while (pointer && pointer !== details.rootNode) {
            res.push({
                key: pointer.key,
                rowGroupColumn: pointer.rowGroupColumn,
                field: pointer.field
            });
            pointer = pointer.parent;
        }
        res.reverse();
        return res;
    };
    GroupStage.prototype.moveNodesInWrongPath = function (childNodes, details, batchRemover) {
        var _this = this;
        childNodes.forEach(function (childNode) {
            // we add node, even if parent has not changed, as the data could have
            // changed, hence aggregations will be wrong
            if (details.changedPath.isActive()) {
                details.changedPath.addParentNode(childNode.parent);
            }
            var infoToKeyMapper = function (item) { return item.key; };
            var oldPath = _this.getExistingPathForNode(childNode, details).map(infoToKeyMapper);
            var newPath = _this.getGroupInfo(childNode, details).map(infoToKeyMapper);
            var nodeInCorrectPath = core._.areEqual(oldPath, newPath);
            if (!nodeInCorrectPath) {
                _this.moveNode(childNode, details, batchRemover);
            }
        });
    };
    GroupStage.prototype.moveNode = function (childNode, details, batchRemover) {
        this.removeNodesInStages([childNode], details, batchRemover);
        this.insertOneNode(childNode, details, true, batchRemover);
        // hack - if we didn't do this, then renaming a tree item (ie changing rowNode.key) wouldn't get
        // refreshed into the gui.
        // this is needed to kick off the event that rowComp listens to for refresh. this in turn
        // then will get each cell in the row to refresh - which is what we need as we don't know which
        // columns will be displaying the rowNode.key info.
        childNode.setData(childNode.data);
        // we add both old and new parents to changed path, as both will need to be refreshed.
        // we already added the old parent (in calling method), so just add the new parent here
        if (details.changedPath.isActive()) {
            var newParent = childNode.parent;
            details.changedPath.addParentNode(newParent);
        }
    };
    GroupStage.prototype.removeNodes = function (leafRowNodes, details, batchRemover) {
        this.removeNodesInStages(leafRowNodes, details, batchRemover);
        if (details.changedPath.isActive()) {
            leafRowNodes.forEach(function (rowNode) { return details.changedPath.addParentNode(rowNode.parent); });
        }
    };
    GroupStage.prototype.removeNodesInStages = function (leafRowNodes, details, batchRemover) {
        this.removeNodesFromParents(leafRowNodes, details, batchRemover);
        if (details.usingTreeData) {
            this.postRemoveCreateFillerNodes(leafRowNodes, details);
            // When not TreeData, then removeEmptyGroups is called just before the BatchRemover is flushed.
            // However for TreeData, there is no BatchRemover, so we have to call removeEmptyGroups here.
            var nodeParents = leafRowNodes.map(function (n) { return n.parent; });
            this.removeEmptyGroups(nodeParents, details);
        }
    };
    GroupStage.prototype.forEachParentGroup = function (details, group, callback) {
        var pointer = group;
        while (pointer && pointer !== details.rootNode) {
            callback(pointer);
            pointer = pointer.parent;
        }
    };
    GroupStage.prototype.removeNodesFromParents = function (nodesToRemove, details, provided) {
        var _this = this;
        // this method can be called with BatchRemover as optional. if it is missed, we created a local version
        // and flush it at the end. if one is provided, we add to the provided one and it gets flushed elsewhere.
        var batchRemoverIsLocal = provided == null;
        var batchRemoverToUse = provided ? provided : new BatchRemover();
        nodesToRemove.forEach(function (nodeToRemove) {
            _this.removeFromParent(nodeToRemove, batchRemoverToUse);
            // remove from allLeafChildren. we clear down all parents EXCEPT the Root Node, as
            // the ClientSideNodeManager is responsible for the Root Node.
            _this.forEachParentGroup(details, nodeToRemove.parent, function (parentNode) {
                batchRemoverToUse.removeFromAllLeafChildren(parentNode, nodeToRemove);
            });
        });
        if (batchRemoverIsLocal) {
            batchRemoverToUse.flush();
        }
    };
    GroupStage.prototype.postRemoveCreateFillerNodes = function (nodesToRemove, details) {
        var _this = this;
        nodesToRemove.forEach(function (nodeToRemove) {
            // if not group, and children are present, need to move children to a group.
            // otherwise if no children, we can just remove without replacing.
            var replaceWithGroup = nodeToRemove.hasChildren();
            if (replaceWithGroup) {
                var oldPath = _this.getExistingPathForNode(nodeToRemove, details);
                // because we just removed the userGroup, this will always return new support group
                var newGroupNode_1 = _this.findParentForNode(nodeToRemove, oldPath, details);
                // these properties are the ones that will be incorrect in the newly created group,
                // so copy them from the old childNode
                newGroupNode_1.expanded = nodeToRemove.expanded;
                newGroupNode_1.allLeafChildren = nodeToRemove.allLeafChildren;
                newGroupNode_1.childrenAfterGroup = nodeToRemove.childrenAfterGroup;
                newGroupNode_1.childrenMapped = nodeToRemove.childrenMapped;
                newGroupNode_1.updateHasChildren();
                newGroupNode_1.childrenAfterGroup.forEach(function (rowNode) { return rowNode.parent = newGroupNode_1; });
            }
        });
    };
    GroupStage.prototype.removeEmptyGroups = function (possibleEmptyGroups, details) {
        var _this = this;
        // we do this multiple times, as when we remove groups, that means the parent of just removed
        // group can then be empty. to get around this, if we remove, then we check everything again for
        // newly emptied groups. the max number of times this will execute is the depth of the group tree.
        var checkAgain = true;
        var groupShouldBeRemoved = function (rowNode) {
            // because of the while loop below, it's possible we already moved the node,
            // so double check before trying to remove again.
            var mapKey = _this.getChildrenMappedKey(rowNode.key, rowNode.rowGroupColumn);
            var parentRowNode = rowNode.parent;
            var groupAlreadyRemoved = (parentRowNode && parentRowNode.childrenMapped) ?
                !parentRowNode.childrenMapped[mapKey] : true;
            if (groupAlreadyRemoved) {
                // if not linked, then group was already removed
                return false;
            }
            // if still not removed, then we remove if this group is empty
            return !!rowNode.isEmptyRowGroupNode();
        };
        var _loop_1 = function () {
            checkAgain = false;
            var batchRemover = new BatchRemover();
            possibleEmptyGroups.forEach(function (possibleEmptyGroup) {
                // remove empty groups
                _this.forEachParentGroup(details, possibleEmptyGroup, function (rowNode) {
                    if (groupShouldBeRemoved(rowNode)) {
                        checkAgain = true;
                        _this.removeFromParent(rowNode, batchRemover);
                        // we remove selection on filler nodes here, as the selection would not be removed
                        // from the RowNodeManager, as filler nodes don't exist on the RowNodeManager
                        rowNode.setSelectedParams({ newValue: false, source: 'rowGroupChanged' });
                    }
                });
            });
            batchRemover.flush();
        };
        while (checkAgain) {
            _loop_1();
        }
    };
    // removes the node from the parent by:
    // a) removing from childrenAfterGroup (using batchRemover if present, otherwise immediately)
    // b) removing from childrenMapped (immediately)
    // c) setRowTop(null) - as the rowRenderer uses this to know the RowNode is no longer needed
    // d) setRowIndex(null) - as the rowNode will no longer be displayed.
    GroupStage.prototype.removeFromParent = function (child, batchRemover) {
        if (child.parent) {
            if (batchRemover) {
                batchRemover.removeFromChildrenAfterGroup(child.parent, child);
            }
            else {
                core._.removeFromArray(child.parent.childrenAfterGroup, child);
                child.parent.updateHasChildren();
            }
        }
        var mapKey = this.getChildrenMappedKey(child.key, child.rowGroupColumn);
        if (child.parent && child.parent.childrenMapped) {
            child.parent.childrenMapped[mapKey] = undefined;
        }
        // this is important for transition, see rowComp removeFirstPassFuncs. when doing animation and
        // remove, if rowTop is still present, the rowComp thinks it's just moved position.
        child.setRowTop(null);
        child.setRowIndex(null);
    };
    GroupStage.prototype.addToParent = function (child, parent) {
        var mapKey = this.getChildrenMappedKey(child.key, child.rowGroupColumn);
        if (parent) {
            var children = parent.childrenMapped != null;
            if (children) {
                parent.childrenMapped[mapKey] = child;
            }
            parent.childrenAfterGroup.push(child);
            parent.updateHasChildren();
        }
    };
    GroupStage.prototype.areGroupColsEqual = function (d1, d2) {
        if (d1 == null || d2 == null || d1.pivotMode !== d2.pivotMode) {
            return false;
        }
        return core._.areEqual(d1.groupedCols, d2.groupedCols) && core._.areEqual(d1.keyCreators, d2.keyCreators);
    };
    GroupStage.prototype.checkAllGroupDataAfterColsChanged = function (details) {
        var _this = this;
        var recurse = function (rowNodes) {
            if (!rowNodes) {
                return;
            }
            rowNodes.forEach(function (rowNode) {
                var isLeafNode = !details.usingTreeData && !rowNode.group;
                if (isLeafNode) {
                    return;
                }
                var groupInfo = {
                    field: rowNode.field,
                    key: rowNode.key,
                    rowGroupColumn: rowNode.rowGroupColumn,
                    leafNode: rowNode.allLeafChildren[0],
                };
                _this.setGroupData(rowNode, groupInfo, details);
                recurse(rowNode.childrenAfterGroup);
            });
        };
        recurse(details.rootNode.childrenAfterGroup);
    };
    GroupStage.prototype.shotgunResetEverything = function (details, afterColumnsChanged) {
        if (this.noChangeInGroupingColumns(details, afterColumnsChanged)) {
            return;
        }
        // groups are about to get disposed, so need to deselect any that are selected
        this.selectionService.filterFromSelection(function (node) { return node && !node.group; });
        var rootNode = details.rootNode, groupedCols = details.groupedCols;
        // because we are not creating the root node each time, we have the logic
        // here to change leafGroup once.
        // we set .leafGroup to false for tree data, as .leafGroup is only used when pivoting, and pivoting
        // isn't allowed with treeData, so the grid never actually use .leafGroup when doing treeData.
        rootNode.leafGroup = details.usingTreeData ? false : groupedCols.length === 0;
        // we are doing everything from scratch, so reset childrenAfterGroup and childrenMapped from the rootNode
        rootNode.childrenAfterGroup = [];
        rootNode.childrenMapped = {};
        rootNode.updateHasChildren();
        var sibling = rootNode.sibling;
        if (sibling) {
            sibling.childrenAfterGroup = rootNode.childrenAfterGroup;
            sibling.childrenMapped = rootNode.childrenMapped;
        }
        this.insertNodes(rootNode.allLeafChildren, details, false);
    };
    GroupStage.prototype.noChangeInGroupingColumns = function (details, afterColumnsChanged) {
        var noFurtherProcessingNeeded = false;
        var groupDisplayColumns = this.columnModel.getGroupDisplayColumns();
        var newGroupDisplayColIds = groupDisplayColumns ?
            groupDisplayColumns.map(function (c) { return c.getId(); }).join('-') : '';
        if (afterColumnsChanged) {
            // we only need to redo grouping if doing normal grouping (ie not tree data)
            // and the group cols have changed.
            noFurtherProcessingNeeded = details.usingTreeData || this.areGroupColsEqual(details, this.oldGroupingDetails);
            // if the group display cols have changed, then we need to update rowNode.groupData
            // (regardless of tree data or row grouping)
            if (this.oldGroupDisplayColIds !== newGroupDisplayColIds) {
                this.checkAllGroupDataAfterColsChanged(details);
            }
        }
        this.oldGroupingDetails = details;
        this.oldGroupDisplayColIds = newGroupDisplayColIds;
        return noFurtherProcessingNeeded;
    };
    GroupStage.prototype.insertNodes = function (newRowNodes, details, isMove) {
        var _this = this;
        if (details.usingTreeData) {
            var longestPath_1 = 1;
            var rowNodesAndPaths = newRowNodes.map(function (node) {
                var path = _this.getGroupInfo(node, details);
                longestPath_1 = Math.max(longestPath_1, path.length);
                return [node, path];
            });
            var _loop_2 = function (checkedLevel) {
                rowNodesAndPaths.forEach(function (_a) {
                    var _b = __read$2(_a, 2), rowNode = _b[0], path = _b[1];
                    if (path.length !== checkedLevel) {
                        return;
                    }
                    _this.insertOneNode(rowNode, details, isMove, undefined, path);
                    if (details.changedPath.isActive()) {
                        details.changedPath.addParentNode(rowNode.parent);
                    }
                });
            };
            // a performance improvement for tree data, by starting at the shortest paths,
            // less redundant groups need created and destroyed
            for (var checkedLevel = 1; checkedLevel < longestPath_1; checkedLevel++) {
                _loop_2(checkedLevel);
            }
            return;
        }
        newRowNodes.forEach(function (rowNode) {
            _this.insertOneNode(rowNode, details, isMove);
            if (details.changedPath.isActive()) {
                details.changedPath.addParentNode(rowNode.parent);
            }
        });
    };
    GroupStage.prototype.insertOneNode = function (childNode, details, isMove, batchRemover, providedPath) {
        var path = providedPath !== null && providedPath !== void 0 ? providedPath : this.getGroupInfo(childNode, details);
        var parentGroup = this.findParentForNode(childNode, path, details, batchRemover);
        if (!parentGroup.group) {
            console.warn("AG Grid: duplicate group keys for row data, keys should be unique", [parentGroup.data, childNode.data]);
        }
        if (details.usingTreeData) {
            this.swapGroupWithUserNode(parentGroup, childNode, isMove);
        }
        else {
            childNode.parent = parentGroup;
            childNode.level = path.length;
            parentGroup.childrenAfterGroup.push(childNode);
            parentGroup.updateHasChildren();
        }
    };
    GroupStage.prototype.findParentForNode = function (childNode, path, details, batchRemover) {
        var _this = this;
        var nextNode = details.rootNode;
        path.forEach(function (groupInfo, level) {
            nextNode = _this.getOrCreateNextNode(nextNode, groupInfo, level, details);
            // node gets added to all group nodes.
            // note: we do not add to rootNode here, as the rootNode is the master list of rowNodes
            if (!(batchRemover === null || batchRemover === void 0 ? void 0 : batchRemover.isRemoveFromAllLeafChildren(nextNode, childNode))) {
                nextNode.allLeafChildren.push(childNode);
            }
            else {
                // if this node is about to be removed, prevent that
                batchRemover === null || batchRemover === void 0 ? void 0 : batchRemover.preventRemoveFromAllLeafChildren(nextNode, childNode);
            }
        });
        return nextNode;
    };
    GroupStage.prototype.swapGroupWithUserNode = function (fillerGroup, userGroup, isMove) {
        userGroup.parent = fillerGroup.parent;
        userGroup.key = fillerGroup.key;
        userGroup.field = fillerGroup.field;
        userGroup.groupData = fillerGroup.groupData;
        userGroup.level = fillerGroup.level;
        // AG-3441 - preserve the existing expanded status of the node if we're moving it, so that
        // you can drag a sub tree from one parent to another without changing its expansion
        if (!isMove) {
            userGroup.expanded = fillerGroup.expanded;
        }
        // we set .leafGroup to false for tree data, as .leafGroup is only used when pivoting, and pivoting
        // isn't allowed with treeData, so the grid never actually use .leafGroup when doing treeData.
        userGroup.leafGroup = fillerGroup.leafGroup;
        // always null for userGroups, as row grouping is not allowed when doing tree data
        userGroup.rowGroupIndex = fillerGroup.rowGroupIndex;
        userGroup.allLeafChildren = fillerGroup.allLeafChildren;
        userGroup.childrenAfterGroup = fillerGroup.childrenAfterGroup;
        userGroup.childrenMapped = fillerGroup.childrenMapped;
        userGroup.sibling = fillerGroup.sibling;
        userGroup.updateHasChildren();
        this.removeFromParent(fillerGroup);
        userGroup.childrenAfterGroup.forEach(function (rowNode) { return rowNode.parent = userGroup; });
        this.addToParent(userGroup, fillerGroup.parent);
    };
    GroupStage.prototype.getOrCreateNextNode = function (parentGroup, groupInfo, level, details) {
        var key = this.getChildrenMappedKey(groupInfo.key, groupInfo.rowGroupColumn);
        var nextNode = parentGroup.childrenMapped ? parentGroup.childrenMapped[key] : undefined;
        if (!nextNode) {
            nextNode = this.createGroup(groupInfo, parentGroup, level, details);
            // attach the new group to the parent
            this.addToParent(nextNode, parentGroup);
        }
        return nextNode;
    };
    GroupStage.prototype.createGroup = function (groupInfo, parent, level, details) {
        var groupNode = new core.RowNode(this.beans);
        groupNode.group = true;
        groupNode.field = groupInfo.field;
        groupNode.rowGroupColumn = groupInfo.rowGroupColumn;
        this.setGroupData(groupNode, groupInfo, details);
        groupNode.key = groupInfo.key;
        groupNode.id = this.createGroupId(groupNode, parent, details.usingTreeData, level);
        groupNode.level = level;
        groupNode.leafGroup = details.usingTreeData ? false : level === (details.groupedColCount - 1);
        groupNode.allLeafChildren = [];
        // why is this done here? we are not updating the children count as we go,
        // i suspect this is updated in the filter stage
        groupNode.setAllChildrenCount(0);
        groupNode.rowGroupIndex = details.usingTreeData ? null : level;
        groupNode.childrenAfterGroup = [];
        groupNode.childrenMapped = {};
        groupNode.updateHasChildren();
        groupNode.parent = details.includeParents ? parent : null;
        this.setExpandedInitialValue(details, groupNode);
        return groupNode;
    };
    GroupStage.prototype.createGroupId = function (node, parent, usingTreeData, level) {
        var createGroupId;
        if (usingTreeData) {
            createGroupId = function (node, parent, level) {
                if (level < 0) {
                    return null;
                } // root node
                var parentId = parent ? createGroupId(parent, parent.parent, level - 1) : null;
                return "".concat(parentId == null ? '' : parentId + '-').concat(level, "-").concat(node.key);
            };
        }
        else {
            createGroupId = function (node, parent) {
                if (!node.rowGroupColumn) {
                    return null;
                } // root node
                var parentId = parent ? createGroupId(parent, parent.parent, 0) : null;
                return "".concat(parentId == null ? '' : parentId + '-').concat(node.rowGroupColumn.getColId(), "-").concat(node.key);
            };
        }
        // we put 'row-group-' before the group id, so it doesn't clash with standard row id's. we also use 't-' and 'b-'
        // for top pinned and bottom pinned rows.
        return core.RowNode.ID_PREFIX_ROW_GROUP + createGroupId(node, parent, level);
    };
    GroupStage.prototype.setGroupData = function (groupNode, groupInfo, details) {
        var _this = this;
        groupNode.groupData = {};
        var groupDisplayCols = this.columnModel.getGroupDisplayColumns();
        groupDisplayCols.forEach(function (col) {
            // newGroup.rowGroupColumn=null when working off GroupInfo, and we always display the group in the group column
            // if rowGroupColumn is present, then it's grid row grouping and we only include if configuration says so
            var isTreeData = details.usingTreeData;
            if (isTreeData) {
                groupNode.groupData[col.getColId()] = groupInfo.key;
                return;
            }
            var groupColumn = groupNode.rowGroupColumn;
            var isRowGroupDisplayed = groupColumn !== null && col.isRowGroupDisplayed(groupColumn.getId());
            if (isRowGroupDisplayed) {
                if (details.suppressGroupMaintainValueType) {
                    groupNode.groupData[col.getColId()] = groupInfo.key;
                }
                else {
                    // if maintain group value type, get the value from any leaf node.
                    groupNode.groupData[col.getColId()] = _this.valueService.getValue(groupColumn, groupInfo.leafNode);
                }
            }
        });
    };
    GroupStage.prototype.getChildrenMappedKey = function (key, rowGroupColumn) {
        if (rowGroupColumn) {
            // grouping by columns
            return rowGroupColumn.getId() + '-' + key;
        }
        // tree data - we don't have rowGroupColumns
        return key;
    };
    GroupStage.prototype.setExpandedInitialValue = function (details, groupNode) {
        // if pivoting the leaf group is never expanded as we do not show leaf rows
        if (details.pivotMode && groupNode.leafGroup) {
            groupNode.expanded = false;
            return;
        }
        // use callback if exists
        var userCallback = details.isGroupOpenByDefault;
        if (userCallback) {
            var params = {
                rowNode: groupNode,
                field: groupNode.field,
                key: groupNode.key,
                level: groupNode.level,
                rowGroupColumn: groupNode.rowGroupColumn
            };
            groupNode.expanded = userCallback(params) == true;
            return;
        }
        // use expandByDefault if exists
        var expandByDefault = details.expandByDefault;
        if (details.expandByDefault === -1) {
            groupNode.expanded = true;
            return;
        }
        // otherwise
        groupNode.expanded = groupNode.level < expandByDefault;
    };
    GroupStage.prototype.getGroupInfo = function (rowNode, details) {
        if (details.usingTreeData) {
            return this.getGroupInfoFromCallback(rowNode, details);
        }
        return this.getGroupInfoFromGroupColumns(rowNode, details);
    };
    GroupStage.prototype.getGroupInfoFromCallback = function (rowNode, details) {
        var keys = details.getDataPath ? details.getDataPath(rowNode.data) : null;
        if (keys === null || keys === undefined || keys.length === 0) {
            core._.warnOnce("getDataPath() should not return an empty path for data ".concat(rowNode.data));
        }
        var groupInfoMapper = function (key) { return ({ key: key, field: null, rowGroupColumn: null }); };
        return keys ? keys.map(groupInfoMapper) : [];
    };
    GroupStage.prototype.getGroupInfoFromGroupColumns = function (rowNode, details) {
        var _this = this;
        var res = [];
        details.groupedCols.forEach(function (groupCol) {
            var key = _this.valueService.getKeyForNode(groupCol, rowNode);
            var keyExists = key !== null && key !== undefined && key !== '';
            // unbalanced tree and pivot mode don't work together - not because of the grid, it doesn't make
            // mathematical sense as you are building up a cube. so if pivot mode, we put in a blank key where missing.
            // this keeps the tree balanced and hence can be represented as a group.
            var createGroupForEmpty = details.pivotMode || !details.groupAllowUnbalanced;
            if (createGroupForEmpty && !keyExists) {
                key = '';
                keyExists = true;
            }
            if (keyExists) {
                var item = {
                    key: key,
                    field: groupCol.getColDef().field,
                    rowGroupColumn: groupCol,
                    leafNode: rowNode,
                };
                res.push(item);
            }
        });
        return res;
    };
    __decorate$c([
        core.Autowired('columnModel')
    ], GroupStage.prototype, "columnModel", void 0);
    __decorate$c([
        core.Autowired('selectableService')
    ], GroupStage.prototype, "selectableService", void 0);
    __decorate$c([
        core.Autowired('valueService')
    ], GroupStage.prototype, "valueService", void 0);
    __decorate$c([
        core.Autowired('beans')
    ], GroupStage.prototype, "beans", void 0);
    __decorate$c([
        core.Autowired('selectionService')
    ], GroupStage.prototype, "selectionService", void 0);
    GroupStage = __decorate$c([
        core.Bean('groupStage')
    ], GroupStage);
    return GroupStage;
}(core.BeanStub));

var __extends$b = (undefined && undefined.__extends) || (function () {
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
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate$b = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __read$1 = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray$1 = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var PivotColDefService = /** @class */ (function (_super) {
    __extends$b(PivotColDefService, _super);
    function PivotColDefService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PivotColDefService_1 = PivotColDefService;
    PivotColDefService.prototype.init = function () {
        var _this = this;
        var getFieldSeparator = function () { var _a; return (_a = _this.gos.get('serverSidePivotResultFieldSeparator')) !== null && _a !== void 0 ? _a : '_'; };
        this.fieldSeparator = getFieldSeparator();
        this.addManagedPropertyListener('serverSidePivotResultFieldSeparator', function () { _this.fieldSeparator = getFieldSeparator(); });
        var getPivotDefaultExpanded = function () { return _this.gos.get('pivotDefaultExpanded'); };
        this.pivotDefaultExpanded = getPivotDefaultExpanded();
        this.addManagedPropertyListener('pivotDefaultExpanded', function () { _this.pivotDefaultExpanded = getPivotDefaultExpanded(); });
    };
    PivotColDefService.prototype.createPivotColumnDefs = function (uniqueValues) {
        // this is passed to the columnModel, to configure the columns and groups we show
        var pivotColumnGroupDefs = this.createPivotColumnsFromUniqueValues(uniqueValues);
        function extractColDefs(input, arr) {
            if (arr === void 0) { arr = []; }
            input.forEach(function (def) {
                if (def.children !== undefined) {
                    extractColDefs(def.children, arr);
                }
                else {
                    arr.push(def);
                }
            });
            return arr;
        }
        var pivotColumnDefs = extractColDefs(pivotColumnGroupDefs);
        // additional columns that contain the aggregated total for each value column per row
        this.addRowGroupTotals(pivotColumnGroupDefs, pivotColumnDefs);
        // additional group columns that contain child totals for each collapsed child column / group
        this.addExpandablePivotGroups(pivotColumnGroupDefs, pivotColumnDefs);
        // additional group columns that contain an aggregated total across all child columns
        this.addPivotTotalsToGroups(pivotColumnGroupDefs, pivotColumnDefs);
        // we clone, so the colDefs in pivotColumnsGroupDefs and pivotColumnDefs are not shared. this is so that
        // any changes the user makes (via processSecondaryColumnDefinitions) don't impact the internal aggregations,
        // as these use the col defs also
        var pivotColumnDefsClone = pivotColumnDefs.map(function (colDef) { return core._.cloneObject(colDef); });
        return {
            pivotColumnGroupDefs: pivotColumnGroupDefs,
            pivotColumnDefs: pivotColumnDefsClone
        };
    };
    PivotColDefService.prototype.createPivotColumnsFromUniqueValues = function (uniqueValues) {
        var pivotColumns = this.columnModel.getPivotColumns();
        var maxDepth = pivotColumns.length;
        var pivotColumnGroupDefs = this.recursivelyBuildGroup(0, uniqueValues, [], maxDepth, pivotColumns);
        return pivotColumnGroupDefs;
    };
    PivotColDefService.prototype.recursivelyBuildGroup = function (index, uniqueValue, pivotKeys, maxDepth, primaryPivotColumns) {
        var _this = this;
        var measureColumns = this.columnModel.getValueColumns();
        if (index >= maxDepth) { // Base case - build the measure columns
            return this.buildMeasureCols(pivotKeys);
        }
        // sort by either user provided comparator, or our own one
        var primaryPivotColumnDefs = primaryPivotColumns[index].getColDef();
        var comparator = this.headerNameComparator.bind(this, primaryPivotColumnDefs.pivotComparator);
        // Base case for the compact layout, instead of recursing build the last layer of groups as measure columns instead
        if (measureColumns.length === 1 && this.gridOptionsService.get('removePivotHeaderRowWhenSingleValueColumn') && index === maxDepth - 1) {
            var leafCols_1 = [];
            core._.iterateObject(uniqueValue, function (key) {
                var newPivotKeys = __spreadArray$1(__spreadArray$1([], __read$1(pivotKeys), false), [key], false);
                var colDef = _this.createColDef(measureColumns[0], key, newPivotKeys);
                colDef.columnGroupShow = 'open';
                leafCols_1.push(colDef);
            });
            leafCols_1.sort(comparator);
            return leafCols_1;
        }
        // Recursive case
        var groups = [];
        core._.iterateObject(uniqueValue, function (key, value) {
            // expand group by default based on depth of group. (pivotDefaultExpanded provides desired level of depth for expanding group by default)
            var openByDefault = _this.pivotDefaultExpanded === -1 || (index < _this.pivotDefaultExpanded);
            var newPivotKeys = __spreadArray$1(__spreadArray$1([], __read$1(pivotKeys), false), [key], false);
            groups.push({
                children: _this.recursivelyBuildGroup(index + 1, value, newPivotKeys, maxDepth, primaryPivotColumns),
                headerName: key,
                pivotKeys: newPivotKeys,
                columnGroupShow: 'open',
                openByDefault: openByDefault,
                groupId: _this.generateColumnGroupId(newPivotKeys),
            });
        });
        groups.sort(comparator);
        return groups;
    };
    PivotColDefService.prototype.buildMeasureCols = function (pivotKeys) {
        var _this = this;
        var measureColumns = this.columnModel.getValueColumns();
        if (measureColumns.length === 0) {
            // if no value columns selected, then we insert one blank column, so the user at least sees columns
            // rendered. otherwise the grid would render with no columns (just empty groups) which would give the
            // impression that the grid is broken
            return [this.createColDef(null, '-', pivotKeys)];
        }
        return measureColumns.map(function (measureCol) {
            var columnName = _this.columnModel.getDisplayNameForColumn(measureCol, 'header');
            return __assign(__assign({}, _this.createColDef(measureCol, columnName, pivotKeys)), { columnGroupShow: 'open' });
        });
    };
    PivotColDefService.prototype.addExpandablePivotGroups = function (pivotColumnGroupDefs, pivotColumnDefs) {
        var _this = this;
        if (this.gridOptionsService.get('suppressExpandablePivotGroups') ||
            this.gridOptionsService.get('pivotColumnGroupTotals')) {
            return;
        }
        var recursivelyAddSubTotals = function (groupDef, currentPivotColumnDefs, acc) {
            var group = groupDef;
            if (group.children) {
                var childAcc_1 = new Map();
                group.children.forEach(function (grp) {
                    recursivelyAddSubTotals(grp, currentPivotColumnDefs, childAcc_1);
                });
                var firstGroup_1 = !group.children.some(function (child) { return child.children; });
                _this.columnModel.getValueColumns().forEach(function (valueColumn) {
                    var columnName = _this.columnModel.getDisplayNameForColumn(valueColumn, 'header');
                    var totalColDef = _this.createColDef(valueColumn, columnName, groupDef.pivotKeys);
                    totalColDef.pivotTotalColumnIds = childAcc_1.get(valueColumn.getColId());
                    totalColDef.columnGroupShow = 'closed';
                    totalColDef.aggFunc = valueColumn.getAggFunc();
                    if (!firstGroup_1) {
                        // add total colDef to group and pivot colDefs array
                        var children = groupDef.children;
                        children.push(totalColDef);
                        currentPivotColumnDefs.push(totalColDef);
                    }
                });
                _this.merge(acc, childAcc_1);
            }
            else {
                var def = groupDef;
                // check that value column exists, i.e. aggFunc is supplied
                if (!def.pivotValueColumn) {
                    return;
                }
                var pivotValueColId = def.pivotValueColumn.getColId();
                var arr = acc.has(pivotValueColId) ? acc.get(pivotValueColId) : [];
                arr.push(def.colId);
                acc.set(pivotValueColId, arr);
            }
        };
        pivotColumnGroupDefs.forEach(function (groupDef) {
            recursivelyAddSubTotals(groupDef, pivotColumnDefs, new Map());
        });
    };
    PivotColDefService.prototype.addPivotTotalsToGroups = function (pivotColumnGroupDefs, pivotColumnDefs) {
        var _this = this;
        if (!this.gridOptionsService.get('pivotColumnGroupTotals')) {
            return;
        }
        var insertAfter = this.gridOptionsService.get('pivotColumnGroupTotals') === 'after';
        var valueCols = this.columnModel.getValueColumns();
        var aggFuncs = valueCols.map(function (valueCol) { return valueCol.getAggFunc(); });
        // don't add pivot totals if there is less than 1 aggFunc or they are not all the same
        if (!aggFuncs || aggFuncs.length < 1 || !this.sameAggFuncs(aggFuncs)) {
            // console.warn('AG Grid: aborting adding pivot total columns - value columns require same aggFunc');
            return;
        }
        // arbitrarily select a value column to use as a template for pivot columns
        var valueColumn = valueCols[0];
        pivotColumnGroupDefs.forEach(function (groupDef) {
            _this.recursivelyAddPivotTotal(groupDef, pivotColumnDefs, valueColumn, insertAfter);
        });
    };
    PivotColDefService.prototype.recursivelyAddPivotTotal = function (groupDef, pivotColumnDefs, valueColumn, insertAfter) {
        var _this = this;
        var group = groupDef;
        if (!group.children) {
            var def = groupDef;
            return def.colId ? [def.colId] : null;
        }
        var colIds = [];
        // need to recurse children first to obtain colIds used in the aggregation stage
        group.children
            .forEach(function (grp) {
            var childColIds = _this.recursivelyAddPivotTotal(grp, pivotColumnDefs, valueColumn, insertAfter);
            if (childColIds) {
                colIds = colIds.concat(childColIds);
            }
        });
        // only add total colDef if there is more than 1 child node
        if (group.children.length > 1) {
            var localeTextFunc = this.localeService.getLocaleTextFunc();
            var headerName = localeTextFunc('pivotColumnGroupTotals', 'Total');
            //create total colDef using an arbitrary value column as a template
            var totalColDef = this.createColDef(valueColumn, headerName, groupDef.pivotKeys, true);
            totalColDef.pivotTotalColumnIds = colIds;
            totalColDef.aggFunc = valueColumn.getAggFunc();
            // add total colDef to group and pivot colDefs array
            var children = groupDef.children;
            insertAfter ? children.push(totalColDef) : children.unshift(totalColDef);
            pivotColumnDefs.push(totalColDef);
        }
        return colIds;
    };
    PivotColDefService.prototype.addRowGroupTotals = function (pivotColumnGroupDefs, pivotColumnDefs) {
        var _this = this;
        if (!this.gridOptionsService.get('pivotRowTotals')) {
            return;
        }
        var insertAfter = this.gridOptionsService.get('pivotRowTotals') === 'after';
        var valueColumns = this.columnModel.getValueColumns();
        // order of row group totals depends on position
        var valueCols = insertAfter ? valueColumns.slice() : valueColumns.slice().reverse();
        var _loop_1 = function (i) {
            var valueCol = valueCols[i];
            var colIds = [];
            pivotColumnGroupDefs.forEach(function (groupDef) {
                colIds = colIds.concat(_this.extractColIdsForValueColumn(groupDef, valueCol));
            });
            var withGroup = valueCols.length > 1 || !this_1.gridOptionsService.get('removePivotHeaderRowWhenSingleValueColumn');
            this_1.createRowGroupTotal(pivotColumnGroupDefs, pivotColumnDefs, valueCol, colIds, insertAfter, withGroup);
        };
        var this_1 = this;
        for (var i = 0; i < valueCols.length; i++) {
            _loop_1(i);
        }
    };
    PivotColDefService.prototype.extractColIdsForValueColumn = function (groupDef, valueColumn) {
        var _this = this;
        var group = groupDef;
        if (!group.children) {
            var colDef = group;
            return colDef.pivotValueColumn === valueColumn && colDef.colId ? [colDef.colId] : [];
        }
        var colIds = [];
        group.children
            .forEach(function (grp) {
            _this.extractColIdsForValueColumn(grp, valueColumn);
            var childColIds = _this.extractColIdsForValueColumn(grp, valueColumn);
            colIds = colIds.concat(childColIds);
        });
        return colIds;
    };
    PivotColDefService.prototype.createRowGroupTotal = function (parentChildren, pivotColumnDefs, valueColumn, colIds, insertAfter, addGroup) {
        var measureColumns = this.columnModel.getValueColumns();
        var colDef;
        if (measureColumns.length === 0) {
            colDef = this.createColDef(null, '-', []);
        }
        else {
            var columnName = this.columnModel.getDisplayNameForColumn(valueColumn, 'header');
            colDef = this.createColDef(valueColumn, columnName, []);
            colDef.pivotTotalColumnIds = colIds;
        }
        colDef.colId = PivotColDefService_1.PIVOT_ROW_TOTAL_PREFIX + colDef.colId;
        pivotColumnDefs.push(colDef);
        var valueGroup = addGroup ? {
            children: [colDef],
            pivotKeys: [],
            groupId: "".concat(PivotColDefService_1.PIVOT_ROW_TOTAL_PREFIX, "_pivotGroup_").concat(valueColumn.getColId()),
        } : colDef;
        insertAfter ? parentChildren.push(valueGroup) : parentChildren.unshift(valueGroup);
    };
    PivotColDefService.prototype.createColDef = function (valueColumn, headerName, pivotKeys, totalColumn) {
        if (totalColumn === void 0) { totalColumn = false; }
        var colDef = {};
        // This is null when there are no measure columns and we're creating placeholder columns
        if (valueColumn) {
            var colDefToCopy = valueColumn.getColDef();
            Object.assign(colDef, colDefToCopy);
            // even if original column was hidden, we always show the pivot value column, otherwise it would be
            // very confusing for people thinking the pivot is broken
            colDef.hide = false;
        }
        colDef.headerName = headerName;
        colDef.colId = this.generateColumnId(pivotKeys || [], valueColumn && !totalColumn ? valueColumn.getColId() : '');
        // pivot columns repeat over field, so it makes sense to use the unique id instead. For example if you want to
        // assign values to pinned bottom rows using setPinnedBottomRowData the value service will use this colId.
        colDef.field = colDef.colId;
        // this is to support using pinned rows, normally the data will be extracted from the aggData object using the colId
        // however pinned rows still access the data object by field, this prevents values with dots from being treated as complex objects
        colDef.valueGetter = function (params) { var _a; return (_a = params.data) === null || _a === void 0 ? void 0 : _a[params.colDef.field]; };
        colDef.pivotKeys = pivotKeys;
        colDef.pivotValueColumn = valueColumn;
        if (colDef.filter === true) {
            colDef.filter = 'agNumberColumnFilter';
        }
        return colDef;
    };
    PivotColDefService.prototype.sameAggFuncs = function (aggFuncs) {
        if (aggFuncs.length == 1) {
            return true;
        }
        //check if all aggFunc's match
        for (var i = 1; i < aggFuncs.length; i++) {
            if (aggFuncs[i] !== aggFuncs[0]) {
                return false;
            }
        }
        return true;
    };
    PivotColDefService.prototype.headerNameComparator = function (userComparator, a, b) {
        if (userComparator) {
            return userComparator(a.headerName, b.headerName);
        }
        else {
            if (a.headerName && !b.headerName) {
                return 1;
            }
            else if (!a.headerName && b.headerName) {
                return -1;
            }
            // slightly naff here - just to satify typescript
            // really should be &&, but if so ts complains
            // the above if/else checks would deal with either being falsy, so at this stage if either are falsy, both are
            // ..still naff though
            if (!a.headerName || !b.headerName) {
                return 0;
            }
            if (a.headerName < b.headerName) {
                return -1;
            }
            if (a.headerName > b.headerName) {
                return 1;
            }
            return 0;
        }
    };
    PivotColDefService.prototype.merge = function (m1, m2) {
        m2.forEach(function (value, key, map) {
            var existingList = m1.has(key) ? m1.get(key) : [];
            var updatedList = __spreadArray$1(__spreadArray$1([], __read$1(existingList), false), __read$1(value), false);
            m1.set(key, updatedList);
        });
    };
    PivotColDefService.prototype.generateColumnGroupId = function (pivotKeys) {
        var pivotCols = this.columnModel.getPivotColumns().map(function (col) { return col.getColId(); });
        return "pivotGroup_".concat(pivotCols.join('-'), "_").concat(pivotKeys.join('-'));
    };
    PivotColDefService.prototype.generateColumnId = function (pivotKeys, measureColumnId) {
        var pivotCols = this.columnModel.getPivotColumns().map(function (col) { return col.getColId(); });
        return "pivot_".concat(pivotCols.join('-'), "_").concat(pivotKeys.join('-'), "_").concat(measureColumnId);
    };
    /**
     * Used by the SSRM to create secondary columns from provided fields
     * @param fields
     */
    PivotColDefService.prototype.createColDefsFromFields = function (fields) {
        var _this = this;
        // tear the ids down into groups, while this could be done in-step with the next stage, the lookup is faster 
        // than searching col group children array for the right group
        var uniqueValues = {};
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            var parts = field.split(this.fieldSeparator);
            var level = uniqueValues;
            for (var p = 0; p < parts.length; p++) {
                var part = parts[p];
                if (level[part] == null) {
                    level[part] = {};
                }
                level = level[part];
            }
        }
        var uniqueValuesToGroups = function (id, key, uniqueValues, depth) {
            var _a;
            var children = [];
            for (var key_1 in uniqueValues) {
                var item = uniqueValues[key_1];
                var child = uniqueValuesToGroups("".concat(id).concat(_this.fieldSeparator).concat(key_1), key_1, item, depth + 1);
                children.push(child);
            }
            if (children.length === 0) {
                var col = {
                    colId: id,
                    headerName: key,
                    // this is to support using pinned rows, normally the data will be extracted from the aggData object using the colId
                    // however pinned rows still access the data object by field, this prevents values with dots from being treated as complex objects
                    valueGetter: function (params) { var _a; return (_a = params.data) === null || _a === void 0 ? void 0 : _a[id]; },
                };
                var potentialAggCol = _this.columnModel.getPrimaryColumn(key);
                if (potentialAggCol) {
                    col.headerName = (_a = _this.columnModel.getDisplayNameForColumn(potentialAggCol, 'header')) !== null && _a !== void 0 ? _a : key;
                    col.aggFunc = potentialAggCol.getAggFunc();
                    col.pivotValueColumn = potentialAggCol;
                }
                return col;
            }
            // this is a bit sketchy. As the fields can be anything we just build groups as deep as the fields go.
            // nothing says user has to give us groups the same depth.
            var collapseSingleChildren = _this.gridOptionsService.get('removePivotHeaderRowWhenSingleValueColumn');
            if (collapseSingleChildren && children.length === 1 && 'colId' in children[0]) {
                children[0].headerName = key;
                return children[0];
            }
            var group = {
                openByDefault: _this.pivotDefaultExpanded === -1 || depth < _this.pivotDefaultExpanded,
                groupId: id,
                headerName: key,
                children: children,
            };
            return group;
        };
        var res = [];
        for (var key in uniqueValues) {
            var item = uniqueValues[key];
            var col = uniqueValuesToGroups(key, key, item, 0);
            res.push(col);
        }
        return res;
    };
    var PivotColDefService_1;
    PivotColDefService.PIVOT_ROW_TOTAL_PREFIX = 'PivotRowTotal_';
    __decorate$b([
        core.Autowired('columnModel')
    ], PivotColDefService.prototype, "columnModel", void 0);
    __decorate$b([
        core.Autowired('gridOptionsService')
    ], PivotColDefService.prototype, "gos", void 0);
    __decorate$b([
        core.PostConstruct
    ], PivotColDefService.prototype, "init", null);
    PivotColDefService = PivotColDefService_1 = __decorate$b([
        core.Bean('pivotColDefService')
    ], PivotColDefService);
    return PivotColDefService;
}(core.BeanStub));

var __extends$a = (undefined && undefined.__extends) || (function () {
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
var __decorate$a = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PivotStage = /** @class */ (function (_super) {
    __extends$a(PivotStage, _super);
    function PivotStage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.uniqueValues = {};
        return _this;
    }
    PivotStage.prototype.execute = function (params) {
        var changedPath = params.changedPath;
        if (this.columnModel.isPivotActive()) {
            this.executePivotOn(changedPath);
        }
        else {
            this.executePivotOff(changedPath);
        }
    };
    PivotStage.prototype.executePivotOff = function (changedPath) {
        this.aggregationColumnsHashLastTime = null;
        this.uniqueValues = {};
        if (this.columnModel.isSecondaryColumnsPresent()) {
            this.columnModel.setSecondaryColumns(null, "rowModelUpdated");
            if (changedPath) {
                changedPath.setInactive();
            }
        }
    };
    PivotStage.prototype.executePivotOn = function (changedPath) {
        var uniqueValues = this.bucketUpRowNodes(changedPath);
        var uniqueValuesChanged = this.setUniqueValues(uniqueValues);
        var aggregationColumns = this.columnModel.getValueColumns();
        var aggregationColumnsHash = aggregationColumns.map(function (column) { return "".concat(column.getId(), "-").concat(column.getColDef().headerName); }).join('#');
        var aggregationFuncsHash = aggregationColumns.map(function (column) { return column.getAggFunc().toString(); }).join('#');
        var aggregationColumnsChanged = this.aggregationColumnsHashLastTime !== aggregationColumnsHash;
        var aggregationFuncsChanged = this.aggregationFuncsHashLastTime !== aggregationFuncsHash;
        this.aggregationColumnsHashLastTime = aggregationColumnsHash;
        this.aggregationFuncsHashLastTime = aggregationFuncsHash;
        var groupColumnsHash = this.columnModel.getRowGroupColumns().map(function (column) { return column.getId(); }).join('#');
        var groupColumnsChanged = groupColumnsHash !== this.groupColumnsHashLastTime;
        this.groupColumnsHashLastTime = groupColumnsHash;
        var pivotRowTotals = this.gridOptionsService.get('pivotRowTotals');
        var pivotColumnGroupTotals = this.gridOptionsService.get('pivotColumnGroupTotals');
        var suppressExpandablePivotGroups = this.gridOptionsService.get('suppressExpandablePivotGroups');
        var removePivotHeaderRowWhenSingleValueColumn = this.gridOptionsService.get('removePivotHeaderRowWhenSingleValueColumn');
        var anyGridOptionsChanged = (pivotRowTotals !== this.pivotRowTotalsLastTime || pivotColumnGroupTotals !== this.pivotColumnGroupTotalsLastTime ||
            suppressExpandablePivotGroups !== this.suppressExpandablePivotGroupsLastTime || removePivotHeaderRowWhenSingleValueColumn !== this.removePivotHeaderRowWhenSingleValueColumnLastTime);
        this.pivotRowTotalsLastTime = pivotRowTotals;
        this.pivotColumnGroupTotalsLastTime = pivotColumnGroupTotals;
        this.suppressExpandablePivotGroupsLastTime = suppressExpandablePivotGroups;
        this.removePivotHeaderRowWhenSingleValueColumnLastTime = removePivotHeaderRowWhenSingleValueColumn;
        if (uniqueValuesChanged || aggregationColumnsChanged || groupColumnsChanged || aggregationFuncsChanged || anyGridOptionsChanged) {
            var _a = this.pivotColDefService.createPivotColumnDefs(this.uniqueValues), pivotColumnGroupDefs = _a.pivotColumnGroupDefs, pivotColumnDefs = _a.pivotColumnDefs;
            this.pivotColumnDefs = pivotColumnDefs;
            this.columnModel.setSecondaryColumns(pivotColumnGroupDefs, "rowModelUpdated");
            // because the secondary columns have changed, then the aggregation needs to visit the whole
            // tree again, so we make the changedPath not active, to force aggregation to visit all paths.
            if (changedPath) {
                changedPath.setInactive();
            }
        }
    };
    PivotStage.prototype.setUniqueValues = function (newValues) {
        var json1 = JSON.stringify(newValues);
        var json2 = JSON.stringify(this.uniqueValues);
        var uniqueValuesChanged = json1 !== json2;
        // we only continue the below if the unique values are different, as otherwise
        // the result will be the same as the last time we did it
        if (uniqueValuesChanged) {
            this.uniqueValues = newValues;
            return true;
        }
        else {
            return false;
        }
    };
    PivotStage.prototype.bucketUpRowNodes = function (changedPath) {
        var _this = this;
        // accessed from inside inner function
        var uniqueValues = {};
        // ensure childrenMapped is cleared, as if a node has been filtered out it should not have mapped children.
        changedPath.forEachChangedNodeDepthFirst(function (node) {
            if (node.leafGroup) {
                node.childrenMapped = null;
            }
        });
        var recursivelyBucketFilteredChildren = function (node) {
            var _a;
            if (node.leafGroup) {
                _this.bucketRowNode(node, uniqueValues);
            }
            else {
                (_a = node.childrenAfterFilter) === null || _a === void 0 ? void 0 : _a.forEach(recursivelyBucketFilteredChildren);
            }
        };
        changedPath.executeFromRootNode(recursivelyBucketFilteredChildren);
        return uniqueValues;
    };
    PivotStage.prototype.bucketRowNode = function (rowNode, uniqueValues) {
        var pivotColumns = this.columnModel.getPivotColumns();
        if (pivotColumns.length === 0) {
            rowNode.childrenMapped = null;
        }
        else {
            rowNode.childrenMapped = this.bucketChildren(rowNode.childrenAfterFilter, pivotColumns, 0, uniqueValues);
        }
        if (rowNode.sibling) {
            rowNode.sibling.childrenMapped = rowNode.childrenMapped;
        }
    };
    PivotStage.prototype.bucketChildren = function (children, pivotColumns, pivotIndex, uniqueValues) {
        var _this = this;
        var mappedChildren = {};
        var pivotColumn = pivotColumns[pivotIndex];
        // map the children out based on the pivot column
        children.forEach(function (child) {
            var key = _this.valueService.getKeyForNode(pivotColumn, child);
            if (core._.missing(key)) {
                key = '';
            }
            if (!uniqueValues[key]) {
                uniqueValues[key] = {};
            }
            if (!mappedChildren[key]) {
                mappedChildren[key] = [];
            }
            mappedChildren[key].push(child);
        });
        // if it's the last pivot column, return as is, otherwise go one level further in the map
        if (pivotIndex === pivotColumns.length - 1) {
            return mappedChildren;
        }
        else {
            var result_1 = {};
            core._.iterateObject(mappedChildren, function (key, value) {
                result_1[key] = _this.bucketChildren(value, pivotColumns, pivotIndex + 1, uniqueValues[key]);
            });
            return result_1;
        }
    };
    PivotStage.prototype.getPivotColumnDefs = function () {
        return this.pivotColumnDefs;
    };
    __decorate$a([
        core.Autowired('valueService')
    ], PivotStage.prototype, "valueService", void 0);
    __decorate$a([
        core.Autowired('columnModel')
    ], PivotStage.prototype, "columnModel", void 0);
    __decorate$a([
        core.Autowired('pivotColDefService')
    ], PivotStage.prototype, "pivotColDefService", void 0);
    PivotStage = __decorate$a([
        core.Bean('pivotStage')
    ], PivotStage);
    return PivotStage;
}(core.BeanStub));

var __extends$9 = (undefined && undefined.__extends) || (function () {
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
var __decorate$9 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// @ts-ignore
var AGBigInt = typeof BigInt === 'undefined' ? null : BigInt;
var defaultAggFuncNames = {
    sum: 'Sum',
    first: 'First',
    last: 'Last',
    min: 'Min',
    max: 'Max',
    count: 'Count',
    avg: 'Average',
};
var AggFuncService = /** @class */ (function (_super) {
    __extends$9(AggFuncService, _super);
    function AggFuncService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.aggFuncsMap = {};
        _this.initialised = false;
        return _this;
    }
    AggFuncService_1 = AggFuncService;
    AggFuncService.prototype.init = function () {
        if (this.initialised) {
            return;
        }
        this.initialiseWithDefaultAggregations();
        this.addAggFuncs(this.gridOptionsService.get('aggFuncs'));
    };
    AggFuncService.prototype.initialiseWithDefaultAggregations = function () {
        this.aggFuncsMap[AggFuncService_1.AGG_SUM] = aggSum;
        this.aggFuncsMap[AggFuncService_1.AGG_FIRST] = aggFirst;
        this.aggFuncsMap[AggFuncService_1.AGG_LAST] = aggLast;
        this.aggFuncsMap[AggFuncService_1.AGG_MIN] = aggMin;
        this.aggFuncsMap[AggFuncService_1.AGG_MAX] = aggMax;
        this.aggFuncsMap[AggFuncService_1.AGG_COUNT] = aggCount;
        this.aggFuncsMap[AggFuncService_1.AGG_AVG] = aggAvg;
        this.initialised = true;
    };
    AggFuncService.prototype.isAggFuncPossible = function (column, func) {
        var allKeys = this.getFuncNames(column);
        var allowed = core._.includes(allKeys, func);
        var funcExists = core._.exists(this.aggFuncsMap[func]);
        return allowed && funcExists;
    };
    AggFuncService.prototype.getDefaultFuncLabel = function (fctName) {
        var _a;
        return (_a = defaultAggFuncNames[fctName]) !== null && _a !== void 0 ? _a : fctName;
    };
    AggFuncService.prototype.getDefaultAggFunc = function (column) {
        var defaultAgg = column.getColDef().defaultAggFunc;
        if (core._.exists(defaultAgg) && this.isAggFuncPossible(column, defaultAgg)) {
            return defaultAgg;
        }
        if (this.isAggFuncPossible(column, AggFuncService_1.AGG_SUM)) {
            return AggFuncService_1.AGG_SUM;
        }
        var allKeys = this.getFuncNames(column);
        return core._.existsAndNotEmpty(allKeys) ? allKeys[0] : null;
    };
    AggFuncService.prototype.addAggFuncs = function (aggFuncs) {
        core._.iterateObject(aggFuncs, this.addAggFunc.bind(this));
    };
    AggFuncService.prototype.addAggFunc = function (key, aggFunc) {
        this.init();
        this.aggFuncsMap[key] = aggFunc;
    };
    AggFuncService.prototype.getAggFunc = function (name) {
        this.init();
        return this.aggFuncsMap[name];
    };
    AggFuncService.prototype.getFuncNames = function (column) {
        var userAllowedFuncs = column.getColDef().allowedAggFuncs;
        return userAllowedFuncs == null ? Object.keys(this.aggFuncsMap).sort() : userAllowedFuncs;
    };
    AggFuncService.prototype.clear = function () {
        this.aggFuncsMap = {};
    };
    var AggFuncService_1;
    AggFuncService.AGG_SUM = 'sum';
    AggFuncService.AGG_FIRST = 'first';
    AggFuncService.AGG_LAST = 'last';
    AggFuncService.AGG_MIN = 'min';
    AggFuncService.AGG_MAX = 'max';
    AggFuncService.AGG_COUNT = 'count';
    AggFuncService.AGG_AVG = 'avg';
    __decorate$9([
        core.PostConstruct
    ], AggFuncService.prototype, "init", null);
    AggFuncService = AggFuncService_1 = __decorate$9([
        core.Bean('aggFuncService')
    ], AggFuncService);
    return AggFuncService;
}(core.BeanStub));
function aggSum(params) {
    var values = params.values;
    var result = null; // the logic ensures that we never combine bigint arithmetic with numbers, but TS is hard to please
    // for optimum performance, we use a for loop here rather than calling any helper methods or using functional code
    for (var i = 0; i < values.length; i++) {
        var value = values[i];
        if (typeof value === 'number') {
            if (result === null) {
                result = value;
            }
            else {
                if (AGBigInt) {
                    result += typeof result === 'number' ? value : AGBigInt(value);
                }
                else {
                    result += value;
                }
            }
        }
        else if (typeof value === 'bigint') {
            if (result === null) {
                result = value;
            }
            else {
                result = (typeof result === 'bigint' ? result : AGBigInt(result)) + value;
            }
        }
    }
    return result;
}
function aggFirst(params) {
    return params.values.length > 0 ? params.values[0] : null;
}
function aggLast(params) {
    return params.values.length > 0 ? core._.last(params.values) : null;
}
function aggMin(params) {
    var values = params.values;
    var result = null;
    // for optimum performance, we use a for loop here rather than calling any helper methods or using functional code
    for (var i = 0; i < values.length; i++) {
        var value = values[i];
        if ((typeof value === 'number' || typeof value === 'bigint') && (result === null || result > value)) {
            result = value;
        }
    }
    return result;
}
function aggMax(params) {
    var values = params.values;
    var result = null;
    // for optimum performance, we use a for loop here rather than calling any helper methods or using functional code
    for (var i = 0; i < values.length; i++) {
        var value = values[i];
        if ((typeof value === 'number' || typeof value === 'bigint') && (result === null || result < value)) {
            result = value;
        }
    }
    return result;
}
function aggCount(params) {
    var _a, _b;
    var values = params.values;
    var result = 0;
    // for optimum performance, we use a for loop here rather than calling any helper methods or using functional code
    for (var i = 0; i < values.length; i++) {
        var value = values[i];
        // check if the value is from a group, in which case use the group's count
        result += value != null && typeof value.value === 'number' ? value.value : 1;
    }
    // the previous aggregation data
    var existingAggData = (_b = (_a = params.rowNode) === null || _a === void 0 ? void 0 : _a.aggData) === null || _b === void 0 ? void 0 : _b[params.column.getColId()];
    if (existingAggData && existingAggData.value === result) {
        // the underlying values haven't changed, return the old object to avoid triggering change detection
        return existingAggData;
    }
    // it's important to wrap it in the object so we can determine if this is a group level
    return {
        value: result,
        toString: function () {
            return this.value.toString();
        },
        // used for sorting
        toNumber: function () {
            return this.value;
        }
    };
}
// the average function is tricky as the multiple levels require weighted averages
// for the non-leaf node aggregations.
function aggAvg(params) {
    var _a, _b, _c;
    var values = params.values;
    var sum = 0; // the logic ensures that we never combine bigint arithmetic with numbers, but TS is hard to please
    var count = 0;
    // for optimum performance, we use a for loop here rather than calling any helper methods or using functional code
    for (var i = 0; i < values.length; i++) {
        var currentValue = values[i];
        var valueToAdd = null;
        if (typeof currentValue === 'number' || typeof currentValue === 'bigint') {
            valueToAdd = currentValue;
            count++;
        }
        else if (currentValue != null && (typeof currentValue.value === 'number' || typeof currentValue.value === 'bigint') && typeof currentValue.count === 'number') {
            // we are aggregating groups, so we take the aggregated values to calculated a weighted average
            if (AGBigInt) {
                valueToAdd = currentValue.value * (typeof currentValue.value === 'number' ? currentValue.count : AGBigInt(currentValue.count));
            }
            else {
                valueToAdd = currentValue.value * currentValue.count;
            }
            count += currentValue.count;
        }
        if (typeof valueToAdd === 'number') {
            if (AGBigInt) {
                sum += typeof sum === 'number' ? valueToAdd : AGBigInt(valueToAdd);
            }
            else {
                sum += valueToAdd;
            }
        }
        else if (typeof valueToAdd === 'bigint') {
            sum = (typeof sum === 'bigint' ? sum : AGBigInt(sum)) + valueToAdd;
        }
    }
    var value = null;
    // avoid divide by zero error
    if (count > 0) {
        if (AGBigInt) {
            value = sum / (typeof sum === 'number' ? count : AGBigInt(count));
        }
        else {
            value = sum / count;
        }
    }
    // the previous aggregation data
    var existingAggData = (_b = (_a = params.rowNode) === null || _a === void 0 ? void 0 : _a.aggData) === null || _b === void 0 ? void 0 : _b[(_c = params.column) === null || _c === void 0 ? void 0 : _c.getColId()];
    if (existingAggData && existingAggData.count === count && existingAggData.value === value) {
        // the underlying values haven't changed, return the old object to avoid triggering change detection
        return existingAggData;
    }
    // the result will be an object. when this cell is rendered, only the avg is shown.
    // however when this cell is part of another aggregation, the count is also needed
    // to create a weighted average for the next level.
    return {
        count: count,
        value: value,
        // the grid by default uses toString to render values for an object, so this
        // is a trick to get the default cellRenderer to display the avg value
        toString: function () {
            return typeof this.value === 'number' || typeof this.value === 'bigint' ? this.value.toString() : '';
        },
        // used for sorting
        toNumber: function () {
            return this.value;
        }
    };
}

var __extends$8 = (undefined && undefined.__extends) || (function () {
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
var __decorate$8 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DropZoneColumnComp = /** @class */ (function (_super) {
    __extends$8(DropZoneColumnComp, _super);
    function DropZoneColumnComp(column, dragSourceDropTarget, ghost, dropZonePurpose, horizontal) {
        var _this = _super.call(this) || this;
        _this.column = column;
        _this.dragSourceDropTarget = dragSourceDropTarget;
        _this.ghost = ghost;
        _this.dropZonePurpose = dropZonePurpose;
        _this.horizontal = horizontal;
        _this.popupShowing = false;
        return _this;
    }
    DropZoneColumnComp.prototype.init = function () {
        var _this = this;
        this.setTemplate(DropZoneColumnComp.TEMPLATE);
        var eGui = this.getGui();
        var isFunctionsReadOnly = this.gridOptionsService.get('functionsReadOnly');
        this.addElementClasses(eGui);
        this.addElementClasses(this.eDragHandle, 'drag-handle');
        this.addElementClasses(this.eText, 'text');
        this.addElementClasses(this.eButton, 'button');
        this.eDragHandle.appendChild(core._.createIconNoSpan('columnDrag', this.gridOptionsService));
        this.eButton.appendChild(core._.createIconNoSpan('cancel', this.gridOptionsService));
        this.setupSort();
        this.displayName = this.columnModel.getDisplayNameForColumn(this.column, 'columnDrop');
        this.setupComponents();
        if (!this.ghost && !isFunctionsReadOnly) {
            this.addDragSource();
        }
        this.setupAria();
        this.addManagedListener(this.eventService, core.Column.EVENT_SORT_CHANGED, function () {
            _this.setupAria();
        });
        this.setupTooltip();
        this.activateTabIndex();
        var checkColumnLock = function () {
            var isLocked = _this.isGroupingAndLocked();
            core._.setDisplayed(_this.eButton, !isLocked && !_this.gridOptionsService.get('functionsReadOnly'));
            _this.eDragHandle.classList.toggle('ag-column-select-column-readonly', isLocked);
            _this.setupAria();
        };
        checkColumnLock();
        if (this.isGroupingZone()) {
            this.addManagedPropertyListener('groupLockGroupColumns', function () { return checkColumnLock(); });
        }
    };
    DropZoneColumnComp.prototype.setupAria = function () {
        var translate = this.localeService.getLocaleTextFunc();
        var _a = this.getColumnAndAggFuncName(), name = _a.name, aggFuncName = _a.aggFuncName;
        var aggSeparator = translate('ariaDropZoneColumnComponentAggFuncSeparator', ' of ');
        var sortDirection = {
            asc: translate('ariaDropZoneColumnComponentSortAscending', 'ascending'),
            desc: translate('ariaDropZoneColumnComponentSortDescending', 'descending'),
        };
        var columnSort = this.column.getSort();
        var isSortSuppressed = this.gridOptionsService.get('rowGroupPanelSuppressSort');
        var ariaInstructions = [
            [
                aggFuncName && "".concat(aggFuncName).concat(aggSeparator),
                name,
                this.isGroupingZone() && !isSortSuppressed && columnSort && ", ".concat(sortDirection[columnSort])
            ].filter(function (part) { return !!part; }).join(''),
        ];
        var isFunctionsReadOnly = this.gridOptionsService.get('functionsReadOnly');
        if (this.isAggregationZone() && !isFunctionsReadOnly) {
            var aggregationMenuAria = translate('ariaDropZoneColumnValueItemDescription', 'Press ENTER to change the aggregation type');
            ariaInstructions.push(aggregationMenuAria);
        }
        if (this.isGroupingZone() && this.column.isSortable() && !isSortSuppressed) {
            var sortProgressAria = translate('ariaDropZoneColumnGroupItemDescription', 'Press ENTER to sort');
            ariaInstructions.push(sortProgressAria);
        }
        if (!this.isGroupingAndLocked()) {
            var deleteAria = translate('ariaDropZoneColumnComponentDescription', 'Press DELETE to remove');
            ariaInstructions.push(deleteAria);
        }
        core._.setAriaLabel(this.getGui(), ariaInstructions.join('. '));
    };
    DropZoneColumnComp.prototype.setupTooltip = function () {
        var _this = this;
        var refresh = function () {
            var newTooltipText = _this.column.getColDef().headerTooltip;
            _this.setTooltip(newTooltipText);
        };
        refresh();
        this.addManagedListener(this.eventService, core.Events.EVENT_NEW_COLUMNS_LOADED, refresh);
    };
    DropZoneColumnComp.prototype.setupSort = function () {
        var _this = this;
        var canSort = this.column.isSortable();
        var isGroupingZone = this.isGroupingZone();
        if (!canSort || !isGroupingZone) {
            return;
        }
        if (!this.gridOptionsService.get('rowGroupPanelSuppressSort')) {
            this.eSortIndicator.setupSort(this.column, true);
            var performSort_1 = function (event) {
                event.preventDefault();
                var sortUsingCtrl = _this.gridOptionsService.get('multiSortKey') === 'ctrl';
                var multiSort = sortUsingCtrl ? (event.ctrlKey || event.metaKey) : event.shiftKey;
                _this.sortController.progressSort(_this.column, multiSort, 'uiColumnSorted');
            };
            this.addGuiEventListener('click', performSort_1);
            this.addGuiEventListener('keydown', function (e) {
                var isEnter = e.key === core.KeyCode.ENTER;
                if (isEnter && _this.isGroupingZone()) {
                    performSort_1(e);
                }
            });
        }
    };
    DropZoneColumnComp.prototype.addDragSource = function () {
        var _this = this;
        var dragSource = {
            type: core.DragSourceType.ToolPanel,
            eElement: this.eDragHandle,
            getDefaultIconName: function () { return core.DragAndDropService.ICON_HIDE; },
            getDragItem: function () { return _this.createDragItem(); },
            dragItemName: this.displayName,
            dragSourceDropTarget: this.dragSourceDropTarget
        };
        this.dragAndDropService.addDragSource(dragSource, true);
        this.addDestroyFunc(function () { return _this.dragAndDropService.removeDragSource(dragSource); });
    };
    DropZoneColumnComp.prototype.createDragItem = function () {
        var visibleState = {};
        visibleState[this.column.getId()] = this.column.isVisible();
        return {
            columns: [this.column],
            visibleState: visibleState
        };
    };
    DropZoneColumnComp.prototype.setupComponents = function () {
        this.setTextValue();
        this.setupRemove();
        if (this.ghost) {
            this.addCssClass('ag-column-drop-cell-ghost');
        }
        if (this.isAggregationZone() && !this.gridOptionsService.get('functionsReadOnly')) {
            this.addGuiEventListener('click', this.onShowAggFuncSelection.bind(this));
        }
    };
    DropZoneColumnComp.prototype.isGroupingAndLocked = function () {
        return this.isGroupingZone() && this.columnModel.isColumnGroupingLocked(this.column);
    };
    DropZoneColumnComp.prototype.setupRemove = function () {
        var _this = this;
        core._.setDisplayed(this.eButton, !this.isGroupingAndLocked() && !this.gridOptionsService.get('functionsReadOnly'));
        var agEvent = { type: DropZoneColumnComp.EVENT_COLUMN_REMOVE };
        this.addGuiEventListener('keydown', function (e) {
            var isEnter = e.key === core.KeyCode.ENTER;
            var isDelete = e.key === core.KeyCode.DELETE;
            if (isDelete) {
                if (!_this.isGroupingAndLocked()) {
                    e.preventDefault();
                    _this.dispatchEvent(agEvent);
                }
            }
            if (isEnter && _this.isAggregationZone() && !_this.gridOptionsService.get('functionsReadOnly')) {
                e.preventDefault();
                _this.onShowAggFuncSelection();
            }
        });
        this.addManagedListener(this.eButton, 'click', function (mouseEvent) {
            _this.dispatchEvent(agEvent);
            mouseEvent.stopPropagation();
        });
        var touchListener = new core.TouchListener(this.eButton);
        this.addManagedListener(touchListener, core.TouchListener.EVENT_TAP, function () {
            _this.dispatchEvent(agEvent);
        });
        this.addDestroyFunc(touchListener.destroy.bind(touchListener));
    };
    DropZoneColumnComp.prototype.getColumnAndAggFuncName = function () {
        var name = this.displayName;
        var aggFuncName = '';
        if (this.isAggregationZone()) {
            var aggFunc = this.column.getAggFunc();
            // if aggFunc is a string, we can use it, but if it's a function, then we swap with 'func'
            var aggFuncString = typeof aggFunc === 'string' ? aggFunc : 'agg';
            var localeTextFunc = this.localeService.getLocaleTextFunc();
            aggFuncName = localeTextFunc(aggFuncString, aggFuncString);
        }
        return { name: name, aggFuncName: aggFuncName };
    };
    DropZoneColumnComp.prototype.setTextValue = function () {
        var _a = this.getColumnAndAggFuncName(), name = _a.name, aggFuncName = _a.aggFuncName;
        var displayValue = this.isAggregationZone() ? "".concat(aggFuncName, "(").concat(name, ")") : name;
        var displayValueSanitised = core._.escapeString(displayValue);
        this.eText.innerHTML = displayValueSanitised;
    };
    DropZoneColumnComp.prototype.onShowAggFuncSelection = function () {
        var _this = this;
        if (this.popupShowing) {
            return;
        }
        this.popupShowing = true;
        var virtualList = new core.VirtualList({ cssIdentifier: 'select-agg-func' });
        var rows = this.aggFuncService.getFuncNames(this.column);
        var eGui = this.getGui();
        var virtualListGui = virtualList.getGui();
        virtualList.setModel({
            getRow: function (index) { return rows[index]; },
            getRowCount: function () { return rows.length; }
        });
        this.getContext().createBean(virtualList);
        var ePopup = core._.loadTemplate(/* html*/ "<div class=\"ag-select-agg-func-popup\"></div>");
        ePopup.style.top = '0px';
        ePopup.style.left = '0px';
        ePopup.appendChild(virtualListGui);
        ePopup.style.width = "".concat(eGui.clientWidth, "px");
        var focusoutListener = this.addManagedListener(ePopup, 'focusout', function (e) {
            if (!ePopup.contains(e.relatedTarget) && addPopupRes) {
                addPopupRes.hideFunc();
            }
        });
        var popupHiddenFunc = function (callbackEvent) {
            _this.destroyBean(virtualList);
            _this.popupShowing = false;
            if ((callbackEvent === null || callbackEvent === void 0 ? void 0 : callbackEvent.key) === 'Escape') {
                eGui.focus();
            }
            if (focusoutListener) {
                focusoutListener();
            }
        };
        var translate = this.localeService.getLocaleTextFunc();
        var addPopupRes = this.popupService.addPopup({
            modal: true,
            eChild: ePopup,
            closeOnEsc: true,
            closedCallback: popupHiddenFunc,
            ariaLabel: translate('ariaLabelAggregationFunction', 'Aggregation Function')
        });
        if (addPopupRes) {
            virtualList.setComponentCreator(this.createAggSelect.bind(this, addPopupRes.hideFunc));
        }
        virtualList.addGuiEventListener('keydown', function (e) {
            if (e.key === core.KeyCode.ENTER || e.key === core.KeyCode.SPACE) {
                var row = virtualList.getLastFocusedRow();
                if (row == null) {
                    return;
                }
                var comp = virtualList.getComponentAt(row);
                if (comp) {
                    comp.selectItem();
                }
            }
        });
        this.popupService.positionPopupByComponent({
            type: 'aggFuncSelect',
            eventSource: eGui,
            ePopup: ePopup,
            keepWithinBounds: true,
            column: this.column,
            position: 'under'
        });
        virtualList.refresh();
        var rowToFocus = rows.findIndex(function (r) { return r === _this.column.getAggFunc(); });
        if (rowToFocus === -1) {
            rowToFocus = 0;
        }
        virtualList.focusRow(rowToFocus);
    };
    DropZoneColumnComp.prototype.createAggSelect = function (hidePopup, value) {
        var _this = this;
        var itemSelected = function () {
            hidePopup();
            if (_this.gridOptionsService.get('functionsPassive')) {
                var event_1 = {
                    type: core.Events.EVENT_COLUMN_AGG_FUNC_CHANGE_REQUEST,
                    columns: [_this.column],
                    aggFunc: value
                };
                _this.eventService.dispatchEvent(event_1);
            }
            else {
                _this.columnModel.setColumnAggFunc(_this.column, value, "toolPanelDragAndDrop");
            }
        };
        var localeTextFunc = this.localeService.getLocaleTextFunc();
        var aggFuncString = value.toString();
        var aggFuncStringTranslated = localeTextFunc(aggFuncString, aggFuncString);
        var comp = new AggItemComp(itemSelected, aggFuncStringTranslated);
        return comp;
    };
    DropZoneColumnComp.prototype.addElementClasses = function (el, suffix) {
        suffix = suffix ? "-".concat(suffix) : '';
        var direction = this.horizontal ? 'horizontal' : 'vertical';
        el.classList.add("ag-column-drop-cell".concat(suffix), "ag-column-drop-".concat(direction, "-cell").concat(suffix));
    };
    DropZoneColumnComp.prototype.isAggregationZone = function () {
        return this.dropZonePurpose === 'aggregation';
    };
    DropZoneColumnComp.prototype.isGroupingZone = function () {
        return this.dropZonePurpose === 'rowGroup';
    };
    DropZoneColumnComp.EVENT_COLUMN_REMOVE = 'columnRemove';
    DropZoneColumnComp.TEMPLATE = "<span role=\"option\">\n          <span ref=\"eDragHandle\" class=\"ag-drag-handle ag-column-drop-cell-drag-handle\" role=\"presentation\"></span>\n          <span ref=\"eText\" class=\"ag-column-drop-cell-text\" aria-hidden=\"true\"></span>\n          <ag-sort-indicator ref=\"eSortIndicator\"></ag-sort-indicator>\n          <span ref=\"eButton\" class=\"ag-column-drop-cell-button\" role=\"presentation\"></span>\n        </span>";
    __decorate$8([
        core.Autowired('dragAndDropService')
    ], DropZoneColumnComp.prototype, "dragAndDropService", void 0);
    __decorate$8([
        core.Autowired('columnModel')
    ], DropZoneColumnComp.prototype, "columnModel", void 0);
    __decorate$8([
        core.Autowired('popupService')
    ], DropZoneColumnComp.prototype, "popupService", void 0);
    __decorate$8([
        core.Optional('aggFuncService')
    ], DropZoneColumnComp.prototype, "aggFuncService", void 0);
    __decorate$8([
        core.Autowired('sortController')
    ], DropZoneColumnComp.prototype, "sortController", void 0);
    __decorate$8([
        core.RefSelector('eText')
    ], DropZoneColumnComp.prototype, "eText", void 0);
    __decorate$8([
        core.RefSelector('eDragHandle')
    ], DropZoneColumnComp.prototype, "eDragHandle", void 0);
    __decorate$8([
        core.RefSelector('eButton')
    ], DropZoneColumnComp.prototype, "eButton", void 0);
    __decorate$8([
        core.RefSelector('eSortIndicator')
    ], DropZoneColumnComp.prototype, "eSortIndicator", void 0);
    __decorate$8([
        core.PostConstruct
    ], DropZoneColumnComp.prototype, "init", null);
    return DropZoneColumnComp;
}(core.Component));
var AggItemComp = /** @class */ (function (_super) {
    __extends$8(AggItemComp, _super);
    function AggItemComp(itemSelected, value) {
        var _this = _super.call(this, /* html */ "<div class=\"ag-select-agg-func-item\"/>") || this;
        _this.selectItem = itemSelected;
        _this.getGui().innerText = value;
        _this.addGuiEventListener('click', _this.selectItem);
        return _this;
    }
    return AggItemComp;
}(core.Component));

var __extends$7 = (undefined && undefined.__extends) || (function () {
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
var __decorate$7 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var BaseDropZonePanel = /** @class */ (function (_super) {
    __extends$7(BaseDropZonePanel, _super);
    function BaseDropZonePanel(horizontal, dropZonePurpose) {
        var _this = _super.call(this, /* html */ "<div class=\"ag-unselectable\" role=\"presentation\"></div>") || this;
        _this.horizontal = horizontal;
        _this.dropZonePurpose = dropZonePurpose;
        _this.state = BaseDropZonePanel.STATE_NOT_DRAGGING;
        _this.guiDestroyFunctions = [];
        _this.childColumnComponents = [];
        _this.resizeEnabled = false;
        _this.addElementClasses(_this.getGui());
        _this.eColumnDropList = document.createElement('div');
        _this.addElementClasses(_this.eColumnDropList, 'list');
        core._.setAriaRole(_this.eColumnDropList, 'listbox');
        return _this;
    }
    BaseDropZonePanel.prototype.isHorizontal = function () {
        return this.horizontal;
    };
    BaseDropZonePanel.prototype.toggleResizable = function (resizable) {
        this.positionableFeature.setResizable(resizable ? { bottom: true } : false);
        this.resizeEnabled = resizable;
    };
    BaseDropZonePanel.prototype.setBeans = function (beans) {
        this.beans = beans;
    };
    BaseDropZonePanel.prototype.destroy = function () {
        this.destroyGui();
        _super.prototype.destroy.call(this);
    };
    BaseDropZonePanel.prototype.destroyGui = function () {
        this.guiDestroyFunctions.forEach(function (func) { return func(); });
        this.guiDestroyFunctions.length = 0;
        this.childColumnComponents.length = 0;
        core._.clearElement(this.getGui());
        core._.clearElement(this.eColumnDropList);
    };
    BaseDropZonePanel.prototype.init = function (params) {
        this.params = params;
        this.createManagedBean(new core.ManagedFocusFeature(this.getFocusableElement(), {
            handleKeyDown: this.handleKeyDown.bind(this)
        }));
        this.addManagedListener(this.beans.eventService, core.Events.EVENT_NEW_COLUMNS_LOADED, this.refreshGui.bind(this));
        this.addManagedPropertyListeners(['functionsReadOnly', 'rowGroupPanelSuppressSort', 'groupLockGroupColumns'], this.refreshGui.bind(this));
        this.setupDropTarget();
        this.positionableFeature = new core.PositionableFeature(this.getGui(), { minHeight: 100 });
        this.createManagedBean(this.positionableFeature);
        // we don't know if this bean will be initialised before columnModel.
        // if columnModel first, then below will work
        // if columnModel second, then below will put blank in, and then above event gets first when columnModel is set up
        this.refreshGui();
        core._.setAriaLabel(this.eColumnDropList, this.getAriaLabel());
    };
    BaseDropZonePanel.prototype.handleKeyDown = function (e) {
        var isVertical = !this.horizontal;
        var isNext = e.key === core.KeyCode.DOWN;
        var isPrevious = e.key === core.KeyCode.UP;
        if (!isVertical) {
            var isRtl = this.gridOptionsService.get('enableRtl');
            isNext = (!isRtl && e.key === core.KeyCode.RIGHT) || (isRtl && e.key === core.KeyCode.LEFT);
            isPrevious = (!isRtl && e.key === core.KeyCode.LEFT) || (isRtl && e.key === core.KeyCode.RIGHT);
        }
        if (!isNext && !isPrevious) {
            return;
        }
        var el = this.focusService.findNextFocusableElement(this.getFocusableElement(), false, isPrevious);
        if (el) {
            e.preventDefault();
            el.focus();
        }
    };
    BaseDropZonePanel.prototype.addElementClasses = function (el, suffix) {
        suffix = suffix ? "-".concat(suffix) : '';
        var direction = this.horizontal ? 'horizontal' : 'vertical';
        el.classList.add("ag-column-drop".concat(suffix), "ag-column-drop-".concat(direction).concat(suffix));
    };
    BaseDropZonePanel.prototype.setupDropTarget = function () {
        this.dropTarget = {
            getContainer: this.getGui.bind(this),
            getIconName: this.getIconName.bind(this),
            onDragging: this.onDragging.bind(this),
            onDragEnter: this.onDragEnter.bind(this),
            onDragLeave: this.onDragLeave.bind(this),
            onDragStop: this.onDragStop.bind(this),
            isInterestedIn: this.isInterestedIn.bind(this)
        };
        this.beans.dragAndDropService.addDropTarget(this.dropTarget);
    };
    BaseDropZonePanel.prototype.isInterestedIn = function (type) {
        // not interested in row drags
        return type === core.DragSourceType.HeaderCell || type === core.DragSourceType.ToolPanel;
    };
    BaseDropZonePanel.prototype.minimumAllowedNewInsertIndex = function () {
        var numberOfLockedCols = this.gridOptionsService.get('groupLockGroupColumns');
        var numberOfGroupCols = this.colModel.getRowGroupColumns().length;
        if (numberOfLockedCols === -1) {
            return numberOfGroupCols;
        }
        return Math.min(numberOfLockedCols, numberOfGroupCols);
    };
    BaseDropZonePanel.prototype.checkInsertIndex = function (draggingEvent) {
        var newIndex = this.getNewInsertIndex(draggingEvent);
        // <0 happens when drag is no a direction we are interested in, eg drag is up/down but in horizontal panel
        if (newIndex < 0) {
            return false;
        }
        var minimumAllowedIndex = this.minimumAllowedNewInsertIndex();
        var newAdjustedIndex = Math.max(minimumAllowedIndex, newIndex);
        var changed = newAdjustedIndex !== this.insertIndex;
        if (changed) {
            this.insertIndex = newAdjustedIndex;
        }
        return changed;
    };
    BaseDropZonePanel.prototype.getNewInsertIndex = function (draggingEvent) {
        var _this = this;
        var mouseEvent = draggingEvent.event;
        var mouseLocation = this.horizontal ? mouseEvent.clientX : mouseEvent.clientY;
        var boundsList = this.childColumnComponents.map(function (col) { return (col.getGui().getBoundingClientRect()); });
        // find the non-ghost component we're hovering
        var hoveredIndex = boundsList.findIndex(function (rect) { return (_this.horizontal ? (rect.right > mouseLocation && rect.left < mouseLocation) : (rect.top < mouseLocation && rect.bottom > mouseLocation)); });
        // not hovering a non-ghost component
        if (hoveredIndex === -1) {
            var enableRtl = this.beans.gridOptionsService.get('enableRtl');
            // if mouse is below or right of all components then new index should be placed last
            var isLast = boundsList.every(function (rect) { return (mouseLocation > (_this.horizontal ? rect.right : rect.bottom)); });
            if (isLast) {
                return enableRtl && this.horizontal ? 0 : this.childColumnComponents.length;
            }
            // if mouse is above or left of all components, new index is first
            var isFirst = boundsList.every(function (rect) { return (mouseLocation < (_this.horizontal ? rect.left : rect.top)); });
            if (isFirst) {
                return enableRtl && this.horizontal ? this.childColumnComponents.length : 0;
            }
            // must be hovering a ghost, don't change the index
            return this.insertIndex;
        }
        // if the old index is equal to or less than the index of our new target
        // we need to shift right, to insert after rather than before
        if (this.insertIndex <= hoveredIndex) {
            return hoveredIndex + 1;
        }
        return hoveredIndex;
    };
    BaseDropZonePanel.prototype.checkDragStartedBySelf = function (draggingEvent) {
        if (this.state !== BaseDropZonePanel.STATE_NOT_DRAGGING) {
            return;
        }
        this.state = BaseDropZonePanel.STATE_REARRANGE_COLUMNS;
        this.potentialDndColumns = draggingEvent.dragSource.getDragItem().columns || [];
        this.refreshGui();
        this.checkInsertIndex(draggingEvent);
        this.refreshGui();
    };
    BaseDropZonePanel.prototype.onDragging = function (draggingEvent) {
        this.checkDragStartedBySelf(draggingEvent);
        if (this.checkInsertIndex(draggingEvent)) {
            this.refreshGui();
        }
    };
    BaseDropZonePanel.prototype.onDragEnter = function (draggingEvent) {
        // this will contain all columns that are potential drops
        var dragColumns = draggingEvent.dragSource.getDragItem().columns || [];
        this.state = BaseDropZonePanel.STATE_NEW_COLUMNS_IN;
        // take out columns that are not droppable
        var goodDragColumns = dragColumns.filter(this.isColumnDroppable.bind(this));
        if (goodDragColumns.length > 0) {
            var hideColumnOnExit = this.isRowGroupPanel() && !this.gridOptionsService.get('suppressRowGroupHidesColumns') && !draggingEvent.fromNudge;
            if (hideColumnOnExit) {
                var dragItem = draggingEvent.dragSource.getDragItem();
                var columns = dragItem.columns;
                this.setColumnsVisible(columns, false, "uiColumnDragged");
            }
            this.potentialDndColumns = goodDragColumns;
            this.checkInsertIndex(draggingEvent);
            this.refreshGui();
        }
    };
    BaseDropZonePanel.prototype.setColumnsVisible = function (columns, visible, source) {
        if (source === void 0) { source = "api"; }
        if (columns) {
            var allowedCols = columns.filter(function (c) { return !c.getColDef().lockVisible; });
            this.colModel.setColumnsVisible(allowedCols, visible, source);
        }
    };
    BaseDropZonePanel.prototype.isPotentialDndColumns = function () {
        return core._.existsAndNotEmpty(this.potentialDndColumns);
    };
    BaseDropZonePanel.prototype.isRowGroupPanel = function () {
        return this.dropZonePurpose === 'rowGroup';
    };
    BaseDropZonePanel.prototype.onDragLeave = function (draggingEvent) {
        // if the dragging started from us, we remove the group, however if it started
        // some place else, then we don't, as it was only 'asking'
        if (this.state === BaseDropZonePanel.STATE_REARRANGE_COLUMNS) {
            var columns = draggingEvent.dragSource.getDragItem().columns || [];
            this.removeColumns(columns);
        }
        if (this.isPotentialDndColumns()) {
            var showColumnOnExit = this.isRowGroupPanel() && !this.gridOptionsService.get('suppressMakeColumnVisibleAfterUnGroup') && !draggingEvent.fromNudge;
            if (showColumnOnExit) {
                var dragItem = draggingEvent.dragSource.getDragItem();
                this.setColumnsVisible(dragItem.columns, true, "uiColumnDragged");
            }
            this.potentialDndColumns = [];
            this.refreshGui();
        }
        this.state = BaseDropZonePanel.STATE_NOT_DRAGGING;
    };
    BaseDropZonePanel.prototype.onDragStop = function () {
        if (this.isPotentialDndColumns()) {
            var success = false;
            if (this.state === BaseDropZonePanel.STATE_NEW_COLUMNS_IN) {
                this.addColumns(this.potentialDndColumns);
                success = true;
            }
            else {
                success = this.rearrangeColumns(this.potentialDndColumns);
            }
            this.potentialDndColumns = [];
            // If the function is passive, then we don't refresh, as we assume the client application
            // is going to call setRowGroups / setPivots / setValues at a later point which will then
            // cause a refresh. This gives a nice GUI where the ghost stays until the app has caught
            // up with the changes. However, if there was no change in the order, then we do need to
            // refresh to reset the columns
            if (!this.beans.gridOptionsService.get('functionsPassive') || !success) {
                this.refreshGui();
            }
        }
        this.state = BaseDropZonePanel.STATE_NOT_DRAGGING;
    };
    BaseDropZonePanel.prototype.removeColumns = function (columnsToRemove) {
        var newColumnList = this.getExistingColumns().filter(function (col) { return !core._.includes(columnsToRemove, col); });
        this.updateColumns(newColumnList);
    };
    BaseDropZonePanel.prototype.addColumns = function (columnsToAdd) {
        if (!columnsToAdd) {
            return;
        }
        var newColumnList = this.getExistingColumns().slice();
        var colsToAddNoDuplicates = columnsToAdd.filter(function (col) { return newColumnList.indexOf(col) < 0; });
        core._.insertArrayIntoArray(newColumnList, colsToAddNoDuplicates, this.insertIndex);
        this.updateColumns(newColumnList);
    };
    BaseDropZonePanel.prototype.rearrangeColumns = function (columnsToAdd) {
        var newColumnList = this.getNonGhostColumns().slice();
        core._.insertArrayIntoArray(newColumnList, columnsToAdd, this.insertIndex);
        if (core._.areEqual(newColumnList, this.getExistingColumns())) {
            return false;
        }
        this.updateColumns(newColumnList);
        return true;
    };
    BaseDropZonePanel.prototype.refreshGui = function () {
        // we reset the scroll position after the refresh.
        // if we don't do this, then the list will always scroll to the top
        // each time we refresh it. this is because part of the refresh empties
        // out the list which sets scroll to zero. so the user could be just
        // reordering the list - we want to prevent the resetting of the scroll.
        // this is relevant for vertical display only (as horizontal has no scroll)
        var scrollTop = this.eColumnDropList.scrollTop;
        var resizeEnabled = this.resizeEnabled;
        var focusedIndex = this.getFocusedItem();
        var alternateElement = this.focusService.findNextFocusableElement();
        if (!alternateElement) {
            alternateElement = this.focusService.findNextFocusableElement(undefined, false, true);
        }
        this.toggleResizable(false);
        this.destroyGui();
        this.addIconAndTitleToGui();
        this.addEmptyMessageToGui();
        this.addColumnsToGui();
        if (!this.isHorizontal()) {
            this.eColumnDropList.scrollTop = scrollTop;
        }
        if (resizeEnabled) {
            this.toggleResizable(resizeEnabled);
        }
        // focus should only be restored when keyboard mode
        // otherwise mouse clicks will cause containers to scroll
        // without no apparent reason.
        if (this.focusService.isKeyboardMode()) {
            this.restoreFocus(focusedIndex, alternateElement);
        }
    };
    BaseDropZonePanel.prototype.getFocusedItem = function () {
        var eGui = this.getGui();
        var activeElement = this.gridOptionsService.getDocument().activeElement;
        if (!eGui.contains(activeElement)) {
            return -1;
        }
        var items = Array.from(eGui.querySelectorAll('.ag-column-drop-cell'));
        return items.indexOf(activeElement);
    };
    BaseDropZonePanel.prototype.restoreFocus = function (index, alternateElement) {
        var eGui = this.getGui();
        var items = Array.from(eGui.querySelectorAll('.ag-column-drop-cell'));
        if (index === -1) {
            return;
        }
        if (items.length === 0) {
            alternateElement.focus();
        }
        var indexToFocus = Math.min(items.length - 1, index);
        var el = items[indexToFocus];
        if (el) {
            el.focus();
        }
    };
    BaseDropZonePanel.prototype.getNonGhostColumns = function () {
        var _this = this;
        var existingColumns = this.getExistingColumns();
        if (this.isPotentialDndColumns()) {
            return existingColumns.filter(function (column) { return !core._.includes(_this.potentialDndColumns, column); });
        }
        return existingColumns;
    };
    BaseDropZonePanel.prototype.addColumnsToGui = function () {
        var _this = this;
        var nonGhostColumns = this.getNonGhostColumns();
        var itemsToAddToGui = nonGhostColumns.map(function (column) { return (_this.createColumnComponent(column, false)); });
        if (this.isPotentialDndColumns()) {
            var dndColumns = this.potentialDndColumns.map(function (column) { return (_this.createColumnComponent(column, true)); });
            if (this.insertIndex >= itemsToAddToGui.length) {
                itemsToAddToGui.push.apply(itemsToAddToGui, __spreadArray([], __read(dndColumns), false));
            }
            else {
                itemsToAddToGui.splice.apply(itemsToAddToGui, __spreadArray([this.insertIndex, 0], __read(dndColumns), false));
            }
        }
        this.appendChild(this.eColumnDropList);
        itemsToAddToGui.forEach(function (columnComponent, index) {
            if (index > 0) {
                _this.addArrow(_this.eColumnDropList);
            }
            _this.eColumnDropList.appendChild(columnComponent.getGui());
        });
        this.addAriaLabelsToComponents();
    };
    BaseDropZonePanel.prototype.addAriaLabelsToComponents = function () {
        var _this = this;
        this.childColumnComponents.forEach(function (comp, idx) {
            var eGui = comp.getGui();
            core._.setAriaPosInSet(eGui, idx + 1);
            core._.setAriaSetSize(eGui, _this.childColumnComponents.length);
        });
    };
    BaseDropZonePanel.prototype.createColumnComponent = function (column, ghost) {
        var _this = this;
        var columnComponent = new DropZoneColumnComp(column, this.dropTarget, ghost, this.dropZonePurpose, this.horizontal);
        columnComponent.addEventListener(DropZoneColumnComp.EVENT_COLUMN_REMOVE, this.removeColumns.bind(this, [column]));
        this.beans.context.createBean(columnComponent);
        this.guiDestroyFunctions.push(function () { return _this.destroyBean(columnComponent); });
        if (!ghost) {
            this.childColumnComponents.push(columnComponent);
        }
        return columnComponent;
    };
    BaseDropZonePanel.prototype.addIconAndTitleToGui = function () {
        var eGroupIcon = this.params.icon;
        var eTitleBar = document.createElement('div');
        core._.setAriaHidden(eTitleBar, true);
        this.addElementClasses(eTitleBar, 'title-bar');
        this.addElementClasses(eGroupIcon, 'icon');
        this.addOrRemoveCssClass('ag-column-drop-empty', this.isExistingColumnsEmpty());
        eTitleBar.appendChild(eGroupIcon);
        if (!this.horizontal) {
            var eTitle = document.createElement('span');
            this.addElementClasses(eTitle, 'title');
            eTitle.innerHTML = this.params.title;
            eTitleBar.appendChild(eTitle);
        }
        this.appendChild(eTitleBar);
    };
    BaseDropZonePanel.prototype.isExistingColumnsEmpty = function () {
        return this.getExistingColumns().length === 0;
    };
    BaseDropZonePanel.prototype.addEmptyMessageToGui = function () {
        if (!this.isExistingColumnsEmpty() || this.isPotentialDndColumns()) {
            return;
        }
        var eMessage = document.createElement('span');
        eMessage.innerHTML = this.params.emptyMessage;
        this.addElementClasses(eMessage, 'empty-message');
        this.eColumnDropList.appendChild(eMessage);
    };
    BaseDropZonePanel.prototype.addArrow = function (eParent) {
        // only add the arrows if the layout is horizontal
        if (this.horizontal) {
            // for RTL it's a left arrow, otherwise it's a right arrow
            var enableRtl = this.beans.gridOptionsService.get('enableRtl');
            var icon = core._.createIconNoSpan(enableRtl ? 'smallLeft' : 'smallRight', this.beans.gridOptionsService);
            this.addElementClasses(icon, 'cell-separator');
            eParent.appendChild(icon);
        }
    };
    BaseDropZonePanel.STATE_NOT_DRAGGING = 'notDragging';
    BaseDropZonePanel.STATE_NEW_COLUMNS_IN = 'newColumnsIn';
    BaseDropZonePanel.STATE_REARRANGE_COLUMNS = 'rearrangeColumns';
    __decorate$7([
        core.Autowired('columnModel')
    ], BaseDropZonePanel.prototype, "colModel", void 0);
    __decorate$7([
        core.Autowired('focusService')
    ], BaseDropZonePanel.prototype, "focusService", void 0);
    return BaseDropZonePanel;
}(core.Component));

var __extends$6 = (undefined && undefined.__extends) || (function () {
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
var __decorate$6 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RowGroupDropZonePanel = /** @class */ (function (_super) {
    __extends$6(RowGroupDropZonePanel, _super);
    function RowGroupDropZonePanel(horizontal) {
        return _super.call(this, horizontal, 'rowGroup') || this;
    }
    RowGroupDropZonePanel.prototype.passBeansUp = function () {
        _super.prototype.setBeans.call(this, {
            gridOptionsService: this.gridOptionsService,
            eventService: this.eventService,
            context: this.getContext(),
            loggerFactory: this.loggerFactory,
            dragAndDropService: this.dragAndDropService
        });
        var localeTextFunc = this.localeService.getLocaleTextFunc();
        var emptyMessage = localeTextFunc('rowGroupColumnsEmptyMessage', 'Drag here to set row groups');
        var title = localeTextFunc('groups', 'Row Groups');
        _super.prototype.init.call(this, {
            dragAndDropIcon: core.DragAndDropService.ICON_GROUP,
            icon: core._.createIconNoSpan('rowGroupPanel', this.gridOptionsService, null),
            emptyMessage: emptyMessage,
            title: title
        });
        this.addManagedListener(this.eventService, core.Events.EVENT_COLUMN_ROW_GROUP_CHANGED, this.refreshGui.bind(this));
    };
    RowGroupDropZonePanel.prototype.getAriaLabel = function () {
        var translate = this.localeService.getLocaleTextFunc();
        var label = translate('ariaRowGroupDropZonePanelLabel', 'Row Groups');
        return label;
    };
    RowGroupDropZonePanel.prototype.getTooltipParams = function () {
        var res = _super.prototype.getTooltipParams.call(this);
        res.location = 'rowGroupColumnsList';
        return res;
    };
    RowGroupDropZonePanel.prototype.isColumnDroppable = function (column) {
        // we never allow grouping of secondary columns
        if (this.gridOptionsService.get('functionsReadOnly') || !column.isPrimary()) {
            return false;
        }
        return column.isAllowRowGroup() && !column.isRowGroupActive();
    };
    RowGroupDropZonePanel.prototype.updateColumns = function (columns) {
        if (this.gridOptionsService.get('functionsPassive')) {
            var event_1 = {
                type: core.Events.EVENT_COLUMN_ROW_GROUP_CHANGE_REQUEST,
                columns: columns
            };
            this.eventService.dispatchEvent(event_1);
        }
        else {
            this.columnModel.setRowGroupColumns(columns, "toolPanelUi");
        }
    };
    RowGroupDropZonePanel.prototype.getIconName = function () {
        return this.isPotentialDndColumns() ? core.DragAndDropService.ICON_GROUP : core.DragAndDropService.ICON_NOT_ALLOWED;
    };
    RowGroupDropZonePanel.prototype.getExistingColumns = function () {
        return this.columnModel.getRowGroupColumns();
    };
    __decorate$6([
        core.Autowired('columnModel')
    ], RowGroupDropZonePanel.prototype, "columnModel", void 0);
    __decorate$6([
        core.Autowired('loggerFactory')
    ], RowGroupDropZonePanel.prototype, "loggerFactory", void 0);
    __decorate$6([
        core.Autowired('dragAndDropService')
    ], RowGroupDropZonePanel.prototype, "dragAndDropService", void 0);
    __decorate$6([
        core.PostConstruct
    ], RowGroupDropZonePanel.prototype, "passBeansUp", null);
    return RowGroupDropZonePanel;
}(BaseDropZonePanel));

var __extends$5 = (undefined && undefined.__extends) || (function () {
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
var __decorate$5 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PivotDropZonePanel = /** @class */ (function (_super) {
    __extends$5(PivotDropZonePanel, _super);
    function PivotDropZonePanel(horizontal) {
        return _super.call(this, horizontal, 'pivot') || this;
    }
    PivotDropZonePanel.prototype.passBeansUp = function () {
        _super.prototype.setBeans.call(this, {
            gridOptionsService: this.gridOptionsService,
            eventService: this.eventService,
            context: this.getContext(),
            loggerFactory: this.loggerFactory,
            dragAndDropService: this.dragAndDropService
        });
        var localeTextFunc = this.localeService.getLocaleTextFunc();
        var emptyMessage = localeTextFunc('pivotColumnsEmptyMessage', 'Drag here to set column labels');
        var title = localeTextFunc('pivots', 'Column Labels');
        _super.prototype.init.call(this, {
            dragAndDropIcon: core.DragAndDropService.ICON_GROUP,
            icon: core._.createIconNoSpan('pivotPanel', this.gridOptionsService, null),
            emptyMessage: emptyMessage,
            title: title
        });
        this.addManagedListener(this.eventService, core.Events.EVENT_NEW_COLUMNS_LOADED, this.refresh.bind(this));
        this.addManagedListener(this.eventService, core.Events.EVENT_COLUMN_PIVOT_CHANGED, this.refresh.bind(this));
        this.addManagedListener(this.eventService, core.Events.EVENT_COLUMN_PIVOT_MODE_CHANGED, this.checkVisibility.bind(this));
        this.refresh();
    };
    PivotDropZonePanel.prototype.getAriaLabel = function () {
        var translate = this.localeService.getLocaleTextFunc();
        var label = translate('ariaPivotDropZonePanelLabel', 'Column Labels');
        return label;
    };
    PivotDropZonePanel.prototype.getTooltipParams = function () {
        var res = _super.prototype.getTooltipParams.call(this);
        res.location = 'pivotColumnsList';
        return res;
    };
    PivotDropZonePanel.prototype.refresh = function () {
        this.checkVisibility();
        this.refreshGui();
    };
    PivotDropZonePanel.prototype.checkVisibility = function () {
        var pivotMode = this.columnModel.isPivotMode();
        if (this.isHorizontal()) {
            // what we do for horizontal (ie the pivot panel at the top) depends
            // on the user property as well as pivotMode.
            switch (this.gridOptionsService.get('pivotPanelShow')) {
                case 'always':
                    this.setDisplayed(pivotMode);
                    break;
                case 'onlyWhenPivoting':
                    var pivotActive = this.columnModel.isPivotActive();
                    this.setDisplayed(pivotMode && pivotActive);
                    break;
                default:
                    // never show it
                    this.setDisplayed(false);
                    break;
            }
        }
        else {
            // in toolPanel, the pivot panel is always shown when pivot mode is on
            this.setDisplayed(pivotMode);
        }
    };
    PivotDropZonePanel.prototype.isColumnDroppable = function (column) {
        // we never allow grouping of secondary columns
        if (this.gridOptionsService.get('functionsReadOnly') || !column.isPrimary()) {
            return false;
        }
        return column.isAllowPivot() && !column.isPivotActive();
    };
    PivotDropZonePanel.prototype.updateColumns = function (columns) {
        if (this.gridOptionsService.get('functionsPassive')) {
            var event_1 = {
                type: core.Events.EVENT_COLUMN_PIVOT_CHANGE_REQUEST,
                columns: columns
            };
            this.eventService.dispatchEvent(event_1);
        }
        else {
            this.columnModel.setPivotColumns(columns, "toolPanelUi");
        }
    };
    PivotDropZonePanel.prototype.getIconName = function () {
        return this.isPotentialDndColumns() ? core.DragAndDropService.ICON_PIVOT : core.DragAndDropService.ICON_NOT_ALLOWED;
    };
    PivotDropZonePanel.prototype.getExistingColumns = function () {
        return this.columnModel.getPivotColumns();
    };
    __decorate$5([
        core.Autowired('columnModel')
    ], PivotDropZonePanel.prototype, "columnModel", void 0);
    __decorate$5([
        core.Autowired('loggerFactory')
    ], PivotDropZonePanel.prototype, "loggerFactory", void 0);
    __decorate$5([
        core.Autowired('dragAndDropService')
    ], PivotDropZonePanel.prototype, "dragAndDropService", void 0);
    __decorate$5([
        core.PostConstruct
    ], PivotDropZonePanel.prototype, "passBeansUp", null);
    return PivotDropZonePanel;
}(BaseDropZonePanel));

var __extends$4 = (undefined && undefined.__extends) || (function () {
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
var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GridHeaderDropZones = /** @class */ (function (_super) {
    __extends$4(GridHeaderDropZones, _super);
    function GridHeaderDropZones() {
        return _super.call(this) || this;
    }
    GridHeaderDropZones.prototype.postConstruct = function () {
        var _this = this;
        this.setGui(this.createNorthPanel());
        this.addManagedListener(this.eventService, core.Events.EVENT_COLUMN_ROW_GROUP_CHANGED, function () { return _this.onRowGroupChanged(); });
        this.addManagedListener(this.eventService, core.Events.EVENT_NEW_COLUMNS_LOADED, function () { return _this.onRowGroupChanged(); });
        this.addManagedPropertyListener('rowGroupPanelShow', function () { return _this.onRowGroupChanged(); });
        this.addManagedPropertyListener('pivotPanelShow', function () { return _this.onPivotPanelShow(); });
        this.onRowGroupChanged();
    };
    GridHeaderDropZones.prototype.createNorthPanel = function () {
        var _this = this;
        var topPanelGui = document.createElement('div');
        topPanelGui.classList.add('ag-column-drop-wrapper');
        core._.setAriaRole(topPanelGui, 'presentation');
        this.rowGroupComp = new RowGroupDropZonePanel(true);
        this.createManagedBean(this.rowGroupComp);
        this.pivotComp = new PivotDropZonePanel(true);
        this.createManagedBean(this.pivotComp);
        topPanelGui.appendChild(this.rowGroupComp.getGui());
        topPanelGui.appendChild(this.pivotComp.getGui());
        this.addManagedListener(this.rowGroupComp, core.Component.EVENT_DISPLAYED_CHANGED, function () { return _this.onDropPanelVisible(); });
        this.addManagedListener(this.pivotComp, core.Component.EVENT_DISPLAYED_CHANGED, function () { return _this.onDropPanelVisible(); });
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
    __decorate$4([
        core.Autowired('columnModel')
    ], GridHeaderDropZones.prototype, "columnModel", void 0);
    __decorate$4([
        core.PostConstruct
    ], GridHeaderDropZones.prototype, "postConstruct", null);
    return GridHeaderDropZones;
}(core.Component));

var __extends$3 = (undefined && undefined.__extends) || (function () {
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
var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var FilterAggregatesStage = /** @class */ (function (_super) {
    __extends$3(FilterAggregatesStage, _super);
    function FilterAggregatesStage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FilterAggregatesStage.prototype.execute = function (params) {
        var _this = this;
        var isPivotMode = this.columnModel.isPivotMode();
        var isAggFilterActive = this.filterManager.isAggregateFilterPresent()
            || this.filterManager.isAggregateQuickFilterPresent();
        // This is the default filter for applying only to leaf nodes, realistically this should not apply as primary agg columns,
        // should not be applied by the filterManager if getGroupAggFiltering is missing. Predicate will apply filters to leaf level.
        var defaultPrimaryColumnPredicate = function (params) { return !params.node.group; };
        // Default secondary column predicate, selecting only leaf level groups.
        var defaultSecondaryColumnPredicate = (function (params) { return params.node.leafGroup; });
        // The predicate to determine whether filters should apply to this row. Either defined by the user in groupAggFiltering or a default depending
        // on current pivot mode status.
        var applyFilterToNode = this.gridOptionsService.getGroupAggFiltering()
            || (isPivotMode ? defaultSecondaryColumnPredicate : defaultPrimaryColumnPredicate);
        var changedPath = params.changedPath;
        var preserveChildren = function (node, recursive) {
            if (recursive === void 0) { recursive = false; }
            if (node.childrenAfterFilter) {
                node.childrenAfterAggFilter = node.childrenAfterFilter;
                if (recursive) {
                    node.childrenAfterAggFilter.forEach(function (child) { return preserveChildren(child, recursive); });
                }
                _this.setAllChildrenCount(node);
            }
            if (node.sibling) {
                node.sibling.childrenAfterAggFilter = node.childrenAfterAggFilter;
            }
        };
        var filterChildren = function (node) {
            var _a;
            node.childrenAfterAggFilter = ((_a = node.childrenAfterFilter) === null || _a === void 0 ? void 0 : _a.filter(function (child) {
                var _a;
                var shouldFilterRow = applyFilterToNode({ node: child });
                if (shouldFilterRow) {
                    var doesNodePassFilter = _this.filterManager.doesRowPassAggregateFilters({ rowNode: child });
                    if (doesNodePassFilter) {
                        // Node has passed, so preserve children
                        preserveChildren(child, true);
                        return true;
                    }
                }
                var hasChildPassed = (_a = child.childrenAfterAggFilter) === null || _a === void 0 ? void 0 : _a.length;
                return hasChildPassed;
            })) || null;
            _this.setAllChildrenCount(node);
            if (node.sibling) {
                node.sibling.childrenAfterAggFilter = node.childrenAfterAggFilter;
            }
        };
        changedPath.forEachChangedNodeDepthFirst(isAggFilterActive ? filterChildren : preserveChildren, true);
    };
    FilterAggregatesStage.prototype.setAllChildrenCountTreeData = function (rowNode) {
        // for tree data, we include all children, groups and leafs
        var allChildrenCount = 0;
        rowNode.childrenAfterAggFilter.forEach(function (child) {
            // include child itself
            allChildrenCount++;
            // include children of children
            allChildrenCount += child.allChildrenCount;
        });
        rowNode.setAllChildrenCount(allChildrenCount);
    };
    FilterAggregatesStage.prototype.setAllChildrenCountGridGrouping = function (rowNode) {
        // for grid data, we only count the leafs
        var allChildrenCount = 0;
        rowNode.childrenAfterAggFilter.forEach(function (child) {
            if (child.group) {
                allChildrenCount += child.allChildrenCount;
            }
            else {
                allChildrenCount++;
            }
        });
        rowNode.setAllChildrenCount(allChildrenCount);
    };
    FilterAggregatesStage.prototype.setAllChildrenCount = function (rowNode) {
        if (!rowNode.hasChildren()) {
            rowNode.setAllChildrenCount(null);
            return;
        }
        if (this.gridOptionsService.get('treeData')) {
            this.setAllChildrenCountTreeData(rowNode);
        }
        else {
            this.setAllChildrenCountGridGrouping(rowNode);
        }
    };
    __decorate$3([
        core.Autowired('filterManager')
    ], FilterAggregatesStage.prototype, "filterManager", void 0);
    __decorate$3([
        core.Autowired('columnModel')
    ], FilterAggregatesStage.prototype, "columnModel", void 0);
    FilterAggregatesStage = __decorate$3([
        core.Bean('filterAggregatesStage')
    ], FilterAggregatesStage);
    return FilterAggregatesStage;
}(core.BeanStub));

// DO NOT UPDATE MANUALLY: Generated from script during build time
var VERSION = '31.0.0';

var __extends$2 = (undefined && undefined.__extends) || (function () {
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
var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GroupFilter = /** @class */ (function (_super) {
    __extends$2(GroupFilter, _super);
    function GroupFilter() {
        return _super.call(this, /* html */ "\n            <div class=\"ag-group-filter\">\n                <div ref=\"eGroupField\"></div>\n                <div ref=\"eUnderlyingFilter\"></div>\n            </div>\n        ") || this;
    }
    GroupFilter.prototype.postConstruct = function () {
        this.initialiseTabGuard({});
    };
    GroupFilter.prototype.init = function (params) {
        var _this = this;
        this.params = params;
        this.validateParams();
        return this.updateGroups().then(function () {
            _this.addManagedListener(_this.eventService, core.Events.EVENT_COLUMN_ROW_GROUP_CHANGED, function () { return _this.onColumnRowGroupChanged(); });
        });
    };
    GroupFilter.prototype.validateParams = function () {
        var colDef = this.params.colDef;
        if (colDef.field) {
            core._.warnOnce('Group Column Filter does not work with the colDef property "field". This property will be ignored.');
        }
        if (colDef.filterValueGetter) {
            core._.warnOnce('Group Column Filter does not work with the colDef property "filterValueGetter". This property will be ignored.');
        }
        if (colDef.filterParams) {
            core._.warnOnce('Group Column Filter does not work with the colDef property "filterParams". This property will be ignored.');
        }
    };
    GroupFilter.prototype.updateGroups = function () {
        var sourceColumns = this.updateGroupField();
        return this.getUnderlyingFilters(sourceColumns);
    };
    GroupFilter.prototype.getSourceColumns = function () {
        this.groupColumn = this.params.column;
        if (this.gridOptionsService.get('treeData')) {
            core._.warnOnce('Group Column Filter does not work with Tree Data enabled. Please disable Tree Data, or use a different filter.');
            return [];
        }
        var sourceColumns = this.columnModel.getSourceColumnsForGroupColumn(this.groupColumn);
        if (!sourceColumns) {
            core._.warnOnce('Group Column Filter only works on group columns. Please use a different filter.');
            return [];
        }
        return sourceColumns;
    };
    GroupFilter.prototype.updateGroupField = function () {
        var _this = this;
        core._.clearElement(this.eGroupField);
        if (this.eGroupFieldSelect) {
            this.destroyBean(this.eGroupFieldSelect);
        }
        var allSourceColumns = this.getSourceColumns();
        var sourceColumns = allSourceColumns.filter(function (sourceColumn) { return sourceColumn.isFilterAllowed(); });
        if (!sourceColumns.length) {
            this.selectedColumn = undefined;
            core._.setDisplayed(this.eGroupField, false);
            return null;
        }
        if (allSourceColumns.length === 1) {
            // we only want to hide the group field element if there's only one group column.
            // If there's one group column that has a filter, but multiple columns in total,
            // we should still show the select so the user knows which column it's for.
            this.selectedColumn = sourceColumns[0];
            core._.setDisplayed(this.eGroupField, false);
        }
        else {
            // keep the old selected column if it's still valid
            if (!this.selectedColumn || !sourceColumns.some(function (column) { return column.getId() === _this.selectedColumn.getId(); })) {
                this.selectedColumn = sourceColumns[0];
            }
            this.createGroupFieldSelectElement(sourceColumns);
            this.eGroupField.appendChild(this.eGroupFieldSelect.getGui());
            this.eGroupField.appendChild(core._.loadTemplate(/* html */ "<div class=\"ag-filter-separator\"></div>"));
            core._.setDisplayed(this.eGroupField, true);
        }
        return sourceColumns;
    };
    GroupFilter.prototype.createGroupFieldSelectElement = function (sourceColumns) {
        var _this = this;
        this.eGroupFieldSelect = this.createManagedBean(new core.AgSelect());
        var localeTextFunc = this.localeService.getLocaleTextFunc();
        this.eGroupFieldSelect.setLabel(localeTextFunc('groupFilterSelect', 'Select field:'));
        this.eGroupFieldSelect.setLabelAlignment('top');
        this.eGroupFieldSelect.addOptions(sourceColumns.map(function (sourceColumn) {
            var _a;
            return ({
                value: sourceColumn.getId(),
                text: (_a = _this.columnModel.getDisplayNameForColumn(sourceColumn, 'groupFilter', false)) !== null && _a !== void 0 ? _a : undefined
            });
        }));
        this.eGroupFieldSelect.setValue(this.selectedColumn.getId());
        this.eGroupFieldSelect.onValueChange(function (newValue) { return _this.updateSelectedColumn(newValue); });
        this.eGroupFieldSelect.addCssClass('ag-group-filter-field-select-wrapper');
        if (sourceColumns.length === 1) {
            this.eGroupFieldSelect.setDisabled(true);
        }
    };
    GroupFilter.prototype.getUnderlyingFilters = function (sourceColumns) {
        var _this = this;
        if (!sourceColumns) {
            this.filterColumnPairs = undefined;
            this.selectedFilter = undefined;
            this.groupColumn.setFilterActive(false, 'columnRowGroupChanged');
            return core.AgPromise.resolve();
        }
        var filterPromises = [];
        var filterColumnPairs = [];
        sourceColumns.forEach(function (column) {
            var filterWrapper = _this.filterManager.getOrCreateFilterWrapper(column, 'COLUMN_MENU');
            if (filterWrapper === null || filterWrapper === void 0 ? void 0 : filterWrapper.filterPromise) {
                filterPromises.push(filterWrapper.filterPromise.then(function (filter) {
                    if (filter) {
                        filterColumnPairs.push({
                            filter: filter,
                            column: column
                        });
                    }
                    if (column.getId() === _this.selectedColumn.getId()) {
                        _this.selectedFilter = filter !== null && filter !== void 0 ? filter : undefined;
                    }
                    return filter;
                }));
            }
        });
        return core.AgPromise.all(filterPromises).then(function () {
            _this.filterColumnPairs = filterColumnPairs;
            _this.groupColumn.setFilterActive(_this.isFilterActive(), 'columnRowGroupChanged');
        });
    };
    GroupFilter.prototype.addUnderlyingFilterElement = function () {
        var _this = this;
        core._.clearElement(this.eUnderlyingFilter);
        if (!this.selectedColumn) {
            return core.AgPromise.resolve();
        }
        var filterWrapper = this.filterManager.getOrCreateFilterWrapper(this.selectedColumn, 'COLUMN_MENU');
        if (!filterWrapper) {
            return core.AgPromise.resolve();
        }
        return filterWrapper.guiPromise.then(function (gui) {
            var _a;
            _this.eUnderlyingFilter.appendChild(gui);
            (_a = filterWrapper.filterPromise) === null || _a === void 0 ? void 0 : _a.then(function (filter) {
                var _a, _b;
                (_a = filter === null || filter === void 0 ? void 0 : filter.afterGuiAttached) === null || _a === void 0 ? void 0 : _a.call(filter, _this.afterGuiAttachedParams);
                if (!((_b = _this.afterGuiAttachedParams) === null || _b === void 0 ? void 0 : _b.suppressFocus) && _this.eGroupFieldSelect && !_this.eGroupFieldSelect.isDisabled()) {
                    _this.eGroupFieldSelect.getFocusableElement().focus();
                }
            });
        });
    };
    GroupFilter.prototype.updateSelectedColumn = function (columnId) {
        var _a, _b;
        if (!columnId) {
            return;
        }
        (_b = (_a = this.selectedFilter) === null || _a === void 0 ? void 0 : _a.afterGuiDetached) === null || _b === void 0 ? void 0 : _b.call(_a);
        var selectedFilterColumnPair = this.getFilterColumnPair(columnId);
        this.selectedColumn = selectedFilterColumnPair === null || selectedFilterColumnPair === void 0 ? void 0 : selectedFilterColumnPair.column;
        this.selectedFilter = selectedFilterColumnPair === null || selectedFilterColumnPair === void 0 ? void 0 : selectedFilterColumnPair.filter;
        this.dispatchEvent({
            type: GroupFilter.EVENT_SELECTED_COLUMN_CHANGED
        });
        this.addUnderlyingFilterElement();
    };
    GroupFilter.prototype.isFilterActive = function () {
        var _a;
        return !!((_a = this.filterColumnPairs) === null || _a === void 0 ? void 0 : _a.some(function (_a) {
            var filter = _a.filter;
            return filter.isFilterActive();
        }));
    };
    GroupFilter.prototype.doesFilterPass = function () {
        return true;
    };
    GroupFilter.prototype.getModel = function () {
        return null;
    };
    GroupFilter.prototype.setModel = function () {
        return core.AgPromise.resolve();
    };
    GroupFilter.prototype.afterGuiAttached = function (params) {
        this.afterGuiAttachedParams = params;
        this.addUnderlyingFilterElement();
    };
    GroupFilter.prototype.afterGuiDetached = function () {
        var _a, _b;
        core._.clearElement(this.eUnderlyingFilter);
        (_b = (_a = this.selectedFilter) === null || _a === void 0 ? void 0 : _a.afterGuiDetached) === null || _b === void 0 ? void 0 : _b.call(_a);
    };
    GroupFilter.prototype.onColumnRowGroupChanged = function () {
        var _this = this;
        this.updateGroups().then(function () {
            _this.dispatchEvent({
                type: GroupFilter.EVENT_COLUMN_ROW_GROUP_CHANGED
            });
            _this.eventService.dispatchEvent({
                type: 'filterAllowedUpdated'
            });
        });
    };
    GroupFilter.prototype.getFilterColumnPair = function (columnId) {
        var _a;
        if (!columnId) {
            return undefined;
        }
        return (_a = this.filterColumnPairs) === null || _a === void 0 ? void 0 : _a.find(function (_a) {
            var column = _a.column;
            return column.getId() === columnId;
        });
    };
    GroupFilter.prototype.getSelectedFilter = function () {
        return this.selectedFilter;
    };
    GroupFilter.prototype.getSelectedColumn = function () {
        return this.selectedColumn;
    };
    GroupFilter.prototype.isFilterAllowed = function () {
        return !!this.selectedColumn;
    };
    GroupFilter.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
    };
    GroupFilter.EVENT_COLUMN_ROW_GROUP_CHANGED = 'columnRowGroupChanged';
    GroupFilter.EVENT_SELECTED_COLUMN_CHANGED = 'selectedColumnChanged';
    __decorate$2([
        core.Autowired('filterManager')
    ], GroupFilter.prototype, "filterManager", void 0);
    __decorate$2([
        core.Autowired('columnModel')
    ], GroupFilter.prototype, "columnModel", void 0);
    __decorate$2([
        core.RefSelector('eGroupField')
    ], GroupFilter.prototype, "eGroupField", void 0);
    __decorate$2([
        core.RefSelector('eUnderlyingFilter')
    ], GroupFilter.prototype, "eUnderlyingFilter", void 0);
    __decorate$2([
        core.PostConstruct
    ], GroupFilter.prototype, "postConstruct", null);
    return GroupFilter;
}(core.TabGuardComp));

var __extends$1 = (undefined && undefined.__extends) || (function () {
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
var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GroupFloatingFilterComp = /** @class */ (function (_super) {
    __extends$1(GroupFloatingFilterComp, _super);
    function GroupFloatingFilterComp() {
        var _this = _super.call(this, /* html */ "\n            <div ref=\"eFloatingFilter\" class=\"ag-group-floating-filter ag-floating-filter-input\" role=\"presentation\"></div>\n        ") || this;
        _this.haveAddedColumnListeners = false;
        return _this;
    }
    GroupFloatingFilterComp.prototype.init = function (params) {
        var _this = this;
        this.params = params;
        // we only support showing the underlying floating filter for multiple group columns
        var canShowUnderlyingFloatingFilter = this.gridOptionsService.get('groupDisplayType') === 'multipleColumns';
        return new core.AgPromise(function (resolve) {
            _this.params.parentFilterInstance(function (parentFilterInstance) {
                _this.parentFilterInstance = parentFilterInstance;
                if (canShowUnderlyingFloatingFilter) {
                    _this.setupUnderlyingFloatingFilterElement().then(function () { return resolve(); });
                }
                else {
                    _this.setupReadOnlyFloatingFilterElement();
                    resolve();
                }
            });
        }).then(function () {
            _this.addManagedListener(_this.parentFilterInstance, GroupFilter.EVENT_SELECTED_COLUMN_CHANGED, function () { return _this.onSelectedColumnChanged(); });
            _this.addManagedListener(_this.parentFilterInstance, GroupFilter.EVENT_COLUMN_ROW_GROUP_CHANGED, function () { return _this.onColumnRowGroupChanged(); });
        });
    };
    GroupFloatingFilterComp.prototype.onParamsUpdated = function (params) {
        this.params = params;
        this.setParams();
    };
    GroupFloatingFilterComp.prototype.setParams = function () {
        var _a;
        var displayName = this.columnModel.getDisplayNameForColumn(this.params.column, 'header', true);
        var translate = this.localeService.getLocaleTextFunc();
        (_a = this.eFloatingFilterText) === null || _a === void 0 ? void 0 : _a.setInputAriaLabel("".concat(displayName, " ").concat(translate('ariaFilterInput', 'Filter Input')));
    };
    GroupFloatingFilterComp.prototype.setupReadOnlyFloatingFilterElement = function () {
        var _this = this;
        if (!this.eFloatingFilterText) {
            this.eFloatingFilterText = this.createManagedBean(new core.AgInputTextField());
            this.eFloatingFilterText
                .setDisabled(true)
                .addGuiEventListener('click', function () { return _this.params.showParentFilter(); });
            this.setParams();
        }
        this.updateDisplayedValue();
        this.eFloatingFilter.appendChild(this.eFloatingFilterText.getGui());
    };
    GroupFloatingFilterComp.prototype.setupUnderlyingFloatingFilterElement = function () {
        var _this = this;
        this.showingUnderlyingFloatingFilter = false;
        this.underlyingFloatingFilter = undefined;
        core._.clearElement(this.eFloatingFilter);
        var column = this.parentFilterInstance.getSelectedColumn();
        // we can only show the underlying filter if there is one instance (e.g. the underlying column is not visible)
        if (column && !column.isVisible()) {
            var compDetails = this.filterManager.getFloatingFilterCompDetails(column, this.params.showParentFilter);
            if (compDetails) {
                this.compDetails = compDetails;
                if (!this.haveAddedColumnListeners) {
                    this.haveAddedColumnListeners = true;
                    this.addManagedListener(column, core.Column.EVENT_VISIBLE_CHANGED, this.onColumnVisibleChanged.bind(this));
                    this.addManagedListener(column, core.Column.EVENT_COL_DEF_CHANGED, this.onColDefChanged.bind(this));
                }
                return compDetails.newAgStackInstance().then(function (floatingFilter) {
                    var _a, _b;
                    _this.underlyingFloatingFilter = floatingFilter;
                    (_a = _this.underlyingFloatingFilter) === null || _a === void 0 ? void 0 : _a.onParentModelChanged((_b = _this.parentFilterInstance.getSelectedFilter()) === null || _b === void 0 ? void 0 : _b.getModel());
                    _this.appendChild(floatingFilter.getGui());
                    _this.showingUnderlyingFloatingFilter = true;
                });
            }
        }
        // fallback to the read-only version
        this.setupReadOnlyFloatingFilterElement();
        return core.AgPromise.resolve();
    };
    GroupFloatingFilterComp.prototype.onColumnVisibleChanged = function () {
        this.setupUnderlyingFloatingFilterElement();
    };
    GroupFloatingFilterComp.prototype.onColDefChanged = function (event) {
        var _a, _b;
        if (!event.column) {
            return;
        }
        var compDetails = this.filterManager.getFloatingFilterCompDetails(event.column, this.params.showParentFilter);
        if (compDetails) {
            (_b = (_a = this.underlyingFloatingFilter) === null || _a === void 0 ? void 0 : _a.onParamsUpdated) === null || _b === void 0 ? void 0 : _b.call(_a, compDetails.params);
        }
    };
    GroupFloatingFilterComp.prototype.onParentModelChanged = function (_model, event) {
        var _a, _b;
        if (this.showingUnderlyingFloatingFilter) {
            (_a = this.underlyingFloatingFilter) === null || _a === void 0 ? void 0 : _a.onParentModelChanged((_b = this.parentFilterInstance.getSelectedFilter()) === null || _b === void 0 ? void 0 : _b.getModel(), event);
        }
        else {
            this.updateDisplayedValue();
        }
    };
    GroupFloatingFilterComp.prototype.updateDisplayedValue = function () {
        if (!this.parentFilterInstance || !this.eFloatingFilterText) {
            return;
        }
        var selectedFilter = this.parentFilterInstance.getSelectedFilter();
        if (!selectedFilter) {
            this.eFloatingFilterText.setValue('');
            this.eFloatingFilterText.setDisplayed(false);
            return;
        }
        this.eFloatingFilterText.setDisplayed(true);
        if (selectedFilter.getModelAsString) {
            var filterModel = selectedFilter.getModel();
            this.eFloatingFilterText.setValue(filterModel == null ? '' : selectedFilter.getModelAsString(filterModel));
        }
        else {
            this.eFloatingFilterText.setValue('');
        }
    };
    GroupFloatingFilterComp.prototype.onSelectedColumnChanged = function () {
        if (!this.showingUnderlyingFloatingFilter) {
            this.updateDisplayedValue();
        }
    };
    GroupFloatingFilterComp.prototype.onColumnRowGroupChanged = function () {
        if (!this.showingUnderlyingFloatingFilter) {
            this.updateDisplayedValue();
        }
    };
    GroupFloatingFilterComp.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
    };
    __decorate$1([
        core.Autowired('columnModel')
    ], GroupFloatingFilterComp.prototype, "columnModel", void 0);
    __decorate$1([
        core.Autowired('filterManager')
    ], GroupFloatingFilterComp.prototype, "filterManager", void 0);
    __decorate$1([
        core.RefSelector('eFloatingFilter')
    ], GroupFloatingFilterComp.prototype, "eFloatingFilter", void 0);
    return GroupFloatingFilterComp;
}(core.Component));

var RowGroupingModule = {
    version: VERSION,
    moduleName: core.ModuleNames.RowGroupingModule,
    beans: [AggregationStage, FilterAggregatesStage, GroupStage, PivotColDefService, PivotStage, AggFuncService],
    agStackComponents: [
        { componentName: 'AgGridHeaderDropZones', componentClass: GridHeaderDropZones }
    ],
    userComponents: [
        { componentName: 'agGroupColumnFilter', componentClass: GroupFilter },
        { componentName: 'agGroupColumnFloatingFilter', componentClass: GroupFloatingFilterComp },
    ],
    dependantModules: [
        core$1.EnterpriseCoreModule
    ]
};

var __extends = (undefined && undefined.__extends) || (function () {
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
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ValuesDropZonePanel = /** @class */ (function (_super) {
    __extends(ValuesDropZonePanel, _super);
    function ValuesDropZonePanel(horizontal) {
        return _super.call(this, horizontal, 'aggregation') || this;
    }
    ValuesDropZonePanel.prototype.passBeansUp = function () {
        _super.prototype.setBeans.call(this, {
            gridOptionsService: this.gridOptionsService,
            eventService: this.eventService,
            context: this.getContext(),
            loggerFactory: this.loggerFactory,
            dragAndDropService: this.dragAndDropService
        });
        var localeTextFunc = this.localeService.getLocaleTextFunc();
        var emptyMessage = localeTextFunc('valueColumnsEmptyMessage', 'Drag here to aggregate');
        var title = localeTextFunc('values', 'Values');
        _super.prototype.init.call(this, {
            dragAndDropIcon: core.DragAndDropService.ICON_AGGREGATE,
            icon: core._.createIconNoSpan('valuePanel', this.gridOptionsService, null),
            emptyMessage: emptyMessage,
            title: title
        });
        this.addManagedListener(this.eventService, core.Events.EVENT_COLUMN_VALUE_CHANGED, this.refreshGui.bind(this));
    };
    ValuesDropZonePanel.prototype.getAriaLabel = function () {
        var translate = this.localeService.getLocaleTextFunc();
        var label = translate('ariaValuesDropZonePanelLabel', 'Values');
        return label;
    };
    ValuesDropZonePanel.prototype.getTooltipParams = function () {
        var res = _super.prototype.getTooltipParams.call(this);
        res.location = 'valueColumnsList';
        return res;
    };
    ValuesDropZonePanel.prototype.getIconName = function () {
        return this.isPotentialDndColumns() ? core.DragAndDropService.ICON_AGGREGATE : core.DragAndDropService.ICON_NOT_ALLOWED;
    };
    ValuesDropZonePanel.prototype.isColumnDroppable = function (column) {
        // we never allow grouping of secondary columns
        if (this.gridOptionsService.get('functionsReadOnly') || !column.isPrimary()) {
            return false;
        }
        return column.isAllowValue() && !column.isValueActive();
    };
    ValuesDropZonePanel.prototype.updateColumns = function (columns) {
        if (this.gridOptionsService.get('functionsPassive')) {
            var event_1 = {
                type: core.Events.EVENT_COLUMN_VALUE_CHANGE_REQUEST,
                columns: columns
            };
            this.eventService.dispatchEvent(event_1);
        }
        else {
            this.columnModel.setValueColumns(columns, "toolPanelUi");
        }
    };
    ValuesDropZonePanel.prototype.getExistingColumns = function () {
        return this.columnModel.getValueColumns();
    };
    __decorate([
        core.Autowired('columnModel')
    ], ValuesDropZonePanel.prototype, "columnModel", void 0);
    __decorate([
        core.Autowired('loggerFactory')
    ], ValuesDropZonePanel.prototype, "loggerFactory", void 0);
    __decorate([
        core.Autowired('dragAndDropService')
    ], ValuesDropZonePanel.prototype, "dragAndDropService", void 0);
    __decorate([
        core.PostConstruct
    ], ValuesDropZonePanel.prototype, "passBeansUp", null);
    return ValuesDropZonePanel;
}(BaseDropZonePanel));

exports.PivotDropZonePanel = PivotDropZonePanel;
exports.RowGroupDropZonePanel = RowGroupDropZonePanel;
exports.RowGroupingModule = RowGroupingModule;
exports.ValuesDropZonePanel = ValuesDropZonePanel;

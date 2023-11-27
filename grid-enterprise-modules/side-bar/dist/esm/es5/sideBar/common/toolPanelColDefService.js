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
import { _, Autowired, Bean, BeanStub, ProvidedColumnGroup } from "@ag-grid-community/core";
var ToolPanelColDefService = /** @class */ (function (_super) {
    __extends(ToolPanelColDefService, _super);
    function ToolPanelColDefService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isColGroupDef = function (colDef) { return colDef && typeof colDef.children !== 'undefined'; };
        _this.getId = function (colDef) {
            return _this.isColGroupDef(colDef) ? colDef.groupId : colDef.colId;
        };
        return _this;
    }
    ToolPanelColDefService.prototype.createColumnTree = function (colDefs) {
        var _this = this;
        var invalidColIds = [];
        var createDummyColGroup = function (abstractColDef, depth) {
            if (_this.isColGroupDef(abstractColDef)) {
                // creating 'dummy' group which is not associated with grid column group
                var groupDef = abstractColDef;
                var groupId = (typeof groupDef.groupId !== 'undefined') ? groupDef.groupId : groupDef.headerName;
                var group = new ProvidedColumnGroup(groupDef, groupId, false, depth);
                var children_1 = [];
                groupDef.children.forEach(function (def) {
                    var child = createDummyColGroup(def, depth + 1);
                    // check column exists in case invalid colDef is supplied for primary column
                    if (child) {
                        children_1.push(child);
                    }
                });
                group.setChildren(children_1);
                return group;
            }
            else {
                var colDef = abstractColDef;
                var key = colDef.colId ? colDef.colId : colDef.field;
                var column = _this.columnModel.getPrimaryColumn(key);
                if (!column) {
                    invalidColIds.push(colDef);
                }
                return column;
            }
        };
        var mappedResults = [];
        colDefs.forEach(function (colDef) {
            var result = createDummyColGroup(colDef, 0);
            if (result) {
                // only return correctly mapped colDef results
                mappedResults.push(result);
            }
        });
        if (invalidColIds.length > 0) {
            console.warn('AG Grid: unable to find grid columns for the supplied colDef(s):', invalidColIds);
        }
        return mappedResults;
    };
    ToolPanelColDefService.prototype.syncLayoutWithGrid = function (syncLayoutCallback) {
        // extract ordered list of leaf path trees (column group hierarchy for each individual leaf column)
        var leafPathTrees = this.getLeafPathTrees();
        // merge leaf path tree taking split column groups into account
        var mergedColumnTrees = this.mergeLeafPathTrees(leafPathTrees);
        // sync layout with merged column trees
        syncLayoutCallback(mergedColumnTrees);
    };
    ToolPanelColDefService.prototype.getLeafPathTrees = function () {
        // leaf tree paths are obtained by walking up the tree starting at a column until we reach the top level group.
        var getLeafPathTree = function (node, childDef) {
            var leafPathTree;
            // build up tree in reverse order
            if (node instanceof ProvidedColumnGroup) {
                if (node.isPadding()) {
                    // skip over padding groups
                    leafPathTree = childDef;
                }
                else {
                    var groupDef = Object.assign({}, node.getColGroupDef());
                    // ensure group contains groupId
                    groupDef.groupId = node.getGroupId();
                    groupDef.children = [childDef];
                    leafPathTree = groupDef;
                }
            }
            else {
                var colDef = Object.assign({}, node.getColDef());
                // ensure col contains colId
                colDef.colId = node.getColId();
                leafPathTree = colDef;
            }
            // walk tree
            var parent = node.getOriginalParent();
            if (parent) {
                // keep walking up the tree until we reach the root
                return getLeafPathTree(parent, leafPathTree);
            }
            else {
                // we have reached the root - exit with resulting leaf path tree
                return leafPathTree;
            }
        };
        // obtain a sorted list of all grid columns
        var allGridColumns = this.columnModel.getAllGridColumns();
        // only primary columns and non row group columns should appear in the tool panel
        var allPrimaryGridColumns = allGridColumns.filter(function (column) {
            var colDef = column.getColDef();
            return column.isPrimary() && !colDef.showRowGroup;
        });
        // construct a leaf path tree for each column
        return allPrimaryGridColumns.map(function (col) { return getLeafPathTree(col, col.getColDef()); });
    };
    ToolPanelColDefService.prototype.mergeLeafPathTrees = function (leafPathTrees) {
        var _this = this;
        var matchingRootGroupIds = function (pathA, pathB) {
            var bothPathsAreGroups = _this.isColGroupDef(pathA) && _this.isColGroupDef(pathB);
            return bothPathsAreGroups && _this.getId(pathA) === _this.getId(pathB);
        };
        var mergeTrees = function (treeA, treeB) {
            if (!_this.isColGroupDef(treeB)) {
                return treeA;
            }
            var mergeResult = treeA;
            var groupToMerge = treeB;
            if (groupToMerge.children && groupToMerge.groupId) {
                var added = _this.addChildrenToGroup(mergeResult, groupToMerge.groupId, groupToMerge.children[0]);
                if (added) {
                    return mergeResult;
                }
            }
            groupToMerge.children.forEach(function (child) { return mergeTrees(mergeResult, child); });
            return mergeResult;
        };
        // we can't just merge the leaf path trees as groups can be split apart - instead only merge if leaf
        // path groups with the same root group id are contiguous.
        var mergeColDefs = [];
        for (var i = 1; i <= leafPathTrees.length; i++) {
            var first = leafPathTrees[i - 1];
            var second = leafPathTrees[i];
            if (matchingRootGroupIds(first, second)) {
                leafPathTrees[i] = mergeTrees(first, second);
            }
            else {
                mergeColDefs.push(first);
            }
        }
        return mergeColDefs;
    };
    ToolPanelColDefService.prototype.addChildrenToGroup = function (tree, groupId, colDef) {
        var _this = this;
        var subGroupIsSplit = function (currentSubGroup, currentSubGroupToAdd) {
            var existingChildIds = currentSubGroup.children.map(_this.getId);
            var childGroupAlreadyExists = _.includes(existingChildIds, _this.getId(currentSubGroupToAdd));
            var lastChild = _.last(currentSubGroup.children);
            var lastChildIsDifferent = lastChild && _this.getId(lastChild) !== _this.getId(currentSubGroupToAdd);
            return childGroupAlreadyExists && lastChildIsDifferent;
        };
        if (!this.isColGroupDef(tree)) {
            return true;
        }
        var currentGroup = tree;
        var groupToAdd = colDef;
        if (subGroupIsSplit(currentGroup, groupToAdd)) {
            currentGroup.children.push(groupToAdd);
            return true;
        }
        if (currentGroup.groupId === groupId) {
            // add children that don't already exist to group
            var existingChildIds = currentGroup.children.map(this.getId);
            var colDefAlreadyPresent = _.includes(existingChildIds, this.getId(groupToAdd));
            if (!colDefAlreadyPresent) {
                currentGroup.children.push(groupToAdd);
                return true;
            }
        }
        // recurse until correct group is found to add children
        currentGroup.children.forEach(function (subGroup) { return _this.addChildrenToGroup(subGroup, groupId, colDef); });
        return false;
    };
    __decorate([
        Autowired('columnModel')
    ], ToolPanelColDefService.prototype, "columnModel", void 0);
    ToolPanelColDefService = __decorate([
        Bean('toolPanelColDefService')
    ], ToolPanelColDefService);
    return ToolPanelColDefService;
}(BeanStub));
export { ToolPanelColDefService };

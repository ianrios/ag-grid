/**
          * @ag-grid-community/csv-export - Advanced Data Grid / Data Table supporting Javascript / Typescript / React / Angular / Vue * @version v31.0.0
          * @link https://www.ag-grid.com/
          * @license MIT
          */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@ag-grid-community/core');

var BaseCreator = /** @class */ (function () {
    function BaseCreator() {
    }
    BaseCreator.prototype.setBeans = function (beans) {
        this.beans = beans;
    };
    BaseCreator.prototype.getFileName = function (fileName) {
        var extension = this.getDefaultFileExtension();
        if (fileName == null || !fileName.length) {
            fileName = this.getDefaultFileName();
        }
        return fileName.indexOf('.') === -1 ? "".concat(fileName, ".").concat(extension) : fileName;
    };
    BaseCreator.prototype.getData = function (params) {
        var serializingSession = this.createSerializingSession(params);
        var data = this.beans.gridSerializer.serialize(serializingSession, params);
        return data;
    };
    BaseCreator.prototype.getDefaultFileName = function () {
        return "export.".concat(this.getDefaultFileExtension());
    };
    return BaseCreator;
}());

var BaseGridSerializingSession = /** @class */ (function () {
    function BaseGridSerializingSession(config) {
        this.groupColumns = [];
        var columnModel = config.columnModel, valueService = config.valueService, gridOptionsService = config.gridOptionsService, valueFormatterService = config.valueFormatterService, valueParserService = config.valueParserService, processCellCallback = config.processCellCallback, processHeaderCallback = config.processHeaderCallback, processGroupHeaderCallback = config.processGroupHeaderCallback, processRowGroupCallback = config.processRowGroupCallback;
        this.columnModel = columnModel;
        this.valueService = valueService;
        this.gridOptionsService = gridOptionsService;
        this.valueFormatterService = valueFormatterService;
        this.valueParserService = valueParserService;
        this.processCellCallback = processCellCallback;
        this.processHeaderCallback = processHeaderCallback;
        this.processGroupHeaderCallback = processGroupHeaderCallback;
        this.processRowGroupCallback = processRowGroupCallback;
    }
    BaseGridSerializingSession.prototype.prepare = function (columnsToExport) {
        this.groupColumns = columnsToExport.filter(function (col) { return !!col.getColDef().showRowGroup; });
    };
    BaseGridSerializingSession.prototype.extractHeaderValue = function (column) {
        var value = this.getHeaderName(this.processHeaderCallback, column);
        return value != null ? value : '';
    };
    BaseGridSerializingSession.prototype.extractRowCellValue = function (column, index, accumulatedRowIndex, type, node) {
        // we render the group summary text e.g. "-> Parent -> Child"...
        var hideOpenParents = this.gridOptionsService.get('groupHideOpenParents');
        var value = ((!hideOpenParents || node.footer) && this.shouldRenderGroupSummaryCell(node, column, index))
            ? this.createValueForGroupNode(node)
            : this.valueService.getValue(column, node);
        var processedValue = this.processCell({
            accumulatedRowIndex: accumulatedRowIndex,
            rowNode: node,
            column: column,
            value: value,
            processCellCallback: this.processCellCallback,
            type: type
        });
        return processedValue;
    };
    BaseGridSerializingSession.prototype.shouldRenderGroupSummaryCell = function (node, column, currentColumnIndex) {
        var _a;
        var isGroupNode = node && node.group;
        // only on group rows
        if (!isGroupNode) {
            return false;
        }
        var currentColumnGroupIndex = this.groupColumns.indexOf(column);
        if (currentColumnGroupIndex !== -1) {
            if (((_a = node.groupData) === null || _a === void 0 ? void 0 : _a[column.getId()]) != null) {
                return true;
            }
            if (this.gridOptionsService.isRowModelType('serverSide') && node.group) {
                return true;
            }
            // if this is a top level footer, always render`Total` in the left-most cell
            if (node.footer && node.level === -1) {
                var colDef = column.getColDef();
                var isFullWidth = colDef == null || colDef.showRowGroup === true;
                return isFullWidth || colDef.showRowGroup === this.columnModel.getRowGroupColumns()[0].getId();
            }
        }
        var isGroupUseEntireRow = this.gridOptionsService.isGroupUseEntireRow(this.columnModel.isPivotMode());
        return currentColumnIndex === 0 && isGroupUseEntireRow;
    };
    BaseGridSerializingSession.prototype.getHeaderName = function (callback, column) {
        if (callback) {
            return callback({
                column: column,
                api: this.gridOptionsService.api,
                columnApi: this.gridOptionsService.columnApi,
                context: this.gridOptionsService.context
            });
        }
        return this.columnModel.getDisplayNameForColumn(column, 'csv', true);
    };
    BaseGridSerializingSession.prototype.createValueForGroupNode = function (node) {
        if (this.processRowGroupCallback) {
            return this.processRowGroupCallback({
                node: node,
                api: this.gridOptionsService.api,
                columnApi: this.gridOptionsService.columnApi,
                context: this.gridOptionsService.context,
            });
        }
        var isFooter = node.footer;
        var keys = [node.key];
        if (!this.gridOptionsService.isGroupMultiAutoColumn()) {
            while (node.parent) {
                node = node.parent;
                keys.push(node.key);
            }
        }
        var groupValue = keys.reverse().join(' -> ');
        return isFooter ? "Total ".concat(groupValue) : groupValue;
    };
    BaseGridSerializingSession.prototype.processCell = function (params) {
        var _this = this;
        var _a;
        var accumulatedRowIndex = params.accumulatedRowIndex, rowNode = params.rowNode, column = params.column, value = params.value, processCellCallback = params.processCellCallback, type = params.type;
        if (processCellCallback) {
            return {
                value: (_a = processCellCallback({
                    accumulatedRowIndex: accumulatedRowIndex,
                    column: column,
                    node: rowNode,
                    value: value,
                    api: this.gridOptionsService.api,
                    columnApi: this.gridOptionsService.columnApi,
                    context: this.gridOptionsService.context,
                    type: type,
                    parseValue: function (valueToParse) { return _this.valueParserService.parseValue(column, rowNode, valueToParse, _this.valueService.getValue(column, rowNode)); },
                    formatValue: function (valueToFormat) { var _a; return (_a = _this.valueFormatterService.formatValue(column, rowNode, valueToFormat)) !== null && _a !== void 0 ? _a : valueToFormat; }
                })) !== null && _a !== void 0 ? _a : ''
            };
        }
        if (column.getColDef().useValueFormatterForExport !== false) {
            return {
                value: value !== null && value !== void 0 ? value : '',
                valueFormatted: this.valueFormatterService.formatValue(column, rowNode, value),
            };
        }
        return { value: value !== null && value !== void 0 ? value : '' };
    };
    return BaseGridSerializingSession;
}());

var Downloader = /** @class */ (function () {
    function Downloader() {
    }
    Downloader.download = function (fileName, content) {
        var win = document.defaultView || window;
        if (!win) {
            console.warn('AG Grid: There is no `window` associated with the current `document`');
            return;
        }
        var element = document.createElement('a');
        // @ts-ignore
        var url = win.URL.createObjectURL(content);
        element.setAttribute('href', url);
        element.setAttribute('download', fileName);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.dispatchEvent(new MouseEvent('click', {
            bubbles: false,
            cancelable: true,
            view: win
        }));
        document.body.removeChild(element);
        win.setTimeout(function () {
            // @ts-ignore
            win.URL.revokeObjectURL(url);
        }, 0);
    };
    return Downloader;
}());

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
var LINE_SEPARATOR$1 = '\r\n';
var CsvSerializingSession = /** @class */ (function (_super) {
    __extends$2(CsvSerializingSession, _super);
    function CsvSerializingSession(config) {
        var _this = _super.call(this, config) || this;
        _this.isFirstLine = true;
        _this.result = '';
        var suppressQuotes = config.suppressQuotes, columnSeparator = config.columnSeparator;
        _this.suppressQuotes = suppressQuotes;
        _this.columnSeparator = columnSeparator;
        return _this;
    }
    CsvSerializingSession.prototype.addCustomContent = function (content) {
        var _this = this;
        if (!content) {
            return;
        }
        if (typeof content === 'string') {
            if (!/^\s*\n/.test(content)) {
                this.beginNewLine();
            }
            // replace whatever newlines are supplied with the style we're using
            content = content.replace(/\r?\n/g, LINE_SEPARATOR$1);
            this.result += content;
        }
        else {
            content.forEach(function (row) {
                _this.beginNewLine();
                row.forEach(function (cell, index) {
                    if (index !== 0) {
                        _this.result += _this.columnSeparator;
                    }
                    _this.result += _this.putInQuotes(cell.data.value || '');
                    if (cell.mergeAcross) {
                        _this.appendEmptyCells(cell.mergeAcross);
                    }
                });
            });
        }
    };
    CsvSerializingSession.prototype.onNewHeaderGroupingRow = function () {
        this.beginNewLine();
        return {
            onColumn: this.onNewHeaderGroupingRowColumn.bind(this)
        };
    };
    CsvSerializingSession.prototype.onNewHeaderGroupingRowColumn = function (columnGroup, header, index, span) {
        if (index != 0) {
            this.result += this.columnSeparator;
        }
        this.result += this.putInQuotes(header);
        this.appendEmptyCells(span);
    };
    CsvSerializingSession.prototype.appendEmptyCells = function (count) {
        for (var i = 1; i <= count; i++) {
            this.result += this.columnSeparator + this.putInQuotes("");
        }
    };
    CsvSerializingSession.prototype.onNewHeaderRow = function () {
        this.beginNewLine();
        return {
            onColumn: this.onNewHeaderRowColumn.bind(this)
        };
    };
    CsvSerializingSession.prototype.onNewHeaderRowColumn = function (column, index) {
        if (index != 0) {
            this.result += this.columnSeparator;
        }
        this.result += this.putInQuotes(this.extractHeaderValue(column));
    };
    CsvSerializingSession.prototype.onNewBodyRow = function () {
        this.beginNewLine();
        return {
            onColumn: this.onNewBodyRowColumn.bind(this)
        };
    };
    CsvSerializingSession.prototype.onNewBodyRowColumn = function (column, index, node) {
        var _a;
        if (index != 0) {
            this.result += this.columnSeparator;
        }
        var rowCellValue = this.extractRowCellValue(column, index, index, 'csv', node);
        this.result += this.putInQuotes((_a = rowCellValue.valueFormatted) !== null && _a !== void 0 ? _a : rowCellValue.value);
    };
    CsvSerializingSession.prototype.putInQuotes = function (value) {
        if (this.suppressQuotes) {
            return value;
        }
        if (value === null || value === undefined) {
            return '""';
        }
        var stringValue;
        if (typeof value === 'string') {
            stringValue = value;
        }
        else if (typeof value.toString === 'function') {
            stringValue = value.toString();
        }
        else {
            console.warn('AG Grid: unknown value type during csv conversion');
            stringValue = '';
        }
        // replace each " with "" (ie two sets of double quotes is how to do double quotes in csv)
        var valueEscaped = stringValue.replace(/"/g, "\"\"");
        return '"' + valueEscaped + '"';
    };
    CsvSerializingSession.prototype.parse = function () {
        return this.result;
    };
    CsvSerializingSession.prototype.beginNewLine = function () {
        if (!this.isFirstLine) {
            this.result += LINE_SEPARATOR$1;
        }
        this.isFirstLine = false;
    };
    return CsvSerializingSession;
}(BaseGridSerializingSession));

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
var CsvCreator = /** @class */ (function (_super) {
    __extends$1(CsvCreator, _super);
    function CsvCreator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CsvCreator.prototype.postConstruct = function () {
        this.setBeans({
            gridSerializer: this.gridSerializer,
            gridOptionsService: this.gridOptionsService
        });
    };
    CsvCreator.prototype.getMergedParams = function (params) {
        var baseParams = this.gridOptionsService.get('defaultCsvExportParams');
        return Object.assign({}, baseParams, params);
    };
    CsvCreator.prototype.export = function (userParams) {
        if (this.isExportSuppressed()) {
            console.warn("AG Grid: Export cancelled. Export is not allowed as per your configuration.");
            return '';
        }
        var mergedParams = this.getMergedParams(userParams);
        var data = this.getData(mergedParams);
        var packagedFile = new Blob(["\ufeff", data], { type: 'text/plain' });
        Downloader.download(this.getFileName(mergedParams.fileName), packagedFile);
        return data;
    };
    CsvCreator.prototype.exportDataAsCsv = function (params) {
        return this.export(params);
    };
    CsvCreator.prototype.getDataAsCsv = function (params, skipDefaultParams) {
        if (skipDefaultParams === void 0) { skipDefaultParams = false; }
        var mergedParams = skipDefaultParams
            ? Object.assign({}, params)
            : this.getMergedParams(params);
        return this.getData(mergedParams);
    };
    CsvCreator.prototype.getDefaultFileExtension = function () {
        return 'csv';
    };
    CsvCreator.prototype.createSerializingSession = function (params) {
        var _a = this, columnModel = _a.columnModel, valueService = _a.valueService, gridOptionsService = _a.gridOptionsService, valueFormatterService = _a.valueFormatterService, valueParserService = _a.valueParserService;
        var _b = params, processCellCallback = _b.processCellCallback, processHeaderCallback = _b.processHeaderCallback, processGroupHeaderCallback = _b.processGroupHeaderCallback, processRowGroupCallback = _b.processRowGroupCallback, suppressQuotes = _b.suppressQuotes, columnSeparator = _b.columnSeparator;
        return new CsvSerializingSession({
            columnModel: columnModel,
            valueService: valueService,
            gridOptionsService: gridOptionsService,
            valueFormatterService: valueFormatterService,
            valueParserService: valueParserService,
            processCellCallback: processCellCallback || undefined,
            processHeaderCallback: processHeaderCallback || undefined,
            processGroupHeaderCallback: processGroupHeaderCallback || undefined,
            processRowGroupCallback: processRowGroupCallback || undefined,
            suppressQuotes: suppressQuotes || false,
            columnSeparator: columnSeparator || ','
        });
    };
    CsvCreator.prototype.isExportSuppressed = function () {
        return this.gridOptionsService.get('suppressCsvExport');
    };
    __decorate$1([
        core.Autowired('columnModel')
    ], CsvCreator.prototype, "columnModel", void 0);
    __decorate$1([
        core.Autowired('valueService')
    ], CsvCreator.prototype, "valueService", void 0);
    __decorate$1([
        core.Autowired('gridSerializer')
    ], CsvCreator.prototype, "gridSerializer", void 0);
    __decorate$1([
        core.Autowired('gridOptionsService')
    ], CsvCreator.prototype, "gridOptionsService", void 0);
    __decorate$1([
        core.Autowired('valueFormatterService')
    ], CsvCreator.prototype, "valueFormatterService", void 0);
    __decorate$1([
        core.Autowired('valueParserService')
    ], CsvCreator.prototype, "valueParserService", void 0);
    __decorate$1([
        core.PostConstruct
    ], CsvCreator.prototype, "postConstruct", null);
    CsvCreator = __decorate$1([
        core.Bean('csvCreator')
    ], CsvCreator);
    return CsvCreator;
}(BaseCreator));

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
exports.RowType = void 0;
(function (RowType) {
    RowType[RowType["HEADER_GROUPING"] = 0] = "HEADER_GROUPING";
    RowType[RowType["HEADER"] = 1] = "HEADER";
    RowType[RowType["BODY"] = 2] = "BODY";
})(exports.RowType || (exports.RowType = {}));
var GridSerializer = /** @class */ (function (_super) {
    __extends(GridSerializer, _super);
    function GridSerializer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GridSerializer.prototype.serialize = function (gridSerializingSession, params) {
        if (params === void 0) { params = {}; }
        var allColumns = params.allColumns, columnKeys = params.columnKeys, skipRowGroups = params.skipRowGroups;
        var columnsToExport = this.getColumnsToExport(allColumns, skipRowGroups, columnKeys);
        var serializeChain = core._.compose(
        // first pass, put in the header names of the cols
        this.prepareSession(columnsToExport), this.prependContent(params), this.exportColumnGroups(params, columnsToExport), this.exportHeaders(params, columnsToExport), this.processPinnedTopRows(params, columnsToExport), this.processRows(params, columnsToExport), this.processPinnedBottomRows(params, columnsToExport), this.appendContent(params));
        return serializeChain(gridSerializingSession).parse();
    };
    GridSerializer.prototype.processRow = function (gridSerializingSession, params, columnsToExport, node) {
        var rowSkipper = params.shouldRowBeSkipped || (function () { return false; });
        var context = this.gridOptionsService.context;
        var api = this.gridOptionsService.api;
        var columnApi = this.gridOptionsService.columnApi;
        var skipSingleChildrenGroup = this.gridOptionsService.get('groupRemoveSingleChildren');
        var skipLowestSingleChildrenGroup = this.gridOptionsService.get('groupRemoveLowestSingleChildren');
        // if onlySelected, we ignore groupHideOpenParents as the user has explicitly selected the rows they wish to export.
        // similarly, if specific rowNodes are provided we do the same. (the clipboard service uses rowNodes to define which rows to export)
        var isClipboardExport = params.rowPositions != null;
        var isExplicitExportSelection = isClipboardExport || !!params.onlySelected;
        var hideOpenParents = this.gridOptionsService.get('groupHideOpenParents') && !isExplicitExportSelection;
        var isLeafNode = this.columnModel.isPivotMode() ? node.leafGroup : !node.group;
        var isFooter = !!node.footer;
        params.skipRowGroups;
        var shouldSkipLowestGroup = skipLowestSingleChildrenGroup && node.leafGroup;
        var shouldSkipCurrentGroup = node.allChildrenCount === 1 && (skipSingleChildrenGroup || shouldSkipLowestGroup);
        if ((!isLeafNode && !isFooter && (params.skipRowGroups || shouldSkipCurrentGroup || hideOpenParents)) ||
            (params.onlySelected && !node.isSelected()) ||
            (params.skipPinnedTop && node.rowPinned === 'top') ||
            (params.skipPinnedBottom && node.rowPinned === 'bottom')) {
            return;
        }
        // if we are in pivotMode, then the grid will show the root node only
        // if it's not a leaf group
        var nodeIsRootNode = node.level === -1;
        if (nodeIsRootNode && !isLeafNode && !isFooter) {
            return;
        }
        var shouldRowBeSkipped = rowSkipper({ node: node, api: api, columnApi: columnApi, context: context });
        if (shouldRowBeSkipped) {
            return;
        }
        var rowAccumulator = gridSerializingSession.onNewBodyRow(node);
        columnsToExport.forEach(function (column, index) {
            rowAccumulator.onColumn(column, index, node);
        });
        if (params.getCustomContentBelowRow) {
            var content = params.getCustomContentBelowRow({ node: node, api: api, columnApi: columnApi, context: context });
            if (content) {
                gridSerializingSession.addCustomContent(content);
            }
        }
    };
    GridSerializer.prototype.appendContent = function (params) {
        return function (gridSerializingSession) {
            var appendContent = params.appendContent;
            if (appendContent) {
                gridSerializingSession.addCustomContent(appendContent);
            }
            return gridSerializingSession;
        };
    };
    GridSerializer.prototype.prependContent = function (params) {
        return function (gridSerializingSession) {
            var prependContent = params.prependContent;
            if (prependContent) {
                gridSerializingSession.addCustomContent(prependContent);
            }
            return gridSerializingSession;
        };
    };
    GridSerializer.prototype.prepareSession = function (columnsToExport) {
        return function (gridSerializingSession) {
            gridSerializingSession.prepare(columnsToExport);
            return gridSerializingSession;
        };
    };
    GridSerializer.prototype.exportColumnGroups = function (params, columnsToExport) {
        var _this = this;
        return function (gridSerializingSession) {
            if (!params.skipColumnGroupHeaders) {
                var groupInstanceIdCreator = new core.GroupInstanceIdCreator();
                var displayedGroups = _this.displayedGroupCreator.createDisplayedGroups(columnsToExport, groupInstanceIdCreator, null);
                _this.recursivelyAddHeaderGroups(displayedGroups, gridSerializingSession, params.processGroupHeaderCallback);
            }
            return gridSerializingSession;
        };
    };
    GridSerializer.prototype.exportHeaders = function (params, columnsToExport) {
        return function (gridSerializingSession) {
            if (!params.skipColumnHeaders) {
                var gridRowIterator_1 = gridSerializingSession.onNewHeaderRow();
                columnsToExport.forEach(function (column, index) {
                    gridRowIterator_1.onColumn(column, index, undefined);
                });
            }
            return gridSerializingSession;
        };
    };
    GridSerializer.prototype.processPinnedTopRows = function (params, columnsToExport) {
        var _this = this;
        return function (gridSerializingSession) {
            var processRow = _this.processRow.bind(_this, gridSerializingSession, params, columnsToExport);
            if (params.rowPositions) {
                params.rowPositions
                    // only pinnedTop rows, other models are processed by `processRows` and `processPinnedBottomsRows`
                    .filter(function (position) { return position.rowPinned === 'top'; })
                    .sort(function (a, b) { return a.rowIndex - b.rowIndex; })
                    .map(function (position) { return _this.pinnedRowModel.getPinnedTopRow(position.rowIndex); })
                    .forEach(processRow);
            }
            else {
                _this.pinnedRowModel.forEachPinnedTopRow(processRow);
            }
            return gridSerializingSession;
        };
    };
    GridSerializer.prototype.processRows = function (params, columnsToExport) {
        var _this = this;
        return function (gridSerializingSession) {
            // when in pivot mode, we always render cols on screen, never 'all columns'
            var rowModel = _this.rowModel;
            var rowModelType = rowModel.getType();
            var usingCsrm = rowModelType === 'clientSide';
            var usingSsrm = rowModelType === 'serverSide';
            var onlySelectedNonStandardModel = !usingCsrm && params.onlySelected;
            var processRow = _this.processRow.bind(_this, gridSerializingSession, params, columnsToExport);
            var _a = params.exportedRows, exportedRows = _a === void 0 ? 'filteredAndSorted' : _a;
            if (params.rowPositions) {
                params.rowPositions
                    // pinnedRows are processed by `processPinnedTopRows` and `processPinnedBottomsRows`
                    .filter(function (position) { return position.rowPinned == null; })
                    .sort(function (a, b) { return a.rowIndex - b.rowIndex; })
                    .map(function (position) { return rowModel.getRow(position.rowIndex); })
                    .forEach(processRow);
            }
            else if (_this.columnModel.isPivotMode()) {
                if (usingCsrm) {
                    rowModel.forEachPivotNode(processRow, true);
                }
                else if (usingSsrm) {
                    rowModel.forEachNodeAfterFilterAndSort(processRow, true);
                }
                else {
                    // must be enterprise, so we can just loop through all the nodes
                    rowModel.forEachNode(processRow);
                }
            }
            else {
                // onlySelectedAllPages: user doing pagination and wants selected items from
                // other pages, so cannot use the standard row model as it won't have rows from
                // other pages.
                // onlySelectedNonStandardModel: if user wants selected in non standard row model
                // (eg viewport) then again RowModel cannot be used, so need to use selected instead.
                if (params.onlySelectedAllPages || onlySelectedNonStandardModel) {
                    var selectedNodes = _this.selectionService.getSelectedNodes();
                    _this.replicateSortedOrder(selectedNodes);
                    // serialize each node
                    selectedNodes.forEach(processRow);
                }
                else {
                    // here is everything else - including standard row model and selected. we don't use
                    // the selection model even when just using selected, so that the result is the order
                    // of the rows appearing on the screen.
                    if (exportedRows === 'all') {
                        rowModel.forEachNode(processRow);
                    }
                    else if (usingCsrm) {
                        rowModel.forEachNodeAfterFilterAndSort(processRow, true);
                    }
                    else if (usingSsrm) {
                        rowModel.forEachNodeAfterFilterAndSort(processRow, true);
                    }
                    else {
                        rowModel.forEachNode(processRow);
                    }
                }
            }
            return gridSerializingSession;
        };
    };
    GridSerializer.prototype.replicateSortedOrder = function (rows) {
        var _this = this;
        var sortOptions = this.sortController.getSortOptions();
        var compareNodes = function (rowA, rowB) {
            var _a, _b, _c, _d;
            if (rowA.rowIndex != null && rowB.rowIndex != null) {
                // if the rows have rowIndexes, this is the easiest way to compare,
                // as they're already ordered
                return rowA.rowIndex - rowB.rowIndex;
            }
            // if the level is the same, compare these nodes, or their parents
            if (rowA.level === rowB.level) {
                if (((_a = rowA.parent) === null || _a === void 0 ? void 0 : _a.id) === ((_b = rowB.parent) === null || _b === void 0 ? void 0 : _b.id)) {
                    return _this.rowNodeSorter.compareRowNodes(sortOptions, {
                        rowNode: rowA,
                        currentPos: (_c = rowA.rowIndex) !== null && _c !== void 0 ? _c : -1,
                    }, {
                        rowNode: rowB,
                        currentPos: (_d = rowB.rowIndex) !== null && _d !== void 0 ? _d : -1,
                    });
                }
                // level is same, but parent isn't, compare parents
                return compareNodes(rowA.parent, rowB.parent);
            }
            // if level is different, match levels
            if (rowA.level > rowB.level) {
                return compareNodes(rowA.parent, rowB);
            }
            return compareNodes(rowA, rowB.parent);
        };
        // sort the nodes either by existing row index or compare them
        rows.sort(compareNodes);
    };
    GridSerializer.prototype.processPinnedBottomRows = function (params, columnsToExport) {
        var _this = this;
        return function (gridSerializingSession) {
            var processRow = _this.processRow.bind(_this, gridSerializingSession, params, columnsToExport);
            if (params.rowPositions) {
                params.rowPositions
                    // only pinnedBottom rows, other models are processed by `processRows` and `processPinnedTopRows`
                    .filter(function (position) { return position.rowPinned === 'bottom'; })
                    .sort(function (a, b) { return a.rowIndex - b.rowIndex; })
                    .map(function (position) { return _this.pinnedRowModel.getPinnedBottomRow(position.rowIndex); })
                    .forEach(processRow);
            }
            else {
                _this.pinnedRowModel.forEachPinnedBottomRow(processRow);
            }
            return gridSerializingSession;
        };
    };
    GridSerializer.prototype.getColumnsToExport = function (allColumns, skipRowGroups, columnKeys) {
        if (allColumns === void 0) { allColumns = false; }
        if (skipRowGroups === void 0) { skipRowGroups = false; }
        var isPivotMode = this.columnModel.isPivotMode();
        if (columnKeys && columnKeys.length) {
            return this.columnModel.getGridColumns(columnKeys);
        }
        var isTreeData = this.gridOptionsService.get('treeData');
        var columnsToExport = [];
        if (allColumns && !isPivotMode) {
            // add auto group column for tree data
            var columns = isTreeData
                ? this.columnModel.getGridColumns([core.GROUP_AUTO_COLUMN_ID])
                : [];
            columnsToExport = columns.concat(this.columnModel.getAllGridColumns());
        }
        else {
            columnsToExport = this.columnModel.getAllDisplayedColumns();
        }
        if (skipRowGroups && !isTreeData) {
            columnsToExport = columnsToExport.filter(function (column) { return column.getColId() !== core.GROUP_AUTO_COLUMN_ID; });
        }
        return columnsToExport;
    };
    GridSerializer.prototype.recursivelyAddHeaderGroups = function (displayedGroups, gridSerializingSession, processGroupHeaderCallback) {
        var directChildrenHeaderGroups = [];
        displayedGroups.forEach(function (columnGroupChild) {
            var columnGroup = columnGroupChild;
            if (!columnGroup.getChildren) {
                return;
            }
            columnGroup.getChildren().forEach(function (it) { return directChildrenHeaderGroups.push(it); });
        });
        if (displayedGroups.length > 0 && displayedGroups[0] instanceof core.ColumnGroup) {
            this.doAddHeaderHeader(gridSerializingSession, displayedGroups, processGroupHeaderCallback);
        }
        if (directChildrenHeaderGroups && directChildrenHeaderGroups.length > 0) {
            this.recursivelyAddHeaderGroups(directChildrenHeaderGroups, gridSerializingSession, processGroupHeaderCallback);
        }
    };
    GridSerializer.prototype.doAddHeaderHeader = function (gridSerializingSession, displayedGroups, processGroupHeaderCallback) {
        var _this = this;
        var gridRowIterator = gridSerializingSession.onNewHeaderGroupingRow();
        var columnIndex = 0;
        displayedGroups.forEach(function (columnGroupChild) {
            var columnGroup = columnGroupChild;
            var name;
            if (processGroupHeaderCallback) {
                name = processGroupHeaderCallback({
                    columnGroup: columnGroup,
                    api: _this.gridOptionsService.api,
                    columnApi: _this.gridOptionsService.columnApi,
                    context: _this.gridOptionsService.context
                });
            }
            else {
                name = _this.columnModel.getDisplayNameForColumnGroup(columnGroup, 'header');
            }
            var collapsibleGroupRanges = columnGroup.getLeafColumns().reduce(function (collapsibleGroups, currentColumn, currentIdx, arr) {
                var lastGroup = core._.last(collapsibleGroups);
                var groupShow = currentColumn.getColumnGroupShow() === 'open';
                if (!groupShow) {
                    if (lastGroup && lastGroup[1] == null) {
                        lastGroup[1] = currentIdx - 1;
                    }
                }
                else if (!lastGroup || lastGroup[1] != null) {
                    lastGroup = [currentIdx];
                    collapsibleGroups.push(lastGroup);
                }
                if (currentIdx === arr.length - 1 && lastGroup && lastGroup[1] == null) {
                    lastGroup[1] = currentIdx;
                }
                return collapsibleGroups;
            }, []);
            gridRowIterator.onColumn(columnGroup, name || '', columnIndex++, columnGroup.getLeafColumns().length - 1, collapsibleGroupRanges);
        });
    };
    __decorate([
        core.Autowired('displayedGroupCreator')
    ], GridSerializer.prototype, "displayedGroupCreator", void 0);
    __decorate([
        core.Autowired('columnModel')
    ], GridSerializer.prototype, "columnModel", void 0);
    __decorate([
        core.Autowired('rowModel')
    ], GridSerializer.prototype, "rowModel", void 0);
    __decorate([
        core.Autowired('pinnedRowModel')
    ], GridSerializer.prototype, "pinnedRowModel", void 0);
    __decorate([
        core.Autowired('selectionService')
    ], GridSerializer.prototype, "selectionService", void 0);
    __decorate([
        core.Autowired('rowNodeSorter')
    ], GridSerializer.prototype, "rowNodeSorter", void 0);
    __decorate([
        core.Autowired('sortController')
    ], GridSerializer.prototype, "sortController", void 0);
    GridSerializer = __decorate([
        core.Bean("gridSerializer")
    ], GridSerializer);
    return GridSerializer;
}(core.BeanStub));

// DO NOT UPDATE MANUALLY: Generated from script during build time
var VERSION = '31.0.0';

var CsvExportModule = {
    version: VERSION,
    moduleName: core.ModuleNames.CsvExportModule,
    beans: [CsvCreator, GridSerializer]
};

var LINE_SEPARATOR = '\r\n';
var XmlFactory = /** @class */ (function () {
    function XmlFactory() {
    }
    XmlFactory.createHeader = function (headerElement) {
        if (headerElement === void 0) { headerElement = {}; }
        var headerStart = '<?';
        var headerEnd = '?>';
        var keys = ['version'];
        if (!headerElement.version) {
            headerElement.version = "1.0";
        }
        if (headerElement.encoding) {
            keys.push('encoding');
        }
        if (headerElement.standalone) {
            keys.push('standalone');
        }
        var att = keys.map(function (key) { return "".concat(key, "=\"").concat(headerElement[key], "\""); }).join(' ');
        return "".concat(headerStart, "xml ").concat(att, " ").concat(headerEnd);
    };
    XmlFactory.createXml = function (xmlElement, booleanTransformer) {
        var _this = this;
        var props = '';
        if (xmlElement.properties) {
            if (xmlElement.properties.prefixedAttributes) {
                xmlElement.properties.prefixedAttributes.forEach(function (prefixedSet) {
                    Object.keys(prefixedSet.map).forEach(function (key) {
                        props += _this.returnAttributeIfPopulated(prefixedSet.prefix + key, prefixedSet.map[key], booleanTransformer);
                    });
                });
            }
            if (xmlElement.properties.rawMap) {
                Object.keys(xmlElement.properties.rawMap).forEach(function (key) {
                    props += _this.returnAttributeIfPopulated(key, xmlElement.properties.rawMap[key], booleanTransformer);
                });
            }
        }
        var result = '<' + xmlElement.name + props;
        if (!xmlElement.children && xmlElement.textNode == null) {
            return result + '/>' + LINE_SEPARATOR;
        }
        if (xmlElement.textNode != null) {
            return result + '>' + xmlElement.textNode + '</' + xmlElement.name + '>' + LINE_SEPARATOR;
        }
        result += '>' + LINE_SEPARATOR;
        if (xmlElement.children) {
            xmlElement.children.forEach(function (it) {
                result += _this.createXml(it, booleanTransformer);
            });
        }
        return result + '</' + xmlElement.name + '>' + LINE_SEPARATOR;
    };
    XmlFactory.returnAttributeIfPopulated = function (key, value, booleanTransformer) {
        if (!value && value !== '' && value !== 0) {
            return '';
        }
        var xmlValue = value;
        if ((typeof (value) === 'boolean')) {
            if (booleanTransformer) {
                xmlValue = booleanTransformer(value);
            }
        }
        return " ".concat(key, "=\"").concat(xmlValue, "\"");
    };
    return XmlFactory;
}());

var __values = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
// table for crc calculation
// from: https://referencesource.microsoft.com/#System/sys/System/IO/compression/Crc32Helper.cs,3b31978c7d7f7246,references
var crcTable = new Uint32Array([
    0x00000000, 0x77073096, 0xee0e612c, 0x990951ba, 0x076dc419, 0x706af48f,
    0xe963a535, 0x9e6495a3, 0x0edb8832, 0x79dcb8a4, 0xe0d5e91e, 0x97d2d988,
    0x09b64c2b, 0x7eb17cbd, 0xe7b82d07, 0x90bf1d91, 0x1db71064, 0x6ab020f2,
    0xf3b97148, 0x84be41de, 0x1adad47d, 0x6ddde4eb, 0xf4d4b551, 0x83d385c7,
    0x136c9856, 0x646ba8c0, 0xfd62f97a, 0x8a65c9ec, 0x14015c4f, 0x63066cd9,
    0xfa0f3d63, 0x8d080df5, 0x3b6e20c8, 0x4c69105e, 0xd56041e4, 0xa2677172,
    0x3c03e4d1, 0x4b04d447, 0xd20d85fd, 0xa50ab56b, 0x35b5a8fa, 0x42b2986c,
    0xdbbbc9d6, 0xacbcf940, 0x32d86ce3, 0x45df5c75, 0xdcd60dcf, 0xabd13d59,
    0x26d930ac, 0x51de003a, 0xc8d75180, 0xbfd06116, 0x21b4f4b5, 0x56b3c423,
    0xcfba9599, 0xb8bda50f, 0x2802b89e, 0x5f058808, 0xc60cd9b2, 0xb10be924,
    0x2f6f7c87, 0x58684c11, 0xc1611dab, 0xb6662d3d, 0x76dc4190, 0x01db7106,
    0x98d220bc, 0xefd5102a, 0x71b18589, 0x06b6b51f, 0x9fbfe4a5, 0xe8b8d433,
    0x7807c9a2, 0x0f00f934, 0x9609a88e, 0xe10e9818, 0x7f6a0dbb, 0x086d3d2d,
    0x91646c97, 0xe6635c01, 0x6b6b51f4, 0x1c6c6162, 0x856530d8, 0xf262004e,
    0x6c0695ed, 0x1b01a57b, 0x8208f4c1, 0xf50fc457, 0x65b0d9c6, 0x12b7e950,
    0x8bbeb8ea, 0xfcb9887c, 0x62dd1ddf, 0x15da2d49, 0x8cd37cf3, 0xfbd44c65,
    0x4db26158, 0x3ab551ce, 0xa3bc0074, 0xd4bb30e2, 0x4adfa541, 0x3dd895d7,
    0xa4d1c46d, 0xd3d6f4fb, 0x4369e96a, 0x346ed9fc, 0xad678846, 0xda60b8d0,
    0x44042d73, 0x33031de5, 0xaa0a4c5f, 0xdd0d7cc9, 0x5005713c, 0x270241aa,
    0xbe0b1010, 0xc90c2086, 0x5768b525, 0x206f85b3, 0xb966d409, 0xce61e49f,
    0x5edef90e, 0x29d9c998, 0xb0d09822, 0xc7d7a8b4, 0x59b33d17, 0x2eb40d81,
    0xb7bd5c3b, 0xc0ba6cad, 0xedb88320, 0x9abfb3b6, 0x03b6e20c, 0x74b1d29a,
    0xead54739, 0x9dd277af, 0x04db2615, 0x73dc1683, 0xe3630b12, 0x94643b84,
    0x0d6d6a3e, 0x7a6a5aa8, 0xe40ecf0b, 0x9309ff9d, 0x0a00ae27, 0x7d079eb1,
    0xf00f9344, 0x8708a3d2, 0x1e01f268, 0x6906c2fe, 0xf762575d, 0x806567cb,
    0x196c3671, 0x6e6b06e7, 0xfed41b76, 0x89d32be0, 0x10da7a5a, 0x67dd4acc,
    0xf9b9df6f, 0x8ebeeff9, 0x17b7be43, 0x60b08ed5, 0xd6d6a3e8, 0xa1d1937e,
    0x38d8c2c4, 0x4fdff252, 0xd1bb67f1, 0xa6bc5767, 0x3fb506dd, 0x48b2364b,
    0xd80d2bda, 0xaf0a1b4c, 0x36034af6, 0x41047a60, 0xdf60efc3, 0xa867df55,
    0x316e8eef, 0x4669be79, 0xcb61b38c, 0xbc66831a, 0x256fd2a0, 0x5268e236,
    0xcc0c7795, 0xbb0b4703, 0x220216b9, 0x5505262f, 0xc5ba3bbe, 0xb2bd0b28,
    0x2bb45a92, 0x5cb36a04, 0xc2d7ffa7, 0xb5d0cf31, 0x2cd99e8b, 0x5bdeae1d,
    0x9b64c2b0, 0xec63f226, 0x756aa39c, 0x026d930a, 0x9c0906a9, 0xeb0e363f,
    0x72076785, 0x05005713, 0x95bf4a82, 0xe2b87a14, 0x7bb12bae, 0x0cb61b38,
    0x92d28e9b, 0xe5d5be0d, 0x7cdcefb7, 0x0bdbdf21, 0x86d3d2d4, 0xf1d4e242,
    0x68ddb3f8, 0x1fda836e, 0x81be16cd, 0xf6b9265b, 0x6fb077e1, 0x18b74777,
    0x88085ae6, 0xff0f6a70, 0x66063bca, 0x11010b5c, 0x8f659eff, 0xf862ae69,
    0x616bffd3, 0x166ccf45, 0xa00ae278, 0xd70dd2ee, 0x4e048354, 0x3903b3c2,
    0xa7672661, 0xd06016f7, 0x4969474d, 0x3e6e77db, 0xaed16a4a, 0xd9d65adc,
    0x40df0b66, 0x37d83bf0, 0xa9bcae53, 0xdebb9ec5, 0x47b2cf7f, 0x30b5ffe9,
    0xbdbdf21c, 0xcabac28a, 0x53b39330, 0x24b4a3a6, 0xbad03605, 0xcdd70693,
    0x54de5729, 0x23d967bf, 0xb3667a2e, 0xc4614ab8, 0x5d681b02, 0x2a6f2b94,
    0xb40bbe37, 0xc30c8ea1, 0x5a05df1b, 0x2d02ef8d
]);
var ZipContainer = /** @class */ (function () {
    function ZipContainer() {
    }
    ZipContainer.addFolders = function (paths) {
        paths.forEach(this.addFolder.bind(this));
    };
    ZipContainer.addFolder = function (path) {
        this.folders.push({
            path: path,
            created: new Date(),
            isBase64: false
        });
    };
    ZipContainer.addFile = function (path, content, isBase64) {
        if (isBase64 === void 0) { isBase64 = false; }
        this.files.push({
            path: path,
            created: new Date(),
            content: content,
            isBase64: isBase64
        });
    };
    ZipContainer.getContent = function (mimeType) {
        if (mimeType === void 0) { mimeType = 'application/zip'; }
        var textOutput = this.buildFileStream();
        var uInt8Output = this.buildUint8Array(textOutput);
        this.clearStream();
        return new Blob([uInt8Output], { type: mimeType });
    };
    ZipContainer.clearStream = function () {
        this.folders = [];
        this.files = [];
    };
    ZipContainer.buildFileStream = function (fData) {
        var e_1, _a;
        if (fData === void 0) { fData = ''; }
        var totalFiles = this.folders.concat(this.files);
        var len = totalFiles.length;
        var foData = '';
        var lL = 0;
        var cL = 0;
        try {
            for (var totalFiles_1 = __values(totalFiles), totalFiles_1_1 = totalFiles_1.next(); !totalFiles_1_1.done; totalFiles_1_1 = totalFiles_1.next()) {
                var currentFile = totalFiles_1_1.value;
                var _b = this.getHeader(currentFile, lL), fileHeader = _b.fileHeader, folderHeader = _b.folderHeader, content = _b.content;
                lL += fileHeader.length + content.length;
                cL += folderHeader.length;
                fData += fileHeader + content;
                foData += folderHeader;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (totalFiles_1_1 && !totalFiles_1_1.done && (_a = totalFiles_1.return)) _a.call(totalFiles_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var foEnd = this.buildFolderEnd(len, cL, lL);
        return fData + foData + foEnd;
    };
    ZipContainer.getHeader = function (currentFile, offset) {
        var content = currentFile.content, path = currentFile.path, created = currentFile.created, isBase64 = currentFile.isBase64;
        var utf8_encode = core._.utf8_encode, decToHex = core._.decToHex;
        var utfPath = utf8_encode(path);
        var isUTF8 = utfPath !== path;
        var time = this.convertTime(created);
        var dt = this.convertDate(created);
        var extraFields = '';
        if (isUTF8) {
            var uExtraFieldPath = decToHex(1, 1) + decToHex(this.getFromCrc32Table(utfPath), 4) + utfPath;
            extraFields = "\x75\x70" + decToHex(uExtraFieldPath.length, 2) + uExtraFieldPath;
        }
        var _a = !content ? { size: 0, content: '' } : this.getConvertedContent(content, isBase64), size = _a.size, convertedContent = _a.content;
        var header = '\x0A\x00' +
            (isUTF8 ? '\x00\x08' : '\x00\x00') +
            '\x00\x00' +
            decToHex(time, 2) + // last modified time
            decToHex(dt, 2) + // last modified date
            decToHex(size ? this.getFromCrc32Table(convertedContent) : 0, 4) +
            decToHex(size, 4) + // compressed size
            decToHex(size, 4) + // uncompressed size
            decToHex(utfPath.length, 2) + // file name length
            decToHex(extraFields.length, 2); // extra field length
        var fileHeader = 'PK\x03\x04' + header + utfPath + extraFields;
        var folderHeader = 'PK\x01\x02' + // central header
            '\x14\x00' +
            header + // file header
            '\x00\x00' +
            '\x00\x00' +
            '\x00\x00' +
            (content ? '\x00\x00\x00\x00' : '\x10\x00\x00\x00') + // external file attributes
            decToHex(offset, 4) + // relative offset of local header
            utfPath + // file name
            extraFields; // extra field
        return { fileHeader: fileHeader, folderHeader: folderHeader, content: convertedContent || '' };
    };
    ZipContainer.getConvertedContent = function (content, isBase64) {
        if (isBase64 === void 0) { isBase64 = false; }
        if (isBase64) {
            content = content.split(';base64,')[1];
        }
        content = isBase64 ? atob(content) : content;
        return {
            size: content.length,
            content: content
        };
    };
    ZipContainer.buildFolderEnd = function (tLen, cLen, lLen) {
        var decToHex = core._.decToHex;
        return 'PK\x05\x06' + // central folder end
            '\x00\x00' +
            '\x00\x00' +
            decToHex(tLen, 2) + // total number of entries in the central folder
            decToHex(tLen, 2) + // total number of entries in the central folder
            decToHex(cLen, 4) + // size of the central folder
            decToHex(lLen, 4) + // central folder start offset
            '\x00\x00';
    };
    ZipContainer.buildUint8Array = function (content) {
        var uint8 = new Uint8Array(content.length);
        for (var i = 0; i < uint8.length; i++) {
            uint8[i] = content.charCodeAt(i);
        }
        return uint8;
    };
    ZipContainer.getFromCrc32Table = function (content) {
        if (!content.length) {
            return 0;
        }
        var size = content.length;
        var iterable = new Uint8Array(size);
        for (var i = 0; i < size; i++) {
            iterable[i] = content.charCodeAt(i);
        }
        var crc = 0 ^ (-1);
        var j = 0;
        var k = 0;
        var l = 0;
        for (var i = 0; i < size; i++) {
            j = iterable[i];
            k = (crc ^ j) & 0xFF;
            l = crcTable[k];
            crc = (crc >>> 8) ^ l;
        }
        return crc ^ (-1);
    };
    ZipContainer.convertTime = function (date) {
        var time = date.getHours();
        time <<= 6;
        time = time | date.getMinutes();
        time <<= 5;
        time = time | date.getSeconds() / 2;
        return time;
    };
    ZipContainer.convertDate = function (date) {
        var dt = date.getFullYear() - 1980;
        dt <<= 4;
        dt = dt | (date.getMonth() + 1);
        dt <<= 5;
        dt = dt | date.getDate();
        return dt;
    };
    ZipContainer.folders = [];
    ZipContainer.files = [];
    return ZipContainer;
}());

exports.BaseCreator = BaseCreator;
exports.BaseGridSerializingSession = BaseGridSerializingSession;
exports.CsvCreator = CsvCreator;
exports.CsvExportModule = CsvExportModule;
exports.Downloader = Downloader;
exports.GridSerializer = GridSerializer;
exports.XmlFactory = XmlFactory;
exports.ZipContainer = ZipContainer;

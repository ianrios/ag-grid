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
var __assign = (this && this.__assign) || function () {
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcelCreator = exports.exportMultipleSheetsAsExcel = exports.getMultipleSheetsAsExcel = void 0;
var core_1 = require("@ag-grid-community/core");
var excelXlsxFactory_1 = require("./excelXlsxFactory");
var csv_export_1 = require("@ag-grid-community/csv-export");
var excelSerializingSession_1 = require("./excelSerializingSession");
var getMultipleSheetsAsExcel = function (params) {
    var data = params.data, _a = params.fontSize, fontSize = _a === void 0 ? 11 : _a, _b = params.author, author = _b === void 0 ? 'AG Grid' : _b;
    var hasImages = excelXlsxFactory_1.ExcelXlsxFactory.images.size > 0;
    csv_export_1.ZipContainer.addFolders([
        '_rels/',
        'docProps/',
        'xl/',
        'xl/theme/',
        'xl/_rels/',
        'xl/worksheets/'
    ]);
    if (hasImages) {
        csv_export_1.ZipContainer.addFolders([
            'xl/worksheets/_rels',
            'xl/drawings/',
            'xl/drawings/_rels',
            'xl/media/',
        ]);
        var imgCounter_1 = 0;
        excelXlsxFactory_1.ExcelXlsxFactory.images.forEach(function (value) {
            var firstImage = value[0].image[0];
            var ext = firstImage.imageType;
            csv_export_1.ZipContainer.addFile("xl/media/image".concat(++imgCounter_1, ".").concat(ext), firstImage.base64, true);
        });
    }
    if (!data || data.length === 0) {
        console.warn("AG Grid: Invalid params supplied to getMultipleSheetsAsExcel() - `ExcelExportParams.data` is empty.");
        excelXlsxFactory_1.ExcelXlsxFactory.resetFactory();
        return;
    }
    var sheetLen = data.length;
    var imageRelationCounter = 0;
    data.forEach(function (value, idx) {
        csv_export_1.ZipContainer.addFile("xl/worksheets/sheet".concat(idx + 1, ".xml"), value);
        if (hasImages && excelXlsxFactory_1.ExcelXlsxFactory.worksheetImages.get(idx)) {
            createImageRelationsForSheet(idx, imageRelationCounter++);
        }
    });
    csv_export_1.ZipContainer.addFile('xl/workbook.xml', excelXlsxFactory_1.ExcelXlsxFactory.createWorkbook());
    csv_export_1.ZipContainer.addFile('xl/styles.xml', excelXlsxFactory_1.ExcelXlsxFactory.createStylesheet(fontSize));
    csv_export_1.ZipContainer.addFile('xl/sharedStrings.xml', excelXlsxFactory_1.ExcelXlsxFactory.createSharedStrings());
    csv_export_1.ZipContainer.addFile('xl/theme/theme1.xml', excelXlsxFactory_1.ExcelXlsxFactory.createTheme());
    csv_export_1.ZipContainer.addFile('xl/_rels/workbook.xml.rels', excelXlsxFactory_1.ExcelXlsxFactory.createWorkbookRels(sheetLen));
    csv_export_1.ZipContainer.addFile('docProps/core.xml', excelXlsxFactory_1.ExcelXlsxFactory.createCore(author));
    csv_export_1.ZipContainer.addFile('[Content_Types].xml', excelXlsxFactory_1.ExcelXlsxFactory.createContentTypes(sheetLen));
    csv_export_1.ZipContainer.addFile('_rels/.rels', excelXlsxFactory_1.ExcelXlsxFactory.createRels());
    excelXlsxFactory_1.ExcelXlsxFactory.resetFactory();
    var mimeType = params.mimeType || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    return csv_export_1.ZipContainer.getContent(mimeType);
};
exports.getMultipleSheetsAsExcel = getMultipleSheetsAsExcel;
var exportMultipleSheetsAsExcel = function (params) {
    var _a = params.fileName, fileName = _a === void 0 ? 'export.xlsx' : _a;
    var contents = (0, exports.getMultipleSheetsAsExcel)(params);
    if (contents) {
        csv_export_1.Downloader.download(fileName, contents);
    }
};
exports.exportMultipleSheetsAsExcel = exportMultipleSheetsAsExcel;
var createImageRelationsForSheet = function (sheetIndex, currentRelationIndex) {
    var drawingFolder = 'xl/drawings';
    var drawingFileName = "".concat(drawingFolder, "/drawing").concat(currentRelationIndex + 1, ".xml");
    var relFileName = "".concat(drawingFolder, "/_rels/drawing").concat(currentRelationIndex + 1, ".xml.rels");
    var worksheetRelFile = "xl/worksheets/_rels/sheet".concat(sheetIndex + 1, ".xml.rels");
    csv_export_1.ZipContainer.addFile(relFileName, excelXlsxFactory_1.ExcelXlsxFactory.createDrawingRel(sheetIndex));
    csv_export_1.ZipContainer.addFile(drawingFileName, excelXlsxFactory_1.ExcelXlsxFactory.createDrawing(sheetIndex));
    csv_export_1.ZipContainer.addFile(worksheetRelFile, excelXlsxFactory_1.ExcelXlsxFactory.createWorksheetDrawingRel(currentRelationIndex));
};
var ExcelCreator = /** @class */ (function (_super) {
    __extends(ExcelCreator, _super);
    function ExcelCreator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ExcelCreator.prototype.postConstruct = function () {
        this.setBeans({
            gridSerializer: this.gridSerializer,
            gridOptionsService: this.gridOptionsService
        });
    };
    ExcelCreator.prototype.getMergedParams = function (params) {
        var baseParams = this.gridOptionsService.get('defaultExcelExportParams');
        return Object.assign({}, baseParams, params);
    };
    ExcelCreator.prototype.export = function (userParams) {
        if (this.isExportSuppressed()) {
            console.warn("AG Grid: Export cancelled. Export is not allowed as per your configuration.");
            return '';
        }
        var mergedParams = this.getMergedParams(userParams);
        var data = this.getData(mergedParams);
        var exportParams = {
            data: [data],
            fontSize: mergedParams.fontSize,
            author: mergedParams.author,
            mimeType: mergedParams.mimeType
        };
        var packageFile = this.packageFile(exportParams);
        if (packageFile) {
            csv_export_1.Downloader.download(this.getFileName(mergedParams.fileName), packageFile);
        }
        return data;
    };
    ExcelCreator.prototype.exportDataAsExcel = function (params) {
        return this.export(params);
    };
    ExcelCreator.prototype.getDataAsExcel = function (params) {
        var mergedParams = this.getMergedParams(params);
        var data = this.getData(mergedParams);
        var exportParams = {
            data: [data],
            fontSize: mergedParams.fontSize,
            author: mergedParams.author,
            mimeType: mergedParams.mimeType
        };
        return this.packageFile(exportParams);
    };
    ExcelCreator.prototype.setFactoryMode = function (factoryMode) {
        excelXlsxFactory_1.ExcelXlsxFactory.factoryMode = factoryMode;
    };
    ExcelCreator.prototype.getFactoryMode = function () {
        return excelXlsxFactory_1.ExcelXlsxFactory.factoryMode;
    };
    ExcelCreator.prototype.getSheetDataForExcel = function (params) {
        var mergedParams = this.getMergedParams(params);
        var data = this.getData(mergedParams);
        return data;
    };
    ExcelCreator.prototype.getMultipleSheetsAsExcel = function (params) {
        return (0, exports.getMultipleSheetsAsExcel)(params);
    };
    ExcelCreator.prototype.exportMultipleSheetsAsExcel = function (params) {
        return (0, exports.exportMultipleSheetsAsExcel)(params);
    };
    ExcelCreator.prototype.getDefaultFileExtension = function () {
        return 'xlsx';
    };
    ExcelCreator.prototype.createSerializingSession = function (params) {
        var _a = this, columnModel = _a.columnModel, valueService = _a.valueService, gridOptionsService = _a.gridOptionsService, valueFormatterService = _a.valueFormatterService, valueParserService = _a.valueParserService;
        var sheetName = 'ag-grid';
        if (params.sheetName != null) {
            sheetName = core_1._.utf8_encode(String(params.sheetName).substring(0, 31));
        }
        var config = __assign(__assign({}, params), { sheetName: sheetName, columnModel: columnModel, valueService: valueService, gridOptionsService: gridOptionsService, valueFormatterService: valueFormatterService, valueParserService: valueParserService, suppressRowOutline: params.suppressRowOutline || params.skipRowGroups, headerRowHeight: params.headerRowHeight || params.rowHeight, baseExcelStyles: this.gridOptionsService.get('excelStyles') || [], styleLinker: this.styleLinker.bind(this) });
        return new excelSerializingSession_1.ExcelSerializingSession(config);
    };
    ExcelCreator.prototype.styleLinker = function (params) {
        var rowType = params.rowType, rowIndex = params.rowIndex, value = params.value, column = params.column, columnGroup = params.columnGroup, node = params.node;
        var isHeader = rowType === csv_export_1.RowType.HEADER;
        var isGroupHeader = rowType === csv_export_1.RowType.HEADER_GROUPING;
        var col = (isHeader ? column : columnGroup);
        var headerClasses = [];
        if (isHeader || isGroupHeader) {
            headerClasses.push('header');
            if (isGroupHeader) {
                headerClasses.push('headerGroup');
            }
            if (col) {
                headerClasses = headerClasses.concat(core_1.CssClassApplier.getHeaderClassesFromColDef(col.getDefinition(), this.gridOptionsService, column || null, columnGroup || null));
            }
            return headerClasses;
        }
        var styles = this.gridOptionsService.get('excelStyles');
        var applicableStyles = ["cell"];
        if (!styles || !styles.length) {
            return applicableStyles;
        }
        var styleIds = styles.map(function (it) {
            return it.id;
        });
        this.stylingService.processAllCellClasses(column.getDefinition(), {
            value: value,
            data: node.data,
            node: node,
            colDef: column.getDefinition(),
            column: column,
            rowIndex: rowIndex,
            api: this.gridOptionsService.api,
            columnApi: this.gridOptionsService.columnApi,
            context: this.gridOptionsService.context
        }, function (className) {
            if (styleIds.indexOf(className) > -1) {
                applicableStyles.push(className);
            }
        });
        return applicableStyles.sort(function (left, right) {
            return (styleIds.indexOf(left) < styleIds.indexOf(right)) ? -1 : 1;
        });
    };
    ExcelCreator.prototype.isExportSuppressed = function () {
        return this.gridOptionsService.get('suppressExcelExport');
    };
    ExcelCreator.prototype.packageFile = function (params) {
        return (0, exports.getMultipleSheetsAsExcel)(params);
    };
    __decorate([
        (0, core_1.Autowired)('columnModel')
    ], ExcelCreator.prototype, "columnModel", void 0);
    __decorate([
        (0, core_1.Autowired)('valueService')
    ], ExcelCreator.prototype, "valueService", void 0);
    __decorate([
        (0, core_1.Autowired)('stylingService')
    ], ExcelCreator.prototype, "stylingService", void 0);
    __decorate([
        (0, core_1.Autowired)('gridSerializer')
    ], ExcelCreator.prototype, "gridSerializer", void 0);
    __decorate([
        (0, core_1.Autowired)('gridOptionsService')
    ], ExcelCreator.prototype, "gridOptionsService", void 0);
    __decorate([
        (0, core_1.Autowired)('valueFormatterService')
    ], ExcelCreator.prototype, "valueFormatterService", void 0);
    __decorate([
        (0, core_1.Autowired)('valueParserService')
    ], ExcelCreator.prototype, "valueParserService", void 0);
    __decorate([
        core_1.PostConstruct
    ], ExcelCreator.prototype, "postConstruct", null);
    ExcelCreator = __decorate([
        (0, core_1.Bean)('excelCreator')
    ], ExcelCreator);
    return ExcelCreator;
}(csv_export_1.BaseCreator));
exports.ExcelCreator = ExcelCreator;

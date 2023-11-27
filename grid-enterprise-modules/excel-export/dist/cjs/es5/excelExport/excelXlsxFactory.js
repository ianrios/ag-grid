"use strict";
var __read = (this && this.__read) || function (o, n) {
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcelXlsxFactory = void 0;
var core_1 = require("@ag-grid-community/core");
var core_2 = require("./files/ooxml/core");
var contentTypes_1 = require("./files/ooxml/contentTypes");
var drawing_1 = require("./files/ooxml/drawing");
var office_1 = require("./files/ooxml/themes/office");
var sharedStrings_1 = require("./files/ooxml/sharedStrings");
var stylesheet_1 = require("./files/ooxml/styles/stylesheet");
var workbook_1 = require("./files/ooxml/workbook");
var worksheet_1 = require("./files/ooxml/worksheet");
var relationships_1 = require("./files/ooxml/relationships");
var excelUtils_1 = require("./assets/excelUtils");
/**
 * See https://www.ecma-international.org/news/TC45_current_work/OpenXML%20White%20Paper.pdf
 */
var ExcelXlsxFactory = /** @class */ (function () {
    function ExcelXlsxFactory() {
    }
    ExcelXlsxFactory.createExcel = function (styles, worksheet, config) {
        this.addSheetName(worksheet);
        (0, stylesheet_1.registerStyles)(styles, this.sheetNames.length);
        return this.createWorksheet(worksheet, config);
    };
    ExcelXlsxFactory.buildImageMap = function (image, rowIndex, col, columnsToExport, rowHeight) {
        var currentSheetIndex = this.sheetNames.length;
        var registeredImage = this.images.get(image.id);
        if (!image.position || !image.position.row || !image.position.column) {
            if (!image.position) {
                image.position = {};
            }
            image.position = Object.assign({}, image.position, {
                row: rowIndex,
                column: columnsToExport.indexOf(col) + 1
            });
        }
        var calculatedImage = image;
        (0, excelUtils_1.setExcelImageTotalWidth)(calculatedImage, columnsToExport);
        (0, excelUtils_1.setExcelImageTotalHeight)(calculatedImage, rowHeight);
        if (registeredImage) {
            var currentSheetImages = registeredImage.find(function (currentImage) { return currentImage.sheetId === currentSheetIndex; });
            if (currentSheetImages) {
                currentSheetImages.image.push(calculatedImage);
            }
            else {
                registeredImage.push({
                    sheetId: currentSheetIndex,
                    image: [calculatedImage]
                });
            }
        }
        else {
            this.images.set(calculatedImage.id, [{ sheetId: currentSheetIndex, image: [calculatedImage] }]);
            this.workbookImageIds.set(calculatedImage.id, { type: calculatedImage.imageType, index: this.workbookImageIds.size });
        }
        this.buildSheetImageMap(currentSheetIndex, calculatedImage);
    };
    ExcelXlsxFactory.buildSheetImageMap = function (sheetIndex, image) {
        var worksheetImageIdMap = this.worksheetImageIds.get(sheetIndex);
        if (!worksheetImageIdMap) {
            worksheetImageIdMap = new Map();
            this.worksheetImageIds.set(sheetIndex, worksheetImageIdMap);
        }
        var sheetImages = this.worksheetImages.get(sheetIndex);
        if (!sheetImages) {
            this.worksheetImages.set(sheetIndex, [image]);
            worksheetImageIdMap.set(image.id, { index: 0, type: image.imageType });
        }
        else {
            sheetImages.push(image);
            if (!worksheetImageIdMap.get(image.id)) {
                worksheetImageIdMap.set(image.id, { index: worksheetImageIdMap.size, type: image.imageType });
            }
        }
    };
    ExcelXlsxFactory.addSheetName = function (worksheet) {
        var name = core_1._.escapeString(worksheet.name) || '';
        var append = '';
        while (this.sheetNames.indexOf("".concat(name).concat(append)) !== -1) {
            if (append === '') {
                append = '_1';
            }
            else {
                var curr = parseInt(append.slice(1), 10);
                append = "_".concat(curr + 1);
            }
        }
        worksheet.name = "".concat(name).concat(append);
        this.sheetNames.push(worksheet.name);
    };
    ExcelXlsxFactory.getStringPosition = function (str) {
        if (this.sharedStrings.has(str)) {
            return this.sharedStrings.get(str);
        }
        this.sharedStrings.set(str, this.sharedStrings.size);
        return this.sharedStrings.size - 1;
    };
    ExcelXlsxFactory.resetFactory = function () {
        this.sharedStrings = new Map();
        this.images = new Map();
        this.worksheetImages = new Map();
        this.workbookImageIds = new Map();
        this.worksheetImageIds = new Map();
        this.sheetNames = [];
        this.factoryMode = core_1.ExcelFactoryMode.SINGLE_SHEET;
    };
    ExcelXlsxFactory.createWorkbook = function () {
        return (0, excelUtils_1.createXmlPart)(workbook_1.default.getTemplate(this.sheetNames));
    };
    ExcelXlsxFactory.createStylesheet = function (defaultFontSize) {
        return (0, excelUtils_1.createXmlPart)(stylesheet_1.default.getTemplate(defaultFontSize));
    };
    ExcelXlsxFactory.createSharedStrings = function () {
        return (0, excelUtils_1.createXmlPart)(sharedStrings_1.default.getTemplate(this.sharedStrings));
    };
    ExcelXlsxFactory.createCore = function (author) {
        return (0, excelUtils_1.createXmlPart)(core_2.default.getTemplate(author));
    };
    ExcelXlsxFactory.createContentTypes = function (sheetLen) {
        return (0, excelUtils_1.createXmlPart)(contentTypes_1.default.getTemplate(sheetLen));
    };
    ExcelXlsxFactory.createRels = function () {
        var rs = relationships_1.default.getTemplate([{
                Id: 'rId1',
                Type: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument',
                Target: 'xl/workbook.xml'
            }, {
                Id: 'rId2',
                Type: 'http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties',
                Target: 'docProps/core.xml'
            }]);
        return (0, excelUtils_1.createXmlPart)(rs);
    };
    ExcelXlsxFactory.createTheme = function () {
        return (0, excelUtils_1.createXmlPart)(office_1.default.getTemplate());
    };
    ExcelXlsxFactory.createWorkbookRels = function (sheetLen) {
        var worksheets = new Array(sheetLen).fill(undefined).map(function (v, i) { return ({
            Id: "rId".concat(i + 1),
            Type: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet',
            Target: "worksheets/sheet".concat(i + 1, ".xml")
        }); });
        var rs = relationships_1.default.getTemplate(__spreadArray(__spreadArray([], __read(worksheets), false), [
            {
                Id: "rId".concat(sheetLen + 1),
                Type: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme',
                Target: 'theme/theme1.xml'
            }, {
                Id: "rId".concat(sheetLen + 2),
                Type: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles',
                Target: 'styles.xml'
            }, {
                Id: "rId".concat(sheetLen + 3),
                Type: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings',
                Target: 'sharedStrings.xml'
            }
        ], false));
        return (0, excelUtils_1.createXmlPart)(rs);
    };
    ExcelXlsxFactory.createDrawing = function (sheetIndex) {
        return (0, excelUtils_1.createXmlPart)(drawing_1.default.getTemplate({ sheetIndex: sheetIndex }));
    };
    ExcelXlsxFactory.createDrawingRel = function (sheetIndex) {
        var _this = this;
        var worksheetImageIds = this.worksheetImageIds.get(sheetIndex);
        var XMLArr = [];
        worksheetImageIds.forEach(function (value, key) {
            XMLArr.push({
                Id: "rId".concat(value.index + 1),
                Type: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/image',
                Target: "../media/image".concat(_this.workbookImageIds.get(key).index + 1, ".").concat(value.type)
            });
        });
        return (0, excelUtils_1.createXmlPart)(relationships_1.default.getTemplate(XMLArr));
    };
    ExcelXlsxFactory.createWorksheetDrawingRel = function (currentRelationIndex) {
        var rs = relationships_1.default.getTemplate([{
                Id: 'rId1',
                Type: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing',
                Target: "../drawings/drawing".concat(currentRelationIndex + 1, ".xml")
            }]);
        return (0, excelUtils_1.createXmlPart)(rs);
    };
    ExcelXlsxFactory.createWorksheet = function (worksheet, config) {
        return (0, excelUtils_1.createXmlPart)(worksheet_1.default.getTemplate({
            worksheet: worksheet,
            currentSheet: this.sheetNames.length - 1,
            config: config
        }));
    };
    ExcelXlsxFactory.sharedStrings = new Map();
    ExcelXlsxFactory.sheetNames = [];
    /** Maps images to sheet */
    ExcelXlsxFactory.images = new Map();
    /** Maps sheets to images */
    ExcelXlsxFactory.worksheetImages = new Map();
    /** Maps all workbook images to a global Id */
    ExcelXlsxFactory.workbookImageIds = new Map();
    /** Maps all sheet images to unique Ids */
    ExcelXlsxFactory.worksheetImageIds = new Map();
    ExcelXlsxFactory.factoryMode = core_1.ExcelFactoryMode.SINGLE_SHEET;
    return ExcelXlsxFactory;
}());
exports.ExcelXlsxFactory = ExcelXlsxFactory;
